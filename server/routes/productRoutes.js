const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  getBrands,
  getTags
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.get('/categories', getCategories);
router.get('/brands', getBrands);
router.get('/tags', getTags);
router.get('/slug/:slug', getProductBySlug);
router.get('/:id', getProductById);
router.get('/', getProducts);

// Protected admin routes (temporarily removed auth for testing)
router.route('/').post(createProduct);
router.route('/:id').put(updateProduct);
router.route('/:id').delete(deleteProduct);

module.exports = router;
