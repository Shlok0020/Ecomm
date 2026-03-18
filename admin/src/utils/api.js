import axios from 'axios';
import { storage } from './storage';
import { API_ENDPOINTS } from './constants';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = storage.get('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now()
      };
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          toast.error('Session expired. Please login again.');
          storage.remove('adminToken');
          storage.remove('adminUser');
          window.location.href = '/login';
          break;
        case 403:
          toast.error('You do not have permission');
          break;
        case 404:
          toast.error(data.message || 'Resource not found');
          break;
        case 422:
          if (data.errors) {
            Object.values(data.errors).forEach(err => {
              toast.error(err);
            });
          }
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
      toast.error(error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;