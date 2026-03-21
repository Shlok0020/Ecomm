// frontend/src/services/userService.js
import api from './api';

const userService = {
  // Get current user profile
  getProfile: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/users/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  },

  // Update user profile
  update: async (userId, userData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.put(`/users/${userId}`, userData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  // Get user by ID
  getById: async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(`/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  // Get user orders
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
      console.error('Error fetching user orders:', error);
      throw error;
    }
  }
};

export default userService;