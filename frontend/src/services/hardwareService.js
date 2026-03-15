// src/services/hardwareService.js - FIXED VERSION
// Sirf HARDWARE category ke products fetch honge

import API from './api';
import toast from 'react-hot-toast';

// ============================================
// HARDWARE SERVICE - FIXED: SIRF HARDWARE PRODUCTS
// ============================================

class HardwareService {
  constructor() {
    console.log('🏭 HardwareService initialized');
  }

  // ===== 🔥 MAIN FIX: SIRF HARDWARE PRODUCTS FETCH KARO =====
  async getAll() {
    console.log('🔵 [getAll] Fetching ONLY hardware products from database...');
    
    try {
      // 1. Saare products fetch karo
      const response = await API.get("/products");
      console.log('📦 API Response:', response);
      
      // 2. Response se data nikaalo
      let products = [];
      
      if (response.data) {
        if (Array.isArray(response.data)) {
          products = response.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          products = response.data.data;
        } else if (Array.isArray(response)) {
          products = response;
        }
      }
      
      console.log(`📦 Total products received: ${products.length}`);
      
      // 3. 🔥 FILTER: Sirf "hardware" category wale products rakho
      const hardwareProducts = products.filter(product => {
        if (!product) return false;
        
        // Category check - case insensitive
        const category = product.category ? product.category.toLowerCase().trim() : '';
        
        // Exact match for "hardware"
        if (category === 'hardware') {
          return true;
        }
        
        // Agar category mein "hardware" substring ho to bhi consider karo
        if (category.includes('hardware')) {
          return true;
        }
        
        // Agar category "hardware" ke synonyms ho to bhi consider karo
        const hardwareKeywords = ['handle', 'hinge', 'ladder', 'adhesive', 'tool', 'lock', 'security', 'fevicol', 'silicone', 'aluminium'];
        if (hardwareKeywords.some(keyword => category.includes(keyword))) {
          return true;
        }
        
        // Debug log for rejected products
        console.log('❌ Rejected product (not hardware):', {
          id: product.id,
          name: product.name,
          category: product.category
        });
        
        return false;
      });
      
      console.log(`✅ [getAll] SUCCESS: ${hardwareProducts.length} hardware products found`);
      console.log('📋 Hardware products list:', hardwareProducts.map(p => ({
        id: p.id,
        name: p.name,
        category: p.category
      })));
      
      // 4. Return in the format expected by Hardware.jsx component
      return {
        data: hardwareProducts,
        total: hardwareProducts.length,
        message: `${hardwareProducts.length} hardware products fetched successfully`
      };
      
    } catch (error) {
      console.error('🔴 [getAll] Error fetching hardware products:', error);
      
      // Toast error dikhao
      toast.error('Failed to load hardware products');
      
      // Return empty array on error
      return {
        data: [],
        total: 0,
        message: error.message || 'Failed to fetch hardware products'
      };
    }
  }

  // ===== SINGLE PRODUCT FETCH KARO =====
  async getById(id) {
    console.log(`🔵 [getById] Fetching hardware product with ID: ${id}`);
    
    try {
      const response = await API.get(`/products/${id}`);
      
      let product = response.data;
      
      // Check if it's a hardware product
      if (product && product.category && product.category.toLowerCase() === 'hardware') {
        return { data: product };
      } else {
        throw new Error('Product is not a hardware product');
      }
      
    } catch (error) {
      console.error('🔴 [getById] Error:', error);
      throw error;
    }
  }

  // ===== CATEGORY KE HISAB SE FILTER KARO =====
  async getByCategory(category) {
    console.log(`🔵 [getByCategory] Fetching ${category} hardware products`);
    
    try {
      const result = await this.getAll();
      
      const filteredProducts = result.data.filter(product => {
        if (!product.category) return false;
        return product.category.toLowerCase() === category.toLowerCase();
      });
      
      return {
        data: filteredProducts,
        count: filteredProducts.length
      };
      
    } catch (error) {
      console.error('🔴 [getByCategory] Error:', error);
      return { data: [], count: 0 };
    }
  }

  // ===== RECENT PRODUCTS FETCH KARO =====
  async getRecent(limit = 10) {
    console.log(`🔵 [getRecent] Fetching recent ${limit} hardware products`);
    
    try {
      const result = await this.getAll();
      
      const sorted = result.data.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);
        return dateB - dateA;
      });
      
      return {
        data: sorted.slice(0, limit),
        total: result.data.length
      };
      
    } catch (error) {
      console.error('🔴 [getRecent] Error:', error);
      return { data: [], total: 0 };
    }
  }

  // ===== SEARCH PRODUCTS =====
  async search(query) {
    console.log(`🔵 [search] Searching hardware products for: ${query}`);
    
    try {
      const result = await this.getAll();
      
      const searchLower = query.toLowerCase();
      
      const searchResults = result.data.filter(product => {
        return (
          (product.name && product.name.toLowerCase().includes(searchLower)) ||
          (product.description && product.description.toLowerCase().includes(searchLower)) ||
          (product.categoryLabel && product.categoryLabel.toLowerCase().includes(searchLower)) ||
          (product.material && product.material.toLowerCase().includes(searchLower)) ||
          (product.brand && product.brand.toLowerCase().includes(searchLower))
        );
      });
      
      return {
        data: searchResults,
        count: searchResults.length,
        query: query
      };
      
    } catch (error) {
      console.error('🔴 [search] Error:', error);
      return { data: [], count: 0 };
    }
  }

  // ===== NEW PRODUCT CREATE KARO =====
  async create(productData) {
    console.log('🟢 [create] Creating new hardware product:', productData);
    
    try {
      // Validate required fields
      if (!productData.name) {
        throw new Error('Product name is required');
      }
      
      // Ensure category is hardware
      const dataToSend = {
        ...productData,
        category: 'hardware'  // Force category to hardware
      };
      
      const response = await API.post("/products", dataToSend);
      
      toast.success('Hardware product created successfully');
      
      return response.data;
      
    } catch (error) {
      console.error('🔴 [create] Error:', error);
      toast.error(error.response?.data?.message || 'Failed to create product');
      throw error;
    }
  }

  // ===== PRODUCT UPDATE KARO =====
  async update(id, productData) {
    console.log(`🟡 [update] Updating hardware product ${id}:`, productData);
    
    try {
      const response = await API.put(`/products/${id}`, productData);
      
      toast.success('Hardware product updated successfully');
      
      return response.data;
      
    } catch (error) {
      console.error('🔴 [update] Error:', error);
      toast.error(error.response?.data?.message || 'Failed to update product');
      throw error;
    }
  }

  // ===== PRODUCT DELETE KARO =====
  async delete(id) {
    console.log(`🔴 [delete] Deleting hardware product ${id}`);
    
    try {
      const response = await API.delete(`/products/${id}`);
      
      toast.success('Hardware product deleted successfully');
      
      return response.data;
      
    } catch (error) {
      console.error('🔴 [delete] Error:', error);
      toast.error(error.response?.data?.message || 'Failed to delete product');
      throw error;
    }
  }

  // ===== STATS NIKALO =====
  async getStats() {
    console.log('🔵 [getStats] Calculating hardware statistics');
    
    try {
      const result = await this.getAll();
      const products = result.data;
      
      const stats = {
        total: products.length,
        byCategory: {},
        byMaterial: {},
        byBrand: {},
        totalStock: 0,
        totalValue: 0,
        averagePrice: 0
      };
      
      // Calculate statistics
      products.forEach(product => {
        // By category
        const category = product.category || 'other';
        stats.byCategory[category] = (stats.byCategory[category] || 0) + 1;
        
        // By material
        if (product.material) {
          stats.byMaterial[product.material] = (stats.byMaterial[product.material] || 0) + 1;
        }
        
        // By brand
        if (product.brand) {
          stats.byBrand[product.brand] = (stats.byBrand[product.brand] || 0) + 1;
        }
        
        // Stock and value
        stats.totalStock += product.stock || 0;
        stats.totalValue += (product.price || 0) * (product.stock || 0);
      });
      
      // Average price
      if (products.length > 0) {
        const totalPrice = products.reduce((sum, p) => sum + (p.price || 0), 0);
        stats.averagePrice = totalPrice / products.length;
      }
      
      return stats;
      
    } catch (error) {
      console.error('🔴 [getStats] Error:', error);
      return {
        total: 0,
        byCategory: {},
        byMaterial: {},
        byBrand: {},
        totalStock: 0,
        totalValue: 0,
        averagePrice: 0
      };
    }
  }

  // ===== BULK OPERATIONS =====
  async bulkDelete(ids) {
    try {
      console.log('🔴 [bulkDelete] Deleting multiple hardware products:', ids);
      
      const results = [];
      for (const id of ids) {
        try {
          const result = await this.delete(id);
          results.push(result);
        } catch (err) {
          console.error(`Failed to delete product ${id}:`, err);
        }
      }
      
      toast.success(`${results.length} products deleted successfully`);
      
      return { success: true, count: results.length };
      
    } catch (error) {
      console.error('🔴 [bulkDelete] Error:', error);
      toast.error('Failed to bulk delete products');
      throw error;
    }
  }

  // ===== SUBSCRIBE TO CHANGES =====
  subscribe(callback) {
    // This is a mock subscription - in real app, you'd use WebSockets or similar
    window.addEventListener('hardwareProductsUpdated', callback);
    return () => window.removeEventListener('hardwareProductsUpdated', callback);
  }

  // ===== RESET TO DEFAULT =====
  async resetToDefault() {
    console.log('🟡 [resetToDefault] Resetting to default products');
    
    try {
      // Clear any stored data
      localStorage.removeItem('hardware_products');
      localStorage.removeItem('hardware_admin_products');
      
      toast.success('Reset to default successful');
      
      return {
        data: [],
        message: 'Reset to default successful'
      };
      
    } catch (error) {
      console.error('🔴 [resetToDefault] Error:', error);
      toast.error('Failed to reset');
      throw error;
    }
  }
}

// ===== CREATE AND EXPORT SERVICE INSTANCE =====
const hardwareService = new HardwareService();
export default hardwareService;