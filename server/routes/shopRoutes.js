const express = require('express');
const router = express.Router();
const { getProducts, getProductById, createOrder, getMyOrders, getAllOrders } = require('../controllers/shopController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/products').get(getProducts);
router.route('/products/:id').get(getProductById);

router.route('/orders')
    .post(protect, createOrder)
    .get(protect, admin, getAllOrders);

router.route('/orders/my').get(protect, getMyOrders);

module.exports = router;
