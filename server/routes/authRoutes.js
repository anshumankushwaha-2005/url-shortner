const express = require("express");
const { register, login, me } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const { validateRegister, validateLogin } = require("../middleware/validateRequest");

const router = express.Router();

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router.get("/me", protect, me);

module.exports = router;
