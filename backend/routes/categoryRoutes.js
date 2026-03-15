const express = require("express");
const router = express.Router();

const categoryController = require("../controllers/categoryController");
const adminMiddleware = require("../middleware/adminMiddleware");

// Get all categories (public)
router.get("/", categoryController.getCategories);

// Get single category
router.get("/:id", categoryController.getCategoryById);

// Create category (admin only)
router.post("/", adminMiddleware, categoryController.createCategory);

// Update category (admin only)
router.put("/:id", adminMiddleware, categoryController.updateCategory);

// Delete category (admin only)
router.delete("/:id", adminMiddleware, categoryController.deleteCategory);

module.exports = router;