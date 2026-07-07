const Url = require("../models/Url");
const { sendSuccess, sendError } = require("../utils/responseHandler");
const { normalizeDevicePercentages } = require("./urlController");
const { formatRelativeTime, buildEmptyDailyClicks } = require("../services/analyticsService");

/**
 * GET /api/analytics/:id
 * Returns the full analytics breakdown for a single link owned by the user.
 */
async function getUrlAnalytics(req, res, next) {
  try {
    const url = await Url.findOne({ _id: req.params.id, user: req.user._id });
    if (!url) return sendError(res, "Link not found", 404);

    const analytics = {
      id: url._id.toString(),
      shortCode: url.shortCode,
      title: url.title,
      clicks: url.clicks,
      lastClick: formatRelativeTime(url.lastClickAt),
      dailyClicks: url.dailyClicks && url.dailyClicks.length ? url.dailyClicks : buildEmptyDailyClicks(),
      referrers: url.referrers || [],
      devices: normalizeDevicePercentages(url.devices || []),
      countries: url.countries && url.countries.length
        ? url.countries
        : [{ country: "No data yet", flag: "🌐", count: 0 }],
    };

    return sendSuccess(res, { analytics });
  } catch (err) {
    return next(err);
  }
}

module.exports = { getUrlAnalytics };
