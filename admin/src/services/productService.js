// admin/src/services/productService.js - COMPLETE FIX
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = "http://localhost:5000/api";

const productService = {
  // Get all products - FIXED VERSION
  getAll: async () => {
    try {
      const token = localStorage.getItem("token");
      
      console.log("🔍 Fetching all products from:", `${API_URL}/products`);
      
      const response = await axios.get(`${API_URL}/products`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      
      console.log("✅ API Response:", response.data);
      
      // ✅ IMPORTANT: Handle the response structure correctly
      // Your backend returns: { success: true, data: [...] }
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        console.log(`📦 Found ${response.data.data.length} products`);
        return response.data.data; // Return just the array
      }
      
      // Fallback: if response.data is already an array
      if (Array.isArray(response.data)) {
        console.log(`📦 Found ${response.data.length} products (direct array)`);
        return response.data;
      }
      
      // Fallback: if response.data.data is an array
      if (response.data && Array.isArray(response.data.data)) {
        console.log(`📦 Found ${response.data.data.length} products (nested data)`);
        return response.data.data;
      }
      
      console.warn("Unexpected response format:", response.data);
      return [];
      
    } catch (error) {
      console.error("❌ Get all error:", error);
      
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem('adminToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      } else {
        toast.error("Failed to load products");
      }
      
      return []; // Return empty array on error
    }
  },

  // Get single product
  getById: async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/products/${id}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      
      if (response.data && response.data.success) {
        return response.data.data;
      }
      return response.data;
    } catch (error) {
      console.error("Get by id error:", error);
      throw error;
    }
  },

  // Create product
  create: async (productData) => {
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        toast.error("Please login first");
        window.location.href = '/login';
        return;
      }

      const response = await axios.post(`${API_URL}/products`, productData, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      
      toast.success("Product created successfully");
      return response.data;
      
    } catch (error) {
      console.error("Create error:", error);
      
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem('adminToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      } else {
        const errorMsg = error.response?.data?.message || error.message || "Failed to create product";
        toast.error(errorMsg);
      }
      
      throw error;
    }
  },

  // Update product
  update: async (id, productData) => {
    try {
      const token = localStorage.getItem("token");
      
      const response = await axios.put(`${API_URL}/products/${id}`, productData, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      
      toast.success("Product updated successfully");
      return response.data;
    } catch (error) {
      console.error("Update error:", error);
      
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem('adminToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      } else {
        toast.error(error.response?.data?.message || "Failed to update product");
      }
      
      throw error;
    }
  },

  // Delete product
  delete: async (id) => {
    try {
      const token = localStorage.getItem("token");
      
      const response = await axios.delete(`${API_URL}/products/${id}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      
      toast.success("Product deleted successfully");
      return response.data;
    } catch (error) {
      console.error("Delete error:", error);
      
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem('adminToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      } else {
        toast.error("Failed to delete product");
      }
      
      throw error;
    }
  },
};

export default productService;