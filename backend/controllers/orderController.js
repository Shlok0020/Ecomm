// backend/controllers/orderController.js
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// Generate unique order ID
const generateOrderId = () => {
  return 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
};

// @desc    Create new order
// @route   POST /api/orders
const createOrder = async (req, res) => {
  try {
    console.log('📦 Creating order with data:', req.body);
    
    // Handle both 'items' and 'products' from frontend
    const { items, products, totalAmount, customerInfo, paymentMethod, address } = req.body;
    
    // Use either items or products array
    const orderItems = items || products || [];
    
    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No items in order'
      });
    }
    
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
        console.log('👤 User found:', user.email);
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

    for (const item of orderItems) {
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

    // Normalize payment method to match enum values
    let normalizedPaymentMethod = 'cash'; // default
    if (paymentMethod) {
      const methodStr = paymentMethod.toString().toLowerCase();
      if (methodStr.includes('cash')) normalizedPaymentMethod = 'cash';
      else if (methodStr.includes('card')) normalizedPaymentMethod = 'card';
      else if (methodStr.includes('online') || methodStr.includes('upi') || methodStr.includes('paytm') || methodStr.includes('gpay')) {
        normalizedPaymentMethod = 'online';
      }
      else {
        normalizedPaymentMethod = 'cash';
      }
    }

    console.log('💰 Payment method:', paymentMethod, '→', normalizedPaymentMethod);

    // Create order
    const order = await Order.create({
      orderId: generateOrderId(),
      user: userId, // This links order to user if logged in
      customerInfo: finalCustomerInfo,
      products: productDetails,
      totalAmount: finalTotal,
      paymentMethod: normalizedPaymentMethod,
      status: 'pending'
    });

    console.log('✅ Order created:', order.orderId);
    console.log('👤 User ID:', userId);
    console.log('📦 Order ID:', order._id);

    // If user is logged in, add order to user's orders array
    if (userId && user) {
      await User.findByIdAndUpdate(
        userId,
        { $push: { orders: order._id } },
        { new: true }
      );
      console.log(`📋 Order added to user ${userId}'s orders array`);
    }

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
    console.log('🔍 Fetching orders for user:', userId);
    
    // Method 1: Find orders where user field matches
    let orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate('products.productId', 'name image price');

    console.log(`📦 Found ${orders.length} orders via user field`);

    // Method 2: If no orders found, try to find by email
    if (orders.length === 0 && req.user.email) {
      console.log('🔍 Trying to find orders by email:', req.user.email);
      const ordersByEmail = await Order.find({ 
        'customerInfo.email': req.user.email 
      }).sort({ createdAt: -1 });
      
      console.log(`📦 Found ${ordersByEmail.length} orders via email`);
      
      // If found by email, update them with user ID
      if (ordersByEmail.length > 0) {
        await Order.updateMany(
          { 'customerInfo.email': req.user.email },
          { $set: { user: userId } }
        );
        console.log('✅ Updated orders with user ID');
        orders = ordersByEmail;
      }
    }

    res.json({
      success: true,
      data: orders || [],
      count: orders?.length || 0
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
    
    console.log(`📝 Updating order ${req.params.id} to status: ${status}`);
    
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

    console.log('✅ Order updated successfully:', order.orderId);

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

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder
};