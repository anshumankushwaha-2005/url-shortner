const { sendError } = require("../utils/responseHandler");

/**
 * Catches requests to unknown API routes and forwards a 404 to the error handler.
 */
function notFound(req, res, next) {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
}

/**
 * Centralized error handler. Normalizes Mongoose validation/cast/duplicate-key
 * errors into friendly messages instead of leaking stack traces to the client.
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Server error";

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }

  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || "field";
    message = `That ${field} is already in use`;
  }

  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Not authorized, invalid or expired token";
  }

  if (process.env.NODE_ENV !== "production") {
    console.error(err);
  }

  return sendError(res, message, statusCode);
}

module.exports = { notFound, errorHandler };
