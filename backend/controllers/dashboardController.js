const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');

const dashboardController = {
  // Get all dashboard statistics
  getStats: async (req, res) => {
    try {
      // Get total products
      const totalProducts = await Product.countDocuments();

      // Get total orders
      const totalOrders = await Order.countDocuments();

      // Get total customers (users with role 'user' or 'customer')
      const totalCustomers = await User.countDocuments({ role: 'user' });

      // Calculate total revenue
      const orders = await Order.find({ status: 'delivered' });
      const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

      // Get pending orders count
      const pendingOrders = await Order.countDocuments({ status: 'pending' });

      // Get low stock products (assuming stock < 10 is low)
      const lowStock = await Product.countDocuments({ stock: { $lt: 10 } });

      // Get today's orders for daily stats
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayOrders = await Order.countDocuments({
        createdAt: { $gte: today }
      });

      // Get monthly revenue
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      
      const monthlyOrders = await Order.find({
        createdAt: { $gte: startOfMonth },
        status: 'delivered'
      });
      const monthlyRevenue = monthlyOrders.reduce((sum, order) => sum + order.totalAmount, 0);

      res.json({
        success: true,
        data: {
          totalProducts,
          totalOrders,
          totalCustomers,
          totalRevenue,
          pendingOrders,
          lowStock,
          todayOrders,
          monthlyRevenue
        }
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching dashboard statistics',
        error: error.message
      });
    }
  },

  // Get recent activities (orders, products added, etc.)
  getRecentActivities: async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 10;

      // Get recent orders
      const recentOrders = await Order.find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate('user', 'name email')
        .select('orderId totalAmount status createdAt');

      // Get recent products
      const recentProducts = await Product.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('name price category createdAt');

      // Get recent users
      const recentUsers = await User.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('name email createdAt');

      const activities = [
        ...recentOrders.map(order => ({
          type: 'order',
          id: order._id,
          title: `New Order ${order.orderId}`,
          description: `Amount: ₹${order.totalAmount}`,
          status: order.status,
          time: order.createdAt,
          icon: 'shopping-cart'
        })),
        ...recentProducts.map(product => ({
          type: 'product',
          id: product._id,
          title: `New Product Added`,
          description: product.name,
          price: product.price,
          time: product.createdAt,
          icon: 'box'
        })),
        ...recentUsers.map(user => ({
          type: 'user',
          id: user._id,
          title: `New User Registered`,
          description: user.name,
          email: user.email,
          time: user.createdAt,
          icon: 'user'
        }))
      ];

      // Sort by time (most recent first) and limit
      activities.sort((a, b) => b.time - a.time);
      activities.splice(limit);

      res.json({
        success: true,
        data: activities
      });
    } catch (error) {
      console.error('Error fetching activities:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching recent activities',
        error: error.message
      });
    }
  },

  // Get chart data for sales overview
  getChartData: async (req, res) => {
    try {
      const period = req.query.period || 'month'; // week, month, year

      let groupFormat;
      let dateRange;
      const now = new Date();

      switch(period) {
        case 'week':
          // Last 7 days
          dateRange = new Date(now.setDate(now.getDate() - 7));
          groupFormat = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } };
          break;
        case 'year':
          // Last 12 months
          dateRange = new Date(now.setFullYear(now.getFullYear() - 1));
          groupFormat = { $dateToString: { format: '%Y-%m', date: '$createdAt' } };
          break;
        default: // month
          // Last 30 days
          dateRange = new Date(now.setDate(now.getDate() - 30));
          groupFormat = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } };
      }

      // Sales data
      const salesData = await Order.aggregate([
        {
          $match: {
            createdAt: { $gte: dateRange },
            status: 'delivered'
          }
        },
        {
          $group: {
            _id: groupFormat,
            total: { $sum: '$totalAmount' },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]);

      // Category distribution
      const categoryData = await Product.aggregate([
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 }
          }
        }
      ]);

      // Order status distribution
      const statusData = await Order.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]);

      res.json({
        success: true,
        data: {
          sales: salesData.map(item => ({
            period: item._id,
            sales: item.total,
            orders: item.count
          })),
          categories: categoryData.map(item => ({
            name: item._id,
            value: item.count
          })),
          status: statusData.map(item => ({
            name: item._id,
            value: item.count
          }))
        }
      });
    } catch (error) {
      console.error('Error fetching chart data:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching chart data',
        error: error.message
      });
    }
  },

  // Get top selling products
  getTopProducts: async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 5;

      const topProducts = await Order.aggregate([
        { $unwind: '$items' },
        {
          $group: {
            _id: '$items.product',
            totalSold: { $sum: '$items.quantity' },
            revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
          }
        },
        { $sort: { totalSold: -1 } },
        { $limit: limit },
        {
          $lookup: {
            from: 'products',
            localField: '_id',
            foreignField: '_id',
            as: 'productDetails'
          }
        },
        { $unwind: '$productDetails' }
      ]);

      res.json({
        success: true,
        data: topProducts.map(item => ({
          id: item._id,
          name: item.productDetails.name,
          sold: item.totalSold,
          revenue: item.revenue,
          stock: item.productDetails.stock
        }))
      });
    } catch (error) {
      console.error('Error fetching top products:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching top products',
        error: error.message
      });
    }
  },

  // Get inventory summary
  getInventorySummary: async (req, res) => {
    try {
      const totalProducts = await Product.countDocuments();
      const outOfStock = await Product.countDocuments({ stock: 0 });
      const lowStock = await Product.countDocuments({ stock: { $lt: 10, $gt: 0 } });
      const categories = await Product.distinct('category');

      const categoryCounts = await Promise.all(
        categories.map(async (category) => ({
          category,
          count: await Product.countDocuments({ category })
        }))
      );

      res.json({
        success: true,
        data: {
          totalProducts,
          outOfStock,
          lowStock,
          inStock: totalProducts - outOfStock - lowStock,
          categories: categoryCounts
        }
      });
    } catch (error) {
      console.error('Error fetching inventory summary:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching inventory summary',
        error: error.message
      });
    }
  },

  // Get customer insights
  getCustomerInsights: async (req, res) => {
    try {
      const totalCustomers = await User.countDocuments({ role: 'user' });
      
      // New customers this month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      
      const newCustomers = await User.countDocuments({
        role: 'user',
        createdAt: { $gte: startOfMonth }
      });

      // Customers with orders
      const customersWithOrders = await Order.distinct('user');
      const activeCustomers = customersWithOrders.length;

      // Average order value
      const orders = await Order.find({ status: 'delivered' });
      const avgOrderValue = orders.length > 0 
        ? orders.reduce((sum, order) => sum + order.totalAmount, 0) / orders.length 
        : 0;

      res.json({
        success: true,
        data: {
          totalCustomers,
          newCustomers,
          activeCustomers,
          inactiveCustomers: totalCustomers - activeCustomers,
          avgOrderValue
        }
      });
    } catch (error) {
      console.error('Error fetching customer insights:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching customer insights',
        error: error.message
      });
    }
  }
};

module.exports = dashboardController;