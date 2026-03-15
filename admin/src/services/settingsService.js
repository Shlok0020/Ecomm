//admin/src/services/settingsService.js
import api from '../utils/api';

const settingsService = {
  // Get all settings
  getAll: async () => {
    try {
      const response = await api.get('/settings');
      return response.data;
    } catch (error) {
      console.error('Error fetching settings:', error);
      throw error;
    }
  },

  // Update settings
  update: async (settingsData) => {
    try {
      const response = await api.put('/settings', settingsData);
      return response.data;
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  },

  // Get specific setting
  get: async (key) => {
    try {
      const response = await api.get(`/settings/${key}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching setting:', error);
      throw error;
    }
  },

  // Update specific setting
  updateKey: async (key, value) => {
    try {
      const response = await api.patch(`/settings/${key}`, { value });
      return response.data;
    } catch (error) {
      console.error('Error updating setting:', error);
      throw error;
    }
  }
};

export default settingsService;