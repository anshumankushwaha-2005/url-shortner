const express = require("express");
const {
  listUrls,
  createUrl,
  updateUrl,
  deleteUrl,
  createDemoUrl,
} = require("../controllers/urlController");
const { protect } = require("../middleware/authMiddleware");
const { validateCreateUrl } = require("../middleware/validateRequest");

const router = express.Router();

// Public demo endpoint must be declared before "/:id"-style routes would
// ever be needed at this level; it has its own literal path so order is fine.
router.post("/demo", createDemoUrl);

router.get("/", protect, listUrls);
router.post("/", protect, validateCreateUrl, createUrl);
router.patch("/:id", protect, updateUrl);
router.delete("/:id", protect, deleteUrl);

module.exports = router;
