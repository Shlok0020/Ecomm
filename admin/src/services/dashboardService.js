//admin/src/services/dashboardService.js
import api from './api';

const dashboardService = {
  // Get dashboard statistics
  getStats: async () => {
    try {
      const response = await api.get('/dashboard/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  // Get recent activities
  getRecentActivities: async (limit = 10) => {
    try {
      const response = await api.get('/dashboard/activities', { params: { limit } });
      return response.data;
    } catch (error) {
      console.error('Error fetching recent activities:', error);
      throw error;
    }
  },

  // Get chart data
  getChartData: async (period = 'month') => {
    try {
      const response = await api.get('/dashboard/charts', { params: { period } });
      return response.data;
    } catch (error) {
      console.error('Error fetching chart data:', error);
      throw error;
    }
  },

  // Get top products
  getTopProducts: async (limit = 5) => {
    try {
      const response = await api.get('/dashboard/top-products', { params: { limit } });
      return response.data;
    } catch (error) {
      console.error('Error fetching top products:', error);
      throw error;
    }
  },

  // Get sales overview
  getSalesOverview: async (period = 'month') => {
    try {
      const response = await api.get('/dashboard/sales-overview', { params: { period } });
      return response.data;
    } catch (error) {
      console.error('Error fetching sales overview:', error);
      throw error;
    }
  },

  // Get inventory summary
  getInventorySummary: async () => {
    try {
      const response = await api.get('/dashboard/inventory-summary');
      return response.data;
    } catch (error) {
      console.error('Error fetching inventory summary:', error);
      throw error;
    }
  },

  // Get customer insights
  getCustomerInsights: async () => {
    try {
      const response = await api.get('/dashboard/customer-insights');
      return response.data;
    } catch (error) {
      console.error('Error fetching customer insights:', error);
      throw error;
    }
  },

  // Get real-time updates
  subscribeToUpdates: (callback) => {
    const events = ['productsUpdated', 'ordersUpdated', 'customersUpdated'];
    
    const handlers = events.map(event => {
      const handler = (e) => {
        callback({ type: event, data: e.detail });
      };
      window.addEventListener(event, handler);
      return { event, handler };
    });
    
    // Return unsubscribe function
    return () => {
      handlers.forEach(({ event, handler }) => {
        window.removeEventListener(event, handler);
      });
    };
  }
};

export default dashboardService;