//admin/src/services/customerService.js
import api from '../utils/api';

const customerService = {
  // Get all customers
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/customers', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  },

  // Get customer by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/customers/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching customer:', error);
      throw error;
    }
  },

  // Create new customer
  create: async (customerData) => {
    try {
      const response = await api.post('/customers', customerData);
      return response.data;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  },

  // Update customer
  update: async (id, customerData) => {
    try {
      const response = await api.put(`/customers/${id}`, customerData);
      return response.data;
    } catch (error) {
      console.error('Error updating customer:', error);
      throw error;
    }
  },

  // Delete customer
  delete: async (id) => {
    try {
      const response = await api.delete(`/customers/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting customer:', error);
      throw error;
    }
  },

  // Get customer statistics
  getStats: async () => {
    try {
      const response = await api.get('/customers/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching customer stats:', error);
      throw error;
    }
  }
};

export default customerService;