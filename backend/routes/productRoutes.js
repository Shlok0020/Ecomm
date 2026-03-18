// backend/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload'); // ✅ IMPORTANT: Import upload
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getProducts);
router.get('/category/:category', getProductsByCategory);
router.get('/:id', getProductById);

// ✅ FIXED: Admin routes with upload middleware
router.post('/', protect, admin, upload.array('images', 5), createProduct);
router.put('/:id', protect, admin, upload.array('images', 5), updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;