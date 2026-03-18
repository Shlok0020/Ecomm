// src/services/plywoodService.js - COMPLETE FIXED VERSION
// Sirf PLYWOOD category ke products fetch honge

import API from './api';
import toast from 'react-hot-toast';

// ============================================
// PLYWOOD SERVICE - FIXED: SIRF PLYWOOD PRODUCTS
// ============================================

class PlywoodService {
  constructor() {
    console.log('🏭 PlywoodService initialized');
  }

  // ===== 🔥 MAIN FIX: SIRF PLYWOOD PRODUCTS FETCH KARO =====
  async getAll() {
    console.log('🔵 [getAll] Fetching ONLY plywood products from database...');
    
    try {
      // 1. Sirf plywood products fetch karo (backend filtering)
      // Agar backend pe filtering available ho to:
      const response = await API.get("/products?category=plywood");
      
      // Agar upar wala kaam na kare to ye use karo:
      // const response = await API.get("/products");
      
      console.log('📦 API Response:', response);
      
      // 2. Response se data nikaalo
      let products = [];
      
      if (response.data) {
        // Agar response.data array ho
        if (Array.isArray(response.data)) {
          products = response.data;
        } 
        // Agar response.data mein data property ho
        else if (response.data.data && Array.isArray(response.data.data)) {
          products = response.data.data;
        }
        // Agar response directly array ho
        else if (Array.isArray(response)) {
          products = response;
        }
      }
      
      console.log(`📦 Total products received: ${products.length}`);
      
      // 3. 🔥 FILTER: Sirf plywood category wale rakho
      const plywoodProducts = products.filter(product => {
        if (!product) return false;
        
        // Sirf exact "plywood" category match karo
        // Case-insensitive comparison
        const category = product.category ? product.category.toLowerCase().trim() : '';
        
        if (category === 'plywood') {
          return true;
        }
        
        // Agar category field mein "plywood" substring ho to bhi consider karo
        if (category.includes('plywood') || category.includes('ply')) {
          return true;
        }
        
        // Debug log for rejected products
        console.log('❌ Rejected product (not plywood):', {
          id: product.id,
          name: product.name,
          category: product.category
        });
        
        return false;
      });
      
      console.log(`✅ [getAll] SUCCESS: ${plywoodProducts.length} plywood products found`);
      console.log('📋 Plywood products list:', plywoodProducts.map(p => ({
        id: p.id,
        name: p.name,
        category: p.category
      })));
      
      // 4. Return in the format expected by component
      return {
        data: plywoodProducts,
        total: plywoodProducts.length,
        message: `${plywoodProducts.length} plywood products fetched successfully`
      };
      
    } catch (error) {
      console.error('🔴 [getAll] Error fetching plywood products:', error);
      
      // Toast error dikhao
      toast.error('Failed to load plywood products');
      
      // Return empty array on error
      return {
        data: [],
        total: 0,
        message: error.message || 'Failed to fetch plywood products'
      };
    }
  }

  // ===== SINGLE PRODUCT FETCH KARO =====
  async getById(id) {
    console.log(`🔵 [getById] Fetching plywood product with ID: ${id}`);
    
    try {
      const response = await API.get(`/products/${id}`);
      
      let product = response.data;
      
      // Check if it's a plywood product
      if (product && product.category && product.category.toLowerCase() === 'plywood') {
        return { data: product };
      } else {
        throw new Error('Product is not a plywood product');
      }
      
    } catch (error) {
      console.error('🔴 [getById] Error:', error);
      throw error;
    }
  }

  // ===== GRADE KE HISAB SE FILTER KARO =====
  async getByGrade(grade) {
    console.log(`🔵 [getByGrade] Fetching ${grade} plywood products`);
    
    try {
      const result = await this.getAll();
      
      const filteredProducts = result.data.filter(product => {
        if (!product.grade) return false;
        return product.grade.toLowerCase() === grade.toLowerCase();
      });
      
      return {
        data: filteredProducts,
        total: filteredProducts.length
      };
      
    } catch (error) {
      console.error('🔴 [getByGrade] Error:', error);
      return { data: [], total: 0 };
    }
  }

  // ===== NEW PRODUCT CREATE KARO =====
  async create(productData) {
    console.log('🟢 [create] Creating new plywood product:', productData);
    
    try {
      // Ensure category is plywood
      const dataToSend = {
        ...productData,
        category: 'plywood'  // Force category to plywood
      };
      
      const response = await API.post("/products", dataToSend);
      
      toast.success('Plywood product created successfully');
      
      return response.data;
      
    } catch (error) {
      console.error('🔴 [create] Error:', error);
      toast.error(error.response?.data?.message || 'Failed to create product');
      throw error;
    }
  }

  // ===== PRODUCT UPDATE KARO =====
  async update(id, productData) {
    console.log(`🟡 [update] Updating plywood product ${id}:`, productData);
    
    try {
      const response = await API.put(`/products/${id}`, productData);
      
      toast.success('Plywood product updated successfully');
      
      return response.data;
      
    } catch (error) {
      console.error('🔴 [update] Error:', error);
      toast.error(error.response?.data?.message || 'Failed to update product');
      throw error;
    }
  }

  // ===== PRODUCT DELETE KARO =====
  async delete(id) {
    console.log(`🔴 [delete] Deleting plywood product ${id}`);
    
    try {
      const response = await API.delete(`/products/${id}`);
      
      toast.success('Plywood product deleted successfully');
      
      return response.data;
      
    } catch (error) {
      console.error('🔴 [delete] Error:', error);
      toast.error(error.response?.data?.message || 'Failed to delete product');
      throw error;
    }
  }

  // ===== SEARCH PRODUCTS =====
  async search(query) {
    console.log(`🔵 [search] Searching plywood products for: ${query}`);
    
    try {
      const result = await this.getAll();
      
      const searchLower = query.toLowerCase();
      
      const searchResults = result.data.filter(product => {
        return (
          (product.name && product.name.toLowerCase().includes(searchLower)) ||
          (product.description && product.description.toLowerCase().includes(searchLower)) ||
          (product.brand && product.brand.toLowerCase().includes(searchLower)) ||
          (product.grade && product.grade.toLowerCase().includes(searchLower))
        );
      });
      
      return {
        data: searchResults,
        total: searchResults.length,
        query: query
      };
      
    } catch (error) {
      console.error('🔴 [search] Error:', error);
      return { data: [], total: 0 };
    }
  }

  // ===== STATS NIKALO =====
  async getStats() {
    console.log('🔵 [getStats] Calculating plywood statistics');
    
    try {
      const result = await this.getAll();
      const products = result.data;
      
      const stats = {
        total: products.length,
        byGrade: {},
        byBrand: {},
        totalStock: 0,
        totalValue: 0,
        averagePrice: 0
      };
      
      // Calculate statistics
      products.forEach(product => {
        // By grade
        const grade = product.grade || 'other';
        stats.byGrade[grade] = (stats.byGrade[grade] || 0) + 1;
        
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
        byGrade: {},
        byBrand: {},
        totalStock: 0,
        totalValue: 0,
        averagePrice: 0
      };
    }
  }
}

// ===== CREATE AND EXPORT SERVICE INSTANCE =====
const plywoodService = new PlywoodService();
export default plywoodService;