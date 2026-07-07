const Url = require("../models/Url");
const { sendSuccess, sendError } = require("../utils/responseHandler");
const generateQRCode = require("../utils/generateQRCode");
const { generateUniqueShortCode, validateCustomCode } = require("../services/shortCodeGenerator");
const {
  buildEmptyDailyClicks,
  buildEmptyBreakdowns,
  recordClick,
  normalizeDevicePercentages,
  formatRelativeTime,
  deriveTitleFromUrl,
} = require("../services/analyticsService");

const SHORT_DOMAIN = process.env.SHORT_DOMAIN || "localhost:5000";

/**
 * Converts a Url mongoose document into the plain shape the frontend expects.
 */
function serializeUrl(url) {
  return {
    id: url._id.toString(),
    title: url.title || deriveTitleFromUrl(url.originalUrl),
    originalUrl: url.originalUrl,
    shortCode: url.shortCode,
    shortUrl: `${SHORT_DOMAIN}/${url.shortCode}`,
    tags: url.tags || [],
    active: url.active,
    clicks: url.clicks,
    lastClick: formatRelativeTime(url.lastClickAt),
    dailyClicks: url.dailyClicks || [],
    qrCode: url.qrCode || null,
    createdAt: url.createdAt,
  };
}

/**
 * GET /api/urls
 * Lists every link owned by the authenticated user, newest first.
 */
async function listUrls(req, res, next) {
  try {
    const urls = await Url.find({ user: req.user._id }).sort({ createdAt: -1 });
    return sendSuccess(res, { urls: urls.map(serializeUrl) });
  } catch (err) {
    return next(err);
  }
}

/**
 * POST /api/urls
 * Creates a new short link for the authenticated user.
 */
async function createUrl(req, res, next) {
  try {
    const { originalUrl, customCode, title, tags } = req.body;

    let shortCode;
    let isCustomCode = false;

    if (customCode) {
      const { valid, error } = await validateCustomCode(customCode);
      if (!valid) return sendError(res, error, 400);
      shortCode = customCode;
      isCustomCode = true;
    } else {
      shortCode = await generateUniqueShortCode();
    }

    const qrCode = await generateQRCode(`https://${SHORT_DOMAIN}/${shortCode}`);
    const breakdowns = buildEmptyBreakdowns();

    const url = await Url.create({
      user: req.user._id,
      title: title?.trim() || deriveTitleFromUrl(originalUrl),
      originalUrl,
      shortCode,
      isCustomCode,
      tags: Array.isArray(tags) ? tags : [],
      qrCode,
      dailyClicks: buildEmptyDailyClicks(),
      referrers: breakdowns.referrers,
      devices: breakdowns.devices,
      countries: breakdowns.countries,
    });

    return sendSuccess(res, { url: serializeUrl(url) }, 201);
  } catch (err) {
    return next(err);
  }
}

/**
 * PATCH /api/urls/:id
 * Updates editable fields (title, tags, active) on a link the user owns.
 */
async function updateUrl(req, res, next) {
  try {
    const { title, tags, active } = req.body;

    const url = await Url.findOne({ _id: req.params.id, user: req.user._id });
    if (!url) return sendError(res, "Link not found", 404);

    if (title !== undefined) url.title = title.trim();
    if (tags !== undefined) url.tags = Array.isArray(tags) ? tags : url.tags;
    if (active !== undefined) url.active = Boolean(active);

    await url.save();
    return sendSuccess(res, { url: serializeUrl(url) });
  } catch (err) {
    return next(err);
  }
}

/**
 * DELETE /api/urls/:id
 * Removes a link the user owns.
 */
async function deleteUrl(req, res, next) {
  try {
    const url = await Url.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!url) return sendError(res, "Link not found", 404);
    return sendSuccess(res, { id: req.params.id });
  } catch (err) {
    return next(err);
  }
}

/**
 * POST /api/urls/demo
 * Public, unauthenticated endpoint used by the homepage's "try it free" box.
 * Creates a throwaway link with no owner so visitors get a real short URL
 * before signing up.
 */
async function createDemoUrl(req, res, next) {
  try {
    const { originalUrl } = req.body;
    if (!originalUrl || !/^https?:\/\/.+/i.test(originalUrl)) {
      return sendError(res, "A valid URL starting with http:// or https:// is required", 400);
    }

    const shortCode = await generateUniqueShortCode();

    // Persisted with no owner so the link actually redirects if someone
    // scans/clicks it, but it never shows up on any user's dashboard.
    await Url.create({
      user: null,
      title: deriveTitleFromUrl(originalUrl),
      originalUrl,
      shortCode,
      dailyClicks: buildEmptyDailyClicks(),
      ...buildEmptyBreakdowns(),
    });

    return sendSuccess(res, { shortUrl: `${SHORT_DOMAIN}/${shortCode}`, shortCode });
  } catch (err) {
    return next(err);
  }
}

/**
 * GET /:shortCode  (mounted outside /api)
 * Public redirect handler — the actual "short link goes to long link" hop.
 */
async function redirectToOriginal(req, res, next) {
  try {
    const { shortCode } = req.params;
    const url = await Url.findOne({ shortCode });

    if (!url || !url.active) {
      const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
      return res.redirect(302, `${clientUrl}/404`);
    }

    recordClick(url, req);
    await url.save();

    return res.redirect(302, url.originalUrl);
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  serializeUrl,
  normalizeDevicePercentages,
  listUrls,
  createUrl,
  updateUrl,
  deleteUrl,
  createDemoUrl,
  redirectToOriginal,
};
