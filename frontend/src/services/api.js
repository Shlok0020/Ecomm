// frontend/src/services/api.js - COMPLETE FIXED VERSION
import axios from 'axios';
import toast from 'react-hot-toast';

// Get API URL from environment
const API_URL = import.meta.env.VITE_API_URL || 'api.newpremglasshouse.in/api';
const IS_PRODUCTION = import.meta.env.PROD;

console.log('🔌 API URL:', API_URL);

// Create axios instance
const API = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// ============= REQUEST INTERCEPTOR =============
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now()
      };
    }
    
    if (!IS_PRODUCTION) {
      console.log(`🚀 ${config.method.toUpperCase()} ${config.url}`, config.params || config.data);
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// ============= RESPONSE INTERCEPTOR =============
API.interceptors.response.use(
  (response) => {
    if (!IS_PRODUCTION) {
      console.log(`✅ ${response.config.method.toUpperCase()} ${response.config.url}`, response.data);
    }
    return response;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          toast.error('Session expired. Please login again.');
          localStorage.removeItem('token');
          localStorage.removeItem('adminToken');
          localStorage.removeItem('user');
          if (!window.location.pathname.includes('/login')) {
            setTimeout(() => {
              window.location.href = '/login';
            }, 1500);
          }
          break;
        case 403:
          toast.error('You do not have permission');
          break;
        case 404:
          toast.error(data.message || 'Resource not found');
          break;
        case 500:
          toast.error('Server error. Please try again later.');
          break;
        default:
          toast.error(data.message || 'An error occurred');
      }
    } else if (error.request) {
      toast.error('Unable to connect to server');
    } else {
      toast.error(error.message || 'An unexpected error occurred');
    }
    
    return Promise.reject(error);
  }
);

// ============= CACHE MANAGEMENT =============
export const cache = {
  data: new Map(),
  
  set(key, value, ttl = 300000) {
    this.data.set(key, {
      value,
      expiry: Date.now() + ttl
    });
  },
  
  get(key) {
    const item = this.data.get(key);
    if (!item) return null;
    if (Date.now() > item.expiry) {
      this.data.delete(key);
      return null;
    }
    return item.value;
  },
  
  clear() {
    this.data.clear();
  },
  
  remove(key) {
    this.data.delete(key);
  }
};

// ============= RETRY MECHANISM =============
export const withRetry = async (fn, maxRetries = 3, delay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      if (error.response?.status >= 400 && error.response?.status < 500) {
        throw error;
      }
      
      console.log(`Retry attempt ${i + 1}/${maxRetries}`);
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
    }
  }
};

// ============= API ENDPOINTS =============

export const authAPI = {
  // Register function
  register: async (userData) => {
    try {
      console.log('📝 Registering user:', userData.email);
      const response = await API.post('/auth/register', userData);
      console.log('📥 Register response:', response.data);
      
      if (response.data?.success) {
        const userData = response.data.data;
        localStorage.setItem('token', userData.token);
        localStorage.setItem('user', JSON.stringify(userData));
        console.log('✅ Registration successful, token saved');
        toast.success('Registration successful!');
      }
      return response.data;
    } catch (error) {
      console.error('❌ Register error:', error.response?.data || error);
      throw error.response?.data || error;
    }
  },
  
  // LOGIN FUNCTION - WITH DEBUG LOGS
  login: async (credentials) => {
    try {
      console.log('🔐 Login attempt for:', credentials.email);
      
      const response = await API.post('/auth/login', credentials);
      console.log('📥 Full API response:', response);
      console.log('📥 Response data:', response.data);
      
      // Check if login was successful
      if (response.data?.success) {
        const userData = response.data.data;
        console.log('👤 User data from response:', userData);
        console.log('👤 User role:', userData.role);
        console.log('🔑 Token exists:', !!userData.token);
        
        if (userData.token) {
          // Save to localStorage
          localStorage.setItem('token', userData.token);
          localStorage.setItem('user', JSON.stringify(userData));
          
          // Verify save
          console.log('✅ Token saved?', localStorage.getItem('token') ? 'YES' : 'NO');
          console.log('✅ User saved?', localStorage.getItem('user') ? 'YES' : 'NO');
          
          toast.success('Login successful!');
        } else {
          console.error('❌ No token in response data!');
          toast.error('Invalid response from server');
        }
      } else {
        console.error('❌ Login failed - success false:', response.data);
        toast.error(response.data?.message || 'Login failed');
      }
      
      return response.data;
    } catch (error) {
      console.error('❌ Login error:', error);
      console.error('❌ Error response:', error.response?.data);
      
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      toast.error(errorMessage);
      
      throw error.response?.data || error;
    }
  },
  
  // Logout function
  logout: () => {
    console.log('🚪 Logging out...');
    localStorage.removeItem('token');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('user');
    sessionStorage.clear();
    toast.success('Logged out successfully');
    window.location.href = '/login';
  },
  
  // Get current user
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        console.error('Error parsing user data');
        return null;
      }
    }
    return null;
  },
  
  // Check if logged in
  isLoggedIn: () => {
    return !!localStorage.getItem('token');
  },
  
  // Check if admin
  isAdmin: () => {
    const user = authAPI.getCurrentUser();
    return user?.role === 'admin';
  }
};

// Glass products endpoints
export const glassAPI = {
  getAll: (params) => API.get('/glass', { params }),
  getById: (id) => API.get(`/glass/${id}`),
  create: (data) => API.post('/glass', data),
  update: (id, data) => API.put(`/glass/${id}`, data),
  delete: (id) => API.delete(`/glass/${id}`),
  getCategories: () => API.get('/glass/categories')
};

// Plywood products endpoints
export const plywoodAPI = {
  getAll: (params) => API.get('/plywood', { params }),
  getById: (id) => API.get(`/plywood/${id}`),
  create: (data) => API.post('/plywood', data),
  update: (id, data) => API.put(`/plywood/${id}`, data),
  delete: (id) => API.delete(`/plywood/${id}`),
  getGrades: () => API.get('/plywood/grades')
};

// Hardware products endpoints
export const hardwareAPI = {
  getAll: (params) => API.get('/hardware', { params }),
  getById: (id) => API.get(`/hardware/${id}`),
  create: (data) => API.post('/hardware', data),
  update: (id, data) => API.put(`/hardware/${id}`, data),
  delete: (id) => API.delete(`/hardware/${id}`),
  getCategories: () => API.get('/hardware/categories')
};

// Interiors projects endpoints
export const interiorsAPI = {
  getAll: (params) => API.get('/interiors', { params }),
  getById: (id) => API.get(`/interiors/${id}`),
  create: (data) => API.post('/interiors', data),
  update: (id, data) => API.put(`/interiors/${id}`, data),
  delete: (id) => API.delete(`/interiors/${id}`),
  getCategories: () => API.get('/interiors/categories')
};

// Contact form endpoints
export const contactAPI = {
  submit: (data) => API.post('/contact', data),
  getAll: (params) => API.get('/contact', { params }),
  getById: (id) => API.get(`/contact/${id}`),
  update: (id, data) => API.put(`/contact/${id}`, data),
  delete: (id) => API.delete(`/contact/${id}`),
  markAsRead: (id) => API.patch(`/contact/${id}/read`)
};

// Dashboard endpoints
export const dashboardAPI = {
  getStats: () => API.get('/dashboard/stats'),
  getRecentActivity: () => API.get('/dashboard/recent'),
  getChartData: (period) => API.get(`/dashboard/charts?period=${period}`)
};

// Upload endpoints
export const uploadAPI = {
  uploadImage: (file, folder = 'products') => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', folder);
    
    return API.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  
  uploadMultiple: (files, folder = 'products') => {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    formData.append('folder', folder);
    
    return API.post('/upload/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  
  deleteImage: (path) => API.delete('/upload', { data: { path } })
};

// ============= HELPER FUNCTIONS =============
export const checkHealth = async () => {
  try {
    const response = await API.get('/health');
    return response.data;
  } catch (error) {
    return { status: 'error', message: 'API is not reachable' };
  }
};

export const getToken = () => {
  return localStorage.getItem('token') || localStorage.getItem('adminToken');
};

export const setToken = (token, isAdmin = false) => {
  if (isAdmin) {
    localStorage.setItem('adminToken', token);
  } else {
    localStorage.setItem('token', token);
  }
};

export const removeToken = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('adminToken');
  localStorage.removeItem('user');
};

// ✅ DEFAULT EXPORT
export default API;