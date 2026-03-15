// API endpoints
export const API_ENDPOINTS = {
  PRODUCTS: '/products',
  CATEGORIES: '/categories',
  ORDERS: '/orders',
  CUSTOMERS: '/customers',
  AUTH: '/auth',
  UPLOAD: '/upload',
  DASHBOARD: '/dashboard'
};

// Product categories
export const PRODUCT_CATEGORIES = [
  { id: 'glass', label: 'Glass', color: '#4f8a8b' },
  { id: 'plywood', label: 'Plywood', color: '#bd7b4d' },
  { id: 'hardware', label: 'Hardware', color: '#b1935c' },
  { id: 'interiors', label: 'Interiors', color: '#c45a5a' }
];

// Order statuses
export const ORDER_STATUSES = [
  { value: 'pending', label: 'Pending', color: '#f59e0b' },
  { value: 'processing', label: 'Processing', color: '#3b82f6' },
  { value: 'shipped', label: 'Shipped', color: '#8b5cf6' },
  { value: 'delivered', label: 'Delivered', color: '#10b981' },
  { value: 'cancelled', label: 'Cancelled', color: '#ef4444' },
  { value: 'refunded', label: 'Refunded', color: '#6b7280' }
];

// Product statuses
export const PRODUCT_STATUSES = [
  { value: 'active', label: 'Active', color: '#10b981' },
  { value: 'inactive', label: 'Inactive', color: '#6b7280' }
];

// Stock statuses
export const STOCK_STATUSES = [
  { value: 'in-stock', label: 'In Stock', color: '#10b981', threshold: 10 },
  { value: 'low-stock', label: 'Low Stock', color: '#f59e0b', threshold: 5 },
  { value: 'out-of-stock', label: 'Out of Stock', color: '#ef4444', threshold: 0 }
];

// Payment methods
export const PAYMENT_METHODS = [
  { value: 'cash', label: 'Cash' },
  { value: 'card', label: 'Card' },
  { value: 'upi', label: 'UPI' },
  { value: 'bank', label: 'Bank Transfer' }
];

// Sort options
export const SORT_OPTIONS = [
  { value: 'name-asc', label: 'Name (A to Z)' },
  { value: 'name-desc', label: 'Name (Z to A)' },
  { value: 'price-asc', label: 'Price (Low to High)' },
  { value: 'price-desc', label: 'Price (High to Low)' },
  { value: 'date-asc', label: 'Date (Oldest First)' },
  { value: 'date-desc', label: 'Date (Newest First)' }
];

// Items per page
export const ITEMS_PER_PAGE = [10, 20, 50, 100];

// Date ranges
export const DATE_RANGES = [
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'year', label: 'This Year' },
  { value: 'custom', label: 'Custom Range' }
];

// Chart colors
export const CHART_COLORS = [
  '#c9a96e',
  '#bd7b4d',
  '#4f8a8b',
  '#c45a5a',
  '#b1935c',
  '#6a4e8c',
  '#2c3e50',
  '#e67e22',
  '#27ae60',
  '#e74c3c'
];

// Notification types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

// User roles
export const USER_ROLES = [
  { value: 'admin', label: 'Admin' },
  { value: 'manager', label: 'Manager' },
  { value: 'editor', label: 'Editor' },
  { value: 'viewer', label: 'Viewer' }
];

// Permissions
export const PERMISSIONS = {
  VIEW_PRODUCTS: 'view_products',
  CREATE_PRODUCTS: 'create_products',
  EDIT_PRODUCTS: 'edit_products',
  DELETE_PRODUCTS: 'delete_products',
  VIEW_ORDERS: 'view_orders',
  UPDATE_ORDERS: 'update_orders',
  VIEW_CUSTOMERS: 'view_customers',
  MANAGE_USERS: 'manage_users',
  VIEW_ANALYTICS: 'view_analytics',
  MANAGE_SETTINGS: 'manage_settings'
};

// Local storage keys
export const STORAGE_KEYS = {
  TOKEN: 'adminToken',
  USER: 'adminUser',
  THEME: 'adminTheme',
  SIDEBAR_COLLAPSED: 'sidebarCollapsed'
};

// Regex patterns
export const PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[6-9]\d{9}$/,
  PINCODE: /^[1-9][0-9]{5}$/,
  GST: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
  PAN: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
};

// Error messages
export const ERROR_MESSAGES = {
  REQUIRED: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PHONE: 'Please enter a valid 10-digit phone number',
  INVALID_PINCODE: 'Please enter a valid 6-digit pincode',
  PASSWORD_MISMATCH: 'Passwords do not match',
  WEAK_PASSWORD: 'Password must be at least 8 characters with 1 uppercase, 1 lowercase, 1 number and 1 special character',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'You are not authorized to perform this action'
};