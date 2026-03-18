// admin/src/services/settingsService.js
import api from '../utils/api';

const settingsService = {
  // Get all settings
  getAll: async () => {
    try {
      console.log('📦 Fetching settings from API...');
      const response = await api.get('/settings');
      console.log('✅ Settings API response:', response.data);
      
      // Handle different response formats
      // Your API returns: { success: true, data: {...} }
      if (response.data && response.data.success && response.data.data) {
        return response.data.data; // Return the actual settings data
      }
      
      // If API returns data directly
      if (response.data && response.data.data) {
        return response.data.data;
      }
      
      // If API returns settings directly
      return response.data;
      
    } catch (error) {
      console.error('❌ Error fetching settings:', error);
      
      // Log detailed error info
      if (error.response) {
        console.error('📡 Error response:', {
          status: error.response.status,
          data: error.response.data,
          url: error.config?.url
        });
      } else if (error.request) {
        console.error('📡 No response received from server');
      } else {
        console.error('📡 Error message:', error.message);
      }
      
      throw error;
    }
  },

  // Update settings
  update: async (settingsData) => {
    try {
      console.log('📝 Updating settings:', settingsData);
      const response = await api.put('/settings', settingsData);
      console.log('✅ Update response:', response.data);
      
      if (response.data && response.data.success) {
        return response.data.data || response.data;
      }
      
      return response.data;
      
    } catch (error) {
      console.error('❌ Error updating settings:', error);
      
      if (error.response) {
        console.error('📡 Error response:', {
          status: error.response.status,
          data: error.response.data
        });
      }
      
      throw error;
    }
  },

  // Get specific setting by key
  get: async (key) => {
    try {
      console.log(`🔍 Fetching setting: ${key}`);
      const response = await api.get(`/settings/${key}`);
      console.log(`✅ Setting ${key} response:`, response.data);
      
      if (response.data && response.data.success) {
        return response.data.data;
      }
      
      return response.data;
      
    } catch (error) {
      console.error(`❌ Error fetching setting ${key}:`, error);
      throw error;
    }
  },

  // Update specific setting
  updateKey: async (key, value) => {
    try {
      console.log(`📝 Updating setting ${key}:`, value);
      const response = await api.patch(`/settings/${key}`, { value });
      console.log(`✅ Setting ${key} updated:`, response.data);
      
      if (response.data && response.data.success) {
        return response.data.data;
      }
      
      return response.data;
      
    } catch (error) {
      console.error(`❌ Error updating setting ${key}:`, error);
      throw error;
    }
  },

  // Reset settings to defaults
  reset: async () => {
    try {
      console.log('🔄 Resetting settings to defaults...');
      const response = await api.post('/settings/reset');
      console.log('✅ Settings reset response:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('❌ Error resetting settings:', error);
      throw error;
    }
  },

  // Get settings categories
  getCategories: async () => {
    try {
      console.log('📋 Fetching settings categories...');
      const response = await api.get('/settings/categories');
      console.log('✅ Categories response:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching categories:', error);
      throw error;
    }
  }
};

export default settingsService;