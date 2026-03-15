const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const sendWhatsapp = require('../utils/sendWhatsapp');

// Generate unique order ID
const generateOrderId = () => {
  return 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
};

// @desc    Create new order
// @route   POST /api/orders
const createOrder = async (req, res) => {
  try {
    const { products, customerInfo, paymentMethod } = req.body;
    const userId = req.user.id;

    // Calculate total amount
    let totalAmount = 0;
    const productDetails = [];

    for (const item of products) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.productId}`
        });
      }

      totalAmount += product.price * item.quantity;
      productDetails.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity
      });
    }

    // Create order
    const order = await Order.create({
      orderId: generateOrderId(),
      user: userId,
      customerInfo,
      products: productDetails,
      totalAmount,
      paymentMethod
    });

    // Get admin details for notifications
    const admin = await User.findOne({ role: 'admin' });
    
    if (admin) {
      // Send email notification
      const emailSent = await sendEmail(order, admin.email);
      
      // Send WhatsApp notification
      const whatsappSent = await sendWhatsapp(order, admin.phone);
      
      // Update notification status
      order.notifications = {
        emailSent,
        whatsappSent
      };
      await order.save();
    }

    res.status(201).json({
      success: true,
      data: order,
      message: 'Order placed successfully!'
    });

  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message
    });
  }
};

// @desc    Get user orders
// @route   GET /api/orders/my-orders
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate('products.productId', 'name image');

    res.json({
      success: true,
      data: orders
    });

  } catch (error) {
    console.error('Fetch orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
};

// @desc    Get all orders (admin only)
// @route   GET /api/orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate('user', 'name email phone')
      .populate('products.productId', 'name image');

    res.json({
      success: true,
      data: orders
    });

  } catch (error) {
    console.error('Fetch all orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
};

// @desc    Update order status (admin only)
// @route   PUT /api/orders/:id
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: order,
      message: 'Order status updated'
    });

  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating order',
      error: error.message
    });
  }
};

// Export all functions
module.exports = {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus
};