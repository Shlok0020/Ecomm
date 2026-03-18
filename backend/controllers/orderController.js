// backend/controllers/orderController.js
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const {
  sendNewOrderNotification,
  sendOrderStatusNotification
} = require('../utils/notificationService');

// Generate unique order ID
const generateOrderId = () => {
  return 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
};

// @desc    Create new order
// @route   POST /api/orders
const createOrder = async (req, res) => {
  try {
    console.log('📦 Creating order with data:', req.body);
    
    const { items, totalAmount, customerInfo, paymentMethod, address } = req.body;
    
    // Get user from token if logged in
    const userId = req.user ? req.user.id : null;
    
    // Get user details from token if available
    let userDetails = {};
    let user = null;
    
    if (req.user) {
      user = await User.findById(req.user.id);
      if (user) {
        userDetails = {
          name: user.name,
          email: user.email,
          phone: user.phone
        };
      }
    }

    // Use provided customerInfo or user details
    const finalCustomerInfo = {
      name: (customerInfo && customerInfo.name) || userDetails.name || 'Guest',
      email: (customerInfo && customerInfo.email) || userDetails.email || 'guest@example.com',
      phone: (customerInfo && customerInfo.phone) || userDetails.phone || 'N/A',
      address: address || (customerInfo && customerInfo.address) || {}
    };

    // Validate products and calculate total
    let calculatedTotal = 0;
    const productDetails = [];

    for (const item of items) {
      // Try to find product in database
      let product = null;
      if (item.productId) {
        product = await Product.findById(item.productId);
      }
      
      // If product found in DB, use its details
      if (product) {
        calculatedTotal += product.price * item.quantity;
        productDetails.push({
          productId: product._id,
          name: product.name,
          price: product.price,
          quantity: item.quantity,
          image: product.image || item.image
        });
        
        // Update product stock
        await Product.findByIdAndUpdate(
          product._id,
          { $inc: { stock: -item.quantity } }
        );
      } else {
        // Use provided item details (for guest/non-DB products)
        calculatedTotal += (item.price || 0) * (item.quantity || 1);
        productDetails.push({
          productId: null,
          name: item.name || 'Product',
          price: item.price || 0,
          quantity: item.quantity || 1,
          image: item.image || null
        });
      }
    }

    // Use provided totalAmount or calculated total
    const finalTotal = totalAmount || calculatedTotal;

    // Create order
    const order = await Order.create({
      orderId: generateOrderId(),
      user: userId, // This links order to user if logged in
      customerInfo: finalCustomerInfo,
      products: productDetails,
      totalAmount: finalTotal,
      paymentMethod: paymentMethod || 'cash',
      status: 'pending'
    });

    console.log('✅ Order created:', order.orderId);

    // If user is logged in, add order to user's orders array
    if (userId && user) {
      await User.findByIdAndUpdate(
        userId,
        { $push: { orders: order._id } },
        { new: true }
      );
      console.log(`📋 Order added to user ${userId}'s dashboard`);
    }

    // 🚀 Send new order notification to admin (don't await)
    const orderData = {
      orderId: order.orderId,
      customerName: finalCustomerInfo.name,
      customerEmail: finalCustomerInfo.email,
      customerPhone: finalCustomerInfo.phone,
      items: productDetails,
      totalAmount: finalTotal,
      date: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      status: order.status
    };

    sendNewOrderNotification(orderData)
      .then(result => {
        console.log('📧 New order notifications sent:', result);
      })
      .catch(err => {
        console.error('❌ Failed to send order notifications:', err);
      });

    res.status(201).json({
      success: true,
      data: order,
      message: userId ? 
        'Order placed successfully! Check your dashboard for order history.' : 
        'Order placed successfully! Create an account to track your orders.'
    });

  } catch (error) {
    console.error('❌ Order creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message
    });
  }
};

// @desc    Get user orders (for logged in users)
// @route   GET /api/orders/my-orders
const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Find user and populate orders
    const user = await User.findById(userId)
      .populate({
        path: 'orders',
        options: { sort: { createdAt: -1 } },
        populate: {
          path: 'products.productId',
          select: 'name image price'
        }
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user.orders || [],
      count: user.orders?.length || 0
    });

  } catch (error) {
    console.error('Fetch user orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
};

// @desc    Get single order details
// @route   GET /api/orders/:id
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('products.productId', 'name image price');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user is authorized to view this order
    if (req.user.role !== 'admin' && order.user?.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    res.json({
      success: true,
      data: order
    });

  } catch (error) {
    console.error('Fetch order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
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

    // Get stats for admin dashboard
    const stats = {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      processing: orders.filter(o => o.status === 'processing').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
      totalRevenue: orders.reduce((sum, o) => sum + o.totalAmount, 0)
    };

    res.json({
      success: true,
      data: orders,
      stats
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
    ).populate('user', 'name email phone');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Prepare order data for notification
    const orderData = {
      orderId: order.orderId,
      customerName: order.customerInfo.name || order.user?.name,
      customerEmail: order.customerInfo.email || order.user?.email,
      customerPhone: order.customerInfo.phone || order.user?.phone,
      status: status,
      items: order.products,
      totalAmount: order.totalAmount,
      date: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    };

    // 🚀 Send status update notification to customer (don't await)
    sendOrderStatusNotification(orderData)
      .catch(err => console.error('❌ Status update notification failed:', err));

    res.json({
      success: true,
      data: order,
      message: 'Order status updated successfully'
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

// @desc    Cancel order (user can cancel pending orders)
// @route   PUT /api/orders/:id/cancel
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user is authorized to cancel this order
    if (order.user?.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order'
      });
    }

    // Only allow cancellation of pending orders
    if (order.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Only pending orders can be cancelled'
      });
    }

    order.status = 'cancelled';
    await order.save();

    // Restore product stock
    for (const item of order.products) {
      if (item.productId) {
        await Product.findByIdAndUpdate(
          item.productId,
          { $inc: { stock: item.quantity } }
        );
      }
    }

    // Prepare order data for cancellation notification
    const orderData = {
      orderId: order.orderId,
      customerName: order.customerInfo.name || order.user?.name,
      customerEmail: order.customerInfo.email || order.user?.email,
      customerPhone: order.customerInfo.phone || order.user?.phone,
      status: 'cancelled',
      items: order.products,
      totalAmount: order.totalAmount,
      date: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    };

    // 🚀 Send cancellation notification to customer
    sendOrderStatusNotification(orderData)
      .catch(err => console.error('❌ Cancellation notification failed:', err));

    res.json({
      success: true,
      data: order,
      message: 'Order cancelled successfully'
    });

  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling order',
      error: error.message
    });
  }
};

// Export all functions
module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder
};