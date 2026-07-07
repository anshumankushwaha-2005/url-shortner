const { customAlphabet } = require("nanoid");
const Url = require("../models/Url");

// URL-safe alphabet without visually ambiguous characters (0/O, 1/l/I).
const ALPHABET = "23456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ";
const nanoid = customAlphabet(ALPHABET, 7);

const CUSTOM_CODE_REGEX = /^[a-zA-Z0-9-_]{3,20}$/;

/**
 * Generates a random short code, retrying on the rare occasion of a collision.
 */
async function generateUniqueShortCode() {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const code = nanoid();
    // eslint-disable-next-line no-await-in-loop
    const existing = await Url.findOne({ shortCode: code }).lean();
    if (!existing) return code;
  }
  throw new Error("Could not generate a unique short code, please try again");
}

/**
 * Validates a user-supplied custom alias and confirms it isn't already taken.
 * Returns { valid: boolean, error?: string }
 */
async function validateCustomCode(code) {
  if (!CUSTOM_CODE_REGEX.test(code)) {
    return {
      valid: false,
      error: "Custom alias must be 3-20 characters (letters, numbers, - or _)",
    };
  }
  const existing = await Url.findOne({ shortCode: code }).lean();
  if (existing) {
    return { valid: false, error: "That custom alias is already taken" };
  }
  return { valid: true };
}

module.exports = { generateUniqueShortCode, validateCustomCode };
