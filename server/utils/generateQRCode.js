const QRCode = require("qrcode");

/**
 * Generates a QR code for the given text as a base64 PNG data URL.
 * Returns null instead of throwing so a QR failure never blocks link creation.
 */
async function generateQRCode(text) {
  try {
    return await QRCode.toDataURL(text, {
      margin: 1,
      width: 240,
      color: { dark: "#1e1b3a", light: "#ffffff" },
    });
  } catch (err) {
    console.error("QR code generation failed:", err.message);
    return null;
  }
}

module.exports = generateQRCode;
