import { PATTERNS, ERROR_MESSAGES } from './constants';

// Validate required field
export const validateRequired = (value, fieldName) => {
  if (!value || value.trim() === '') {
    return `${fieldName} is required`;
  }
  return null;
};

// Validate email
export const validateEmail = (email) => {
  if (!email) return ERROR_MESSAGES.REQUIRED;
  if (!PATTERNS.EMAIL.test(email)) {
    return ERROR_MESSAGES.INVALID_EMAIL;
  }
  return null;
};

// Validate phone
export const validatePhone = (phone) => {
  if (!phone) return ERROR_MESSAGES.REQUIRED;
  const cleaned = phone.replace(/\D/g, '');
  if (!PATTERNS.PHONE.test(cleaned)) {
    return ERROR_MESSAGES.INVALID_PHONE;
  }
  return null;
};

// Validate pincode
export const validatePincode = (pincode) => {
  if (!pincode) return ERROR_MESSAGES.REQUIRED;
  if (!PATTERNS.PINCODE.test(pincode)) {
    return ERROR_MESSAGES.INVALID_PINCODE;
  }
  return null;
};

// Validate password
export const validatePassword = (password) => {
  if (!password) return ERROR_MESSAGES.REQUIRED;
  
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isLongEnough = password.length >= 8;
  
  if (!(hasUpperCase && hasLowerCase && hasNumbers && hasSpecial && isLongEnough)) {
    return ERROR_MESSAGES.WEAK_PASSWORD;
  }
  
  return null;
};

// Validate password match
export const validatePasswordMatch = (password, confirmPassword) => {
  if (password !== confirmPassword) {
    return ERROR_MESSAGES.PASSWORD_MISMATCH;
  }
  return null;
};

// Validate price
export const validatePrice = (price) => {
  if (!price && price !== 0) return ERROR_MESSAGES.REQUIRED;
  if (isNaN(price) || price < 0) {
    return 'Price must be a positive number';
  }
  return null;
};

// Validate stock
export const validateStock = (stock) => {
  if (!stock && stock !== 0) return ERROR_MESSAGES.REQUIRED;
  if (isNaN(stock) || stock < 0 || !Number.isInteger(Number(stock))) {
    return 'Stock must be a positive integer';
  }
  return null;
};

// Validate URL
export const validateUrl = (url) => {
  if (!url) return null; // Optional field
  try {
    new URL(url);
    return null;
  } catch {
    return 'Please enter a valid URL';
  }
};

// Validate GST number
export const validateGST = (gst) => {
  if (!gst) return null; // Optional field
  if (!PATTERNS.GST.test(gst)) {
    return 'Please enter a valid GST number';
  }
  return null;
};

// Validate PAN number
export const validatePAN = (pan) => {
  if (!pan) return null; // Optional field
  if (!PATTERNS.PAN.test(pan)) {
    return 'Please enter a valid PAN number';
  }
  return null;
};

// Validate form
export const validateForm = (data, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach(field => {
    const value = data[field];
    const fieldRules = rules[field];
    
    fieldRules.forEach(rule => {
      const error = rule(value, field);
      if (error && !errors[field]) {
        errors[field] = error;
      }
    });
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};