const mongoose = require("mongoose");

const dailyClickSchema = new mongoose.Schema(
  {
    date: { type: String, required: true }, // e.g. "Mon", "Jul 3"
    clicks: { type: Number, default: 0 },
  },
  { _id: false }
);

const referrerSchema = new mongoose.Schema(
  {
    source: { type: String, required: true }, // e.g. "Direct", "google.com"
    count: { type: Number, default: 0 },
  },
  { _id: false }
);

const deviceSchema = new mongoose.Schema(
  {
    device: { type: String, required: true }, // "Desktop" | "Mobile" | "Tablet"
    pct: { type: Number, default: 0 },
  },
  { _id: false }
);

const countrySchema = new mongoose.Schema(
  {
    country: { type: String, required: true },
    flag: { type: String, default: "🌐" },
    count: { type: Number, default: 0 },
  },
  { _id: false }
);

const urlSchema = new mongoose.Schema(
  {
    user: {
      // Null for anonymous links created through the public homepage demo box.
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    title: { type: String, trim: true, maxlength: 120 },
    originalUrl: { type: String, required: true, trim: true },
    shortCode: { type: String, required: true, unique: true, index: true },
    isCustomCode: { type: Boolean, default: false },
    tags: [{ type: String, trim: true }],
    active: { type: Boolean, default: true },
    clicks: { type: Number, default: 0 },
    lastClickAt: { type: Date, default: null },
    qrCode: { type: String, default: null }, // base64 data URL
    dailyClicks: { type: [dailyClickSchema], default: [] },
    referrers: { type: [referrerSchema], default: [] },
    devices: { type: [deviceSchema], default: [] },
    countries: { type: [countrySchema], default: [] },
    expiresAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Url", urlSchema);
