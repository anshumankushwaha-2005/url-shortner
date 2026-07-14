const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * Builds the last N days (default 7) as { date: "Mon", clicks: 0 } buckets,
 * oldest first, ending with today. Used to seed a new link's analytics.
 */
function buildEmptyDailyClicks(days = 7) {
  const buckets = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i -= 1) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    buckets.push({ date: DAY_LABELS[d.getDay()], clicks: 0 });
  }
  return buckets;
}

/**
 * Default breakdown rows so the UI has something sensible to render
 * before any real traffic comes in.
 */
function buildEmptyBreakdowns() {
  return {
    referrers: [],
    devices: [],
    countries: [],
  };
}

/**
 * Classifies a device family from a User-Agent string. Simple heuristic,
 * good enough for demo analytics without pulling in a full UA-parsing lib.
 */
function detectDevice(userAgent = "") {
  const ua = userAgent.toLowerCase();
  if (/ipad|tablet|kindle|playbook/.test(ua)) return "Tablet";
  if (/mobi|iphone|ipod|android.*mobile/.test(ua)) return "Mobile";
  return "Desktop";
}

/**
 * Extracts a readable referrer source ("Direct" if none) from a Referer header.
 */
function detectReferrerSource(referer) {
  if (!referer) return "Direct";
  try {
    const host = new URL(referer).hostname.replace(/^www\./, "");
    return host || "Direct";
  } catch {
    return "Direct";
  }
}

/**
 * Records a single click against a Url document in-place (does not save).
 * Updates the click count, today's daily bucket, device/referrer tallies,
 * and the last-click timestamp. Caller is responsible for `url.save()`.
 */
function recordClick(url, req) {
  const now = new Date();
  url.clicks += 1;
  url.lastClickAt = now;

  // Bump (or roll) today's bucket.
  const todayLabel = DAY_LABELS[now.getDay()];
  const daily = url.dailyClicks && url.dailyClicks.length ? url.dailyClicks : buildEmptyDailyClicks();
  const last = daily[daily.length - 1];
  if (last && last.date === todayLabel) {
    last.clicks += 1;
  } else {
    daily.push({ date: todayLabel, clicks: 1 });
    if (daily.length > 7) daily.shift();
  }
  url.dailyClicks = daily;

  // Referrer tally.
  const source = detectReferrerSource(req.get("Referer") || req.get("Referrer"));
  const referrers = url.referrers && url.referrers.length ? url.referrers : buildEmptyBreakdowns().referrers;
  const refRow = referrers.find((r) => r.source === source);
  if (refRow) refRow.count += 1;
  else referrers.push({ source, count: 1 });
  url.referrers = referrers.sort((a, b) => b.count - a.count).slice(0, 6);

  // Device tally, stored as raw counts internally then normalized to % on read.
  const device = detectDevice(req.get("User-Agent"));
  const devices = url.devices && url.devices.length ? url.devices : buildEmptyBreakdowns().devices;
  const devRow = devices.find((d) => d.device === device);
  if (devRow) devRow.pct += 1; // repurposed as a running count, normalized on read
  else devices.push({ device, pct: 1 });
  url.devices = devices;

  return url;
}

/**
 * Converts the running device counts stored on the document into display
 * percentages that sum to ~100, without mutating the stored document.
 */
function normalizeDevicePercentages(devices = []) {
  const total = devices.reduce((sum, d) => sum + d.pct, 0);
  if (total === 0) return devices.map((d) => ({ device: d.device, pct: 0 }));
  return devices
    .map((d) => ({ device: d.device, pct: Math.round((d.pct / total) * 100) }))
    .sort((a, b) => b.pct - a.pct);
}

/**
 * Formats a Date (or null) as a short relative-time string for display,
 * e.g. "Never", "Just now", "5m ago", "3h ago", "2d ago", "Jul 3".
 */
function formatRelativeTime(date) {
  if (!date) return "Never";
  const diffMs = Date.now() - new Date(date).getTime();
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diffMs < minute) return "Just now";
  if (diffMs < hour) return `${Math.floor(diffMs / minute)}m ago`;
  if (diffMs < day) return `${Math.floor(diffMs / hour)}h ago`;
  if (diffMs < 7 * day) return `${Math.floor(diffMs / day)}d ago`;
  return new Date(date).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

/**
 * Derives a friendly default title from a URL's hostname + path when the
 * user doesn't supply one, e.g. "example.com/blog/my-post".
 */
function deriveTitleFromUrl(originalUrl) {
  try {
    const u = new URL(originalUrl);
    const path = u.pathname !== "/" ? u.pathname : "";
    return `${u.hostname.replace(/^www\./, "")}${path}`.slice(0, 80);
  } catch {
    return originalUrl.slice(0, 80);
  }
}

module.exports = {
  buildEmptyDailyClicks,
  buildEmptyBreakdowns,
  recordClick,
  normalizeDevicePercentages,
  formatRelativeTime,
  deriveTitleFromUrl,
};
