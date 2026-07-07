const { sendError } = require("../utils/responseHandler");

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;
const URL_REGEX = /^https?:\/\/.+/i;

function validateRegister(req, res, next) {
  const { name, email, password } = req.body;
  const errors = [];

  if (!name || !name.trim()) errors.push("Name is required");
  if (!email || !EMAIL_REGEX.test(email)) errors.push("A valid email is required");
  if (!password || password.length < 6) errors.push("Password must be at least 6 characters");

  if (errors.length) return sendError(res, "Validation failed", 400, errors);
  return next();
}

function validateLogin(req, res, next) {
  const { email, password } = req.body;
  const errors = [];

  if (!email || !EMAIL_REGEX.test(email)) errors.push("A valid email is required");
  if (!password) errors.push("Password is required");

  if (errors.length) return sendError(res, "Validation failed", 400, errors);
  return next();
}

function validateCreateUrl(req, res, next) {
  const { originalUrl, customCode } = req.body;
  const errors = [];

  if (!originalUrl || !URL_REGEX.test(originalUrl)) {
    errors.push("A valid URL starting with http:// or https:// is required");
  }
  if (customCode && !/^[a-zA-Z0-9-_]{3,20}$/.test(customCode)) {
    errors.push("Custom alias must be 3-20 characters (letters, numbers, - or _)");
  }

  if (errors.length) return sendError(res, "Validation failed", 400, errors);
  return next();
}

module.exports = { validateRegister, validateLogin, validateCreateUrl };
