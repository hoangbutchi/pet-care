const Product = require('../models/Product');
const Order = require('../models/Order');

// @desc    Get all products
// @route   GET /api/shop/products
// @access  Public
const getProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single product
// @route   GET /api/shop/products/:id
// @access  Public
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new order
// @route   POST /api/shop/orders
// @access  Private
const createOrder = async (req, res) => {
    const { items, shippingAddress, paymentMethod, totalAmount } = req.body;
    // items: [{ product: id, quantity: 1, price: 100 }]

    if (!items || items.length === 0) {
        return res.status(400).json({ message: 'No order items' });
    }

    try {
        // Ideally verify prices here from DB to prevent tampering
        // For this task, we will trust the client or do simple mapping
        // Taking 'items' as passed for simplicity but marking Mock Payment logic

        const order = new Order({
            user: req.user.id,
            items,
            totalAmount,
            shippingAddress,
            paymentMethod,
            status: paymentMethod === 'transfer' ? 'pending' : 'pending' // Just a mock
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// @desc    Get my orders
// @route   GET /api/shop/orders/my
// @access  Private
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// @desc    Get all orders (Admin)
// @route   GET /api/shop/orders
// @access  Private/Admin
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'id name');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


module.exports = { getProducts, getProductById, createOrder, getMyOrders, getAllOrders };
