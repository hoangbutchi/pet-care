const express = require('express');
const router = express.Router();
const {
  getProductPrices,
  createPriceTable,
  updatePriceTable,
  deletePriceTable,
  getPriceHistory,
  createPromotion,
  getPromotions,
  getPriceChannels,
  getPriceRegions,
  getCustomerGroups
} = require('../controllers/priceController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.route('/channels').get(getPriceChannels);
router.route('/regions').get(getPriceRegions);
router.route('/customer-groups').get(getCustomerGroups);
router.route('/product/:productId').get(getProductPrices);
router.route('/promotions').get(getPromotions);

// Protected admin routes
router.route('/').post(protect, admin, createPriceTable);
router.route('/:id').put(protect, admin, updatePriceTable);
router.route('/:id').delete(protect, admin, deletePriceTable);
router.route('/:id/history').get(protect, admin, getPriceHistory);
router.route('/promotions').post(protect, admin, createPromotion);

module.exports = router;
