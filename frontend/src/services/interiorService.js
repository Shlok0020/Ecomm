// src/services/interiorService.js - FIXED VERSION
// Sirf INTERIOR category ke products fetch honge

import API from './api';
import toast from 'react-hot-toast';

// ============================================
// INTERIOR SERVICE - FIXED: SIRF INTERIOR PRODUCTS
// ============================================

class InteriorService {
  constructor() {
    console.log('🏭 InteriorService initialized');
  }

  // ===== 🔥 MAIN FIX: SIRF INTERIOR PRODUCTS FETCH KARO =====
  async getAll() {
    console.log('🔵 [getAll] Fetching ONLY interior products from database...');
    
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
      
      // 3. 🔥 FILTER: Sirf "interior" category wale products rakho
      const interiorProducts = products.filter(product => {
        if (!product) return false;
        
        // Category check - case insensitive
        const category = product.category ? product.category.toLowerCase().trim() : '';
        
        // Exact match for "interior"
        if (category === 'interior') {
          return true;
        }
        
        // Agar category mein "interior" substring ho to bhi consider karo
        if (category.includes('interior')) {
          return true;
        }
        
        // Debug log for rejected products
        console.log('❌ Rejected product (not interior):', {
          id: product.id,
          name: product.name,
          category: product.category
        });
        
        return false;
      });
      
      console.log(`✅ [getAll] SUCCESS: ${interiorProducts.length} interior products found`);
      console.log('📋 Interior products list:', interiorProducts.map(p => ({
        id: p.id,
        name: p.name,
        category: p.category
      })));
      
      // 4. Return in the format expected by Interiors.jsx component
      return {
        data: interiorProducts,
        total: interiorProducts.length,
        message: `${interiorProducts.length} interior products fetched successfully`
      };
      
    } catch (error) {
      console.error('🔴 [getAll] Error fetching interior products:', error);
      
      // Toast error dikhao
      toast.error('Failed to load interior products');
      
      // Return empty array on error
      return {
        data: [],
        total: 0,
        message: error.message || 'Failed to fetch interior products'
      };
    }
  }

  // ===== SINGLE PRODUCT FETCH KARO =====
  async getById(id) {
    console.log(`🔵 [getById] Fetching interior product with ID: ${id}`);
    
    try {
      const response = await API.get(`/products/${id}`);
      
      let product = response.data;
      
      // Check if it's an interior product
      if (product && product.category && product.category.toLowerCase() === 'interior') {
        return { data: product };
      } else {
        throw new Error('Product is not an interior product');
      }
      
    } catch (error) {
      console.error('🔴 [getById] Error:', error);
      throw error;
    }
  }

  // ===== CATEGORY KE HISAB SE FILTER KARO =====
  async getByCategory(category) {
    console.log(`🔵 [getByCategory] Fetching ${category} interior products`);
    
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

  // ===== NEW PRODUCT CREATE KARO =====
  async create(productData) {
    console.log('🟢 [create] Creating new interior product:', productData);
    
    try {
      // Ensure category is interior
      const dataToSend = {
        ...productData,
        category: 'interior'  // Force category to interior
      };
      
      const response = await API.post("/products", dataToSend);
      
      toast.success('Interior product created successfully');
      
      return response.data;
      
    } catch (error) {
      console.error('🔴 [create] Error:', error);
      toast.error(error.response?.data?.message || 'Failed to create product');
      throw error;
    }
  }

  // ===== PRODUCT UPDATE KARO =====
  async update(id, productData) {
    console.log(`🟡 [update] Updating interior product ${id}:`, productData);
    
    try {
      const response = await API.put(`/products/${id}`, productData);
      
      toast.success('Interior product updated successfully');
      
      return response.data;
      
    } catch (error) {
      console.error('🔴 [update] Error:', error);
      toast.error(error.response?.data?.message || 'Failed to update product');
      throw error;
    }
  }

  // ===== PRODUCT DELETE KARO =====
  async delete(id) {
    console.log(`🔴 [delete] Deleting interior product ${id}`);
    
    try {
      const response = await API.delete(`/products/${id}`);
      
      toast.success('Interior product deleted successfully');
      
      return response.data;
      
    } catch (error) {
      console.error('🔴 [delete] Error:', error);
      toast.error(error.response?.data?.message || 'Failed to delete product');
      throw error;
    }
  }

  // ===== SEARCH PRODUCTS =====
  async search(query) {
    console.log(`🔵 [search] Searching interior products for: ${query}`);
    
    try {
      const result = await this.getAll();
      
      const searchLower = query.toLowerCase();
      
      const searchResults = result.data.filter(product => {
        return (
          (product.name && product.name.toLowerCase().includes(searchLower)) ||
          (product.description && product.description.toLowerCase().includes(searchLower)) ||
          (product.categoryLabel && product.categoryLabel.toLowerCase().includes(searchLower)) ||
          (product.client && product.client.toLowerCase().includes(searchLower)) ||
          (product.location && product.location.toLowerCase().includes(searchLower))
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

  // ===== STATUS KE HISAB SE FILTER KARO =====
  async getByStatus(status) {
    console.log(`🔵 [getByStatus] Fetching ${status} interior products`);
    
    try {
      const result = await this.getAll();
      
      const filteredProducts = result.data.filter(product => {
        if (!product.status) return false;
        return product.status.toLowerCase() === status.toLowerCase();
      });
      
      return {
        data: filteredProducts,
        count: filteredProducts.length
      };
      
    } catch (error) {
      console.error('🔴 [getByStatus] Error:', error);
      return { data: [], count: 0 };
    }
  }

  // ===== RECENT PRODUCTS FETCH KARO =====
  async getRecent(limit = 10) {
    console.log(`🔵 [getRecent] Fetching recent ${limit} interior products`);
    
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

  // ===== STATS NIKALO =====
  async getStats() {
    console.log('🔵 [getStats] Calculating interior statistics');
    
    try {
      const result = await this.getAll();
      const products = result.data;
      
      const stats = {
        total: products.length,
        byCategory: {},
        byStatus: {
          completed: 0,
          ongoing: 0,
          planned: 0
        },
        byLocation: {},
        totalValue: 0,
        averagePrice: 0
      };
      
      // Calculate statistics
      products.forEach(product => {
        // By category
        const category = product.category || 'other';
        stats.byCategory[category] = (stats.byCategory[category] || 0) + 1;
        
        // By status
        if (product.status) {
          stats.byStatus[product.status] = (stats.byStatus[product.status] || 0) + 1;
        }
        
        // By location
        if (product.location) {
          stats.byLocation[product.location] = (stats.byLocation[product.location] || 0) + 1;
        }
        
        // Total value
        stats.totalValue += product.price || 0;
      });
      
      // Average price
      if (products.length > 0) {
        stats.averagePrice = stats.totalValue / products.length;
      }
      
      return stats;
      
    } catch (error) {
      console.error('🔴 [getStats] Error:', error);
      return {
        total: 0,
        byCategory: {},
        byStatus: {},
        byLocation: {},
        totalValue: 0,
        averagePrice: 0
      };
    }
  }

  // ===== RESET TO DEFAULT =====
  async resetToDefault() {
    console.log('🟡 [resetToDefault] Resetting to default projects');
    
    try {
      // Clear any stored data
      localStorage.removeItem('interior_products');
      localStorage.removeItem('interior_admin_products');
      
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
const interiorService = new InteriorService();
export default interiorService;