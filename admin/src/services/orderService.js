// admin/src/services/orderService.js - COMPLETE FIXED VERSION for your backend API

import api from './api';

const orderService = {
  // Get all orders
  getAll: async (params = {}) => {
    try {
      console.log('📦 Fetching orders from API...');
      const response = await api.get('/orders', { params });
      console.log('✅ API Response:', response.data);
      
      // 👇 YOUR BACKEND RESPONSE: { success: true, data: [...] }
      // Extract orders from response.data.data
      
      // Case 1: Response has success and data properties
      if (response.data && response.data.success && response.data.data) {
        console.log('📦 Orders from API:', response.data.data);
        return response.data.data; // Return the actual orders array
      }
      
      // Case 2: Response is directly an array
      if (Array.isArray(response.data)) {
        return response.data;
      }
      
      // Case 3: Response has data property that is array
      if (response.data && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      
      // Case 4: Response has orders property
      if (response.data && Array.isArray(response.data.orders)) {
        return response.data.orders;
      }
      
      // If no orders found, return empty array
      console.warn('Unexpected response structure:', response.data);
      return [];
      
    } catch (error) {
      console.error('❌ Error fetching orders:', error);
      // Return empty array instead of throwing error to prevent crash
      return [];
    }
  },

  // Get order by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/orders/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  },

  // Create new order
  create: async (orderData) => {
    try {
      const response = await api.post('/orders', orderData);
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  // Update order
  update: async (id, orderData) => {
    try {
      const response = await api.put(`/orders/${id}`, orderData);
      return response.data;
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  },

  // Update order status
  updateStatus: async (id, status) => {
    try {
      const response = await api.patch(`/orders/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  },

  // Delete order
  delete: async (id) => {
    try {
      const response = await api.delete(`/orders/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting order:', error);
      throw error;
    }
  },

  // Get order statistics
  getStats: async () => {
    try {
      const response = await api.get('/orders/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching order stats:', error);
      throw error;
    }
  }
};

export default orderService;