const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";
const JWT_EXPIRE = process.env.JWT_EXPIRE || "7d";

/**
 * Signs a JWT for a given user id.
 */
const generateToken = (userId) =>
  jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRE });

/**
 * Verifies a JWT and returns its decoded payload, throws if invalid/expired.
 */
const verifyToken = (token) => jwt.verify(token, JWT_SECRET);

module.exports = { generateToken, verifyToken, JWT_SECRET };
