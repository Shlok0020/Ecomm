// Local storage utilities
export const storage = {
  // Set item
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      return false;
    }
  },

  // Get item
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue;
    }
  },

  // Remove item
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  },

  // Clear all
  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  },

  // Check if key exists
  has: (key) => {
    return localStorage.getItem(key) !== null;
  },

  // Get all keys
  keys: () => {
    return Object.keys(localStorage);
  },

  // Get size
  size: () => {
    return localStorage.length;
  },

  // Session storage
  session: {
    set: (key, value) => {
      try {
        sessionStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (error) {
        console.error('Error saving to sessionStorage:', error);
        return false;
      }
    },

    get: (key, defaultValue = null) => {
      try {
        const item = sessionStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
      } catch (error) {
        console.error('Error reading from sessionStorage:', error);
        return defaultValue;
      }
    },

    remove: (key) => {
      try {
        sessionStorage.removeItem(key);
        return true;
      } catch (error) {
        console.error('Error removing from sessionStorage:', error);
        return false;
      }
    },

    clear: () => {
      try {
        sessionStorage.clear();
        return true;
      } catch (error) {
        console.error('Error clearing sessionStorage:', error);
        return false;
      }
    }
  }
};