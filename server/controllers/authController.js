const User = require("../models/User");
const { generateToken } = require("../config/jwt");
const { sendSuccess, sendError } = require("../utils/responseHandler");

/**
 * POST /api/auth/register
 */
async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return sendError(res, "An account with that email already exists", 409);

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);

    return sendSuccess(res, { token, user: user.toPublicJSON() }, 201);
  } catch (err) {
    return next(err);
  }
}

/**
 * POST /api/auth/login
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user) return sendError(res, "Invalid email or password", 401);

    const match = await user.comparePassword(password);
    if (!match) return sendError(res, "Invalid email or password", 401);

    const token = generateToken(user._id);
    return sendSuccess(res, { token, user: user.toPublicJSON() });
  } catch (err) {
    return next(err);
  }
}

/**
 * GET /api/auth/me
 * Protected — returns the currently authenticated user.
 */
async function me(req, res) {
  return sendSuccess(res, { user: req.user.toPublicJSON() });
}

module.exports = { register, login, me };
