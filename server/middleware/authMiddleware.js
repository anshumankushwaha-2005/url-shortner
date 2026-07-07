const { verifyToken } = require("../config/jwt");
const User = require("../models/User");
const { sendError } = require("../utils/responseHandler");

/**
 * Protects a route by requiring a valid "Bearer <token>" Authorization header.
 * On success, attaches the authenticated user document to req.user.
 */
async function protect(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    if (!header.startsWith("Bearer ")) {
      return sendError(res, "Not authorized, no token provided", 401);
    }

    const token = header.split(" ")[1];
    const decoded = verifyToken(token);

    const user = await User.findById(decoded.id);
    if (!user) {
      return sendError(res, "Not authorized, user no longer exists", 401);
    }

    req.user = user;
    return next();
  } catch (err) {
    return sendError(res, "Not authorized, invalid or expired token", 401);
  }
}

module.exports = { protect };
