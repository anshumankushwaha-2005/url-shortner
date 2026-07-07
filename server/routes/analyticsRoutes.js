const express = require("express");
const { getUrlAnalytics } = require("../controllers/analyticsController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/:id", protect, getUrlAnalytics);

module.exports = router;
