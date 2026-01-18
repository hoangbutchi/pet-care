const express = require('express');
const router = express.Router();
const {
  getProductInventory,
  updateInventory,
  stockIn,
  stockOut,
  getStockMovements,
  getLowStockProducts,
  getInventoryDashboard
} = require('../controllers/inventoryController');
const { protect, admin } = require('../middleware/authMiddleware');

// Protected routes
router.route('/dashboard').get(protect, admin, getInventoryDashboard);
router.route('/low-stock').get(protect, admin, getLowStockProducts);
router.route('/product/:productId').get(protect, getProductInventory);
router.route('/:id').put(protect, admin, updateInventory);
router.route('/:id/stock-in').post(protect, admin, stockIn);
router.route('/:id/stock-out').post(protect, admin, stockOut);
router.route('/:id/movements').get(protect, admin, getStockMovements);

module.exports = router;
