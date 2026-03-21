// admin/src/services/api.js - FIXED REDIRECT URL
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = "https://api.newpremglasshouse.in/api";

console.log("🔌 API URL:", API_URL);

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// =======================
// REQUEST INTERCEPTOR
// =======================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Don't log passwords
    const logData = config.data ? { ...config.data } : config.params;
    if (logData && logData.password) {
      logData.password = '********';
    }
    
    console.log(
      `🚀 ${config.method?.toUpperCase()} ${config.url}`,
      logData
    );

    return config;
  },
  (error) => Promise.reject(error)
);

// =======================
// RESPONSE INTERCEPTOR - FIXED (No auto-refresh)
// =======================
api.interceptors.response.use(
  (response) => {
    console.log(
      `✅ ${response.config.method?.toUpperCase()} ${response.config.url}`,
      response.status
    );
    return response;
  },
  (error) => {
    // ✅ Check if this is a verify token request
    const isVerifyEndpoint = error.config?.url?.includes('/auth/verify');
    const isLoginEndpoint = error.config?.url?.includes('/auth/login');
    
    if (error.response) {
      const { status, data } = error.response;

      // Handle different status codes
      switch (status) {
        case 401:
          // ✅ For verify endpoint, don't show toast and don't redirect immediately
          if (isVerifyEndpoint) {
            console.log("🔒 Token verification failed (silent)");
            // Don't show toast for verify endpoint
          } 
          // ✅ For login endpoint, show appropriate message
          else if (isLoginEndpoint) {
            toast.error(data?.message || "Invalid email or password");
          }
          // ✅ For other endpoints, session expired
          else {
            toast.error("Session expired. Please login again.");
            localStorage.removeItem("adminToken");
            localStorage.removeItem("adminUser");
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            
            // 🔴 FIX: Redirect to FRONTEND login page
            setTimeout(() => {
              window.location.href = "https://newpremglasshouse.in/login";
            }, 1500);
          }
          break;

        case 403:
          if (!isVerifyEndpoint) {
            toast.error("You don't have permission to perform this action");
          }
          break;

        case 404:
          if (!isVerifyEndpoint && !isLoginEndpoint) {
            toast.error("Resource not found");
          }
          break;

        case 422:
          // Validation errors
          if (!isVerifyEndpoint) {
            if (data.errors) {
              Object.values(data.errors).forEach(err => {
                toast.error(err);
              });
            } else {
              toast.error(data?.message || "Validation failed");
            }
          }
          break;

        case 500:
          if (!isVerifyEndpoint) {
            toast.error("Server error. Please try again later.");
          }
          console.error("Server Error:", data);
          break;

        default:
          if (!isVerifyEndpoint && !isLoginEndpoint) {
            toast.error(data?.message || "Something went wrong");
          }
      }
    } else if (error.request) {
      // Request made but no response
      if (!isVerifyEndpoint && !isLoginEndpoint) {
        toast.error("Cannot connect to server. Please check your connection.");
      }
      console.error("No response:", error.request);
    } else {
      // Something else happened
      if (!isVerifyEndpoint && !isLoginEndpoint) {
        toast.error("An unexpected error occurred");
      }
      console.error("Error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default api;