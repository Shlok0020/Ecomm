// src/services/orderService.js
import api from './api';

const orderService = {
  // Create new order
  createOrder: async (orderData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.post('/orders', orderData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  // Get user's orders
  getUserOrders: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/orders/my-orders', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  // Get order by ID
  getOrderById: async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(`/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  },

  // Cancel order
  cancelOrder: async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.put(`/orders/${orderId}/cancel`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error cancelling order:', error);
      throw error;
    }
  }
};

export default orderService;