// src/services/enquiryService.js
import API, { cache, withRetry } from './api';
import toast from 'react-hot-toast';

const enquiryService = {
  // ============= PUBLIC METHODS =============

  // Submit new enquiry (from contact form)
  submitEnquiry: async (enquiryData) => {
    try {
      console.log('📝 Submitting enquiry:', enquiryData);
      
      // Validate required fields
      if (!enquiryData.name || !enquiryData.email || !enquiryData.message) {
        throw new Error('Please fill all required fields');
      }

      // Add timestamp
      const data = {
        ...enquiryData,
        submittedAt: new Date().toISOString(),
        status: 'pending',
        source: window.location.pathname // Track which page submitted
      };

      const response = await API.post('/enquiries', data);
      
      // Clear cache to refresh admin panel
      cache.remove('all_enquiries');
      
      console.log('✅ Enquiry submitted:', response.data);
      
      // Track for analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'enquiry_submitted', {
          'service': enquiryData.service || 'general',
          'source': data.source
        });
      }
      
      return response.data;
    } catch (error) {
      console.error('❌ Enquiry submission error:', error);
      
      // Handle specific error cases
      if (error.response?.status === 429) {
        toast.error('Too many requests. Please try again later.');
        throw new Error('Rate limit exceeded');
      }
      
      if (error.response?.status === 422) {
        const errors = error.response.data.errors;
        Object.values(errors).forEach(msg => toast.error(msg));
        throw error;
      }
      
      const errorMessage = error.response?.data?.message || error.message || 'Failed to submit enquiry';
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  // ============= ADMIN METHODS =============

  // Get all enquiries (admin) with optional filters
  getAllEnquiries: async (filters = {}) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Unauthorized');
      }

      // Create cache key based on filters
      const cacheKey = `enquiries_${JSON.stringify(filters)}`;
      
      // Check cache first
      const cached = cache.get(cacheKey);
      if (cached) {
        console.log('📦 Returning cached enquiries');
        return cached;
      }

      const response = await API.get('/enquiries', { params: filters });
      
      // Cache for 2 minutes
      cache.set(cacheKey, response.data, 120000);
      
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching enquiries:', error);
      
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        // Clear admin token
        localStorage.removeItem('adminToken');
        // Redirect to login
        if (typeof window !== 'undefined') {
          window.location.href = '/admin/login';
        }
      }
      
      throw error.response?.data || { message: error.message };
    }
  },

  // Get enquiry by ID (admin)
  getEnquiryById: async (id) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Unauthorized');
      }

      // Check cache
      const cacheKey = `enquiry_${id}`;
      const cached = cache.get(cacheKey);
      if (cached) {
        return cached;
      }

      const response = await API.get(`/enquiries/${id}`);
      
      // Cache for 5 minutes
      cache.set(cacheKey, response.data, 300000);
      
      return response.data;
    } catch (error) {
      console.error(`❌ Error fetching enquiry ${id}:`, error);
      
      if (error.response?.status === 404) {
        toast.error('Enquiry not found');
      }
      
      throw error.response?.data || { message: error.message };
    }
  },

  // Update enquiry status (admin)
  updateEnquiryStatus: async (id, status) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Unauthorized');
      }

      console.log(`📝 Updating enquiry ${id} status to:`, status);
      
      const response = await API.patch(`/enquiries/${id}/status`, { status });
      
      // Clear cache
      cache.remove('all_enquiries');
      cache.remove(`enquiry_${id}`);
      
      // Dispatch event for real-time updates
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('enquiryUpdated', { 
          detail: { id, status } 
        }));
      }
      
      toast.success(`Enquiry marked as ${status}`);
      
      return response.data;
    } catch (error) {
      console.error('❌ Error updating enquiry status:', error);
      toast.error('Failed to update status');
      throw error.response?.data || { message: error.message };
    }
  },

  // Mark enquiry as read (admin)
  markAsRead: async (id) => {
    return enquiryService.updateEnquiryStatus(id, 'read');
  },

  // Mark enquiry as replied (admin)
  markAsReplied: async (id) => {
    return enquiryService.updateEnquiryStatus(id, 'replied');
  },

  // Mark enquiry as resolved (admin)
  markAsResolved: async (id) => {
    return enquiryService.updateEnquiryStatus(id, 'resolved');
  },

  // Delete enquiry (admin)
  deleteEnquiry: async (id) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Unauthorized');
      }

      // Confirm deletion
      if (!window.confirm('Are you sure you want to delete this enquiry?')) {
        return;
      }

      const response = await API.delete(`/enquiries/${id}`);
      
      // Clear cache
      cache.remove('all_enquiries');
      cache.remove(`enquiry_${id}`);
      
      // Dispatch event
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('enquiryDeleted', { 
          detail: { id } 
        }));
      }
      
      toast.success('Enquiry deleted successfully');
      
      return response.data;
    } catch (error) {
      console.error('❌ Error deleting enquiry:', error);
      toast.error('Failed to delete enquiry');
      throw error.response?.data || { message: error.message };
    }
  },

  // Bulk delete enquiries (admin)
  bulkDeleteEnquiries: async (ids) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Unauthorized');
      }

      if (!window.confirm(`Delete ${ids.length} enquiries?`)) {
        return;
      }

      const response = await API.post('/enquiries/bulk-delete', { ids });
      
      // Clear cache
      cache.remove('all_enquiries');
      ids.forEach(id => cache.remove(`enquiry_${id}`));
      
      toast.success(`${ids.length} enquiries deleted`);
      
      return response.data;
    } catch (error) {
      console.error('❌ Error bulk deleting enquiries:', error);
      toast.error('Failed to delete enquiries');
      throw error.response?.data || { message: error.message };
    }
  },

  // Bulk update status (admin)
  bulkUpdateStatus: async (ids, status) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Unauthorized');
      }

      const response = await API.post('/enquiries/bulk-status', { ids, status });
      
      // Clear cache
      cache.remove('all_enquiries');
      
      toast.success(`${ids.length} enquiries updated to ${status}`);
      
      return response.data;
    } catch (error) {
      console.error('❌ Error bulk updating enquiries:', error);
      toast.error('Failed to update enquiries');
      throw error.response?.data || { message: error.message };
    }
  },

  // ============= STATISTICS METHODS =============

  // Get enquiry statistics (admin)
  getEnquiryStats: async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Unauthorized');
      }

      const cacheKey = 'enquiry_stats';
      const cached = cache.get(cacheKey);
      if (cached) {
        return cached;
      }

      const response = await API.get('/enquiries/stats');
      
      // Cache for 5 minutes
      cache.set(cacheKey, response.data, 300000);
      
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching enquiry stats:', error);
      throw error.response?.data || { message: error.message };
    }
  },

  // Get enquiries by date range (admin)
  getEnquiriesByDateRange: async (startDate, endDate) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Unauthorized');
      }

      const response = await API.get('/enquiries/date-range', {
        params: { startDate, endDate }
      });
      
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching enquiries by date:', error);
      throw error.response?.data || { message: error.message };
    }
  },

  // ============= SEARCH METHODS =============

  // Search enquiries (admin)
  searchEnquiries: async (query, filters = {}) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Unauthorized');
      }

      const response = await API.get('/enquiries/search', {
        params: { q: query, ...filters }
      });
      
      return response.data;
    } catch (error) {
      console.error('❌ Error searching enquiries:', error);
      throw error.response?.data || { message: error.message };
    }
  },

  // ============= EXPORT METHODS =============

  // Export enquiries to CSV (admin)
  exportToCSV: async (filters = {}) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Unauthorized');
      }

      const response = await API.get('/enquiries/export/csv', {
        params: filters,
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `enquiries_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('Enquiries exported successfully');
      
      return true;
    } catch (error) {
      console.error('❌ Error exporting enquiries:', error);
      toast.error('Failed to export enquiries');
      throw error.response?.data || { message: error.message };
    }
  },

  // ============= SUBSCRIPTION METHODS =============

  // Subscribe to real-time updates
  subscribeToUpdates: (callback) => {
    const handleUpdate = (event) => {
      callback(event.detail);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('enquiryUpdated', handleUpdate);
      window.addEventListener('enquiryDeleted', handleUpdate);
    }

    // Return unsubscribe function
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('enquiryUpdated', handleUpdate);
        window.removeEventListener('enquiryDeleted', handleUpdate);
      }
    };
  },

  // ============= HELPER METHODS =============

  // Format enquiry data for display
  formatEnquiry: (enquiry) => {
    return {
      ...enquiry,
      formattedDate: new Date(enquiry.submittedAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      statusColor: enquiry.status === 'pending' ? '#f59e0b' :
                   enquiry.status === 'read' ? '#3b82f6' :
                   enquiry.status === 'replied' ? '#8b5cf6' :
                   enquiry.status === 'resolved' ? '#10b981' : '#6b7280'
    };
  },

  // Validate enquiry data
  validateEnquiry: (data) => {
    const errors = {};

    if (!data.name || data.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (data.phone && !/^[0-9]{10}$/.test(data.phone.replace(/\D/g, ''))) {
      errors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (!data.message || data.message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
};

export default enquiryService;