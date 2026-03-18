// src/services/glassService.js - FIXED with debug logs

import API from './api';
import toast from 'react-hot-toast';

class GlassService {
  constructor() {
    console.log('🏭 GlassService initialized');
  }

  // ===== GET ALL GLASS PRODUCTS =====
  async getAll() {
    console.log('🔵 [getAll] Fetching glass products...');
    
    try {
      const response = await API.get("/products");
      console.log('📦 API Response status:', response.status);
      console.log('📦 API Response data:', response.data);
      
      let products = [];
      if (response.data) {
        if (Array.isArray(response.data)) {
          products = response.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          products = response.data.data;
        }
      }
      
      console.log('📦 All products count:', products.length);
      console.log('📦 All products:', products.map(p => ({ 
        id: p._id || p.id, 
        name: p.name, 
        category: p.category,
        subcategory: p.subcategory 
      })));
      
      // Filter only glass category products
      const glassProducts = products.filter(p => {
        if (!p) return false;
        
        const category = p.category ? p.category.toLowerCase() : '';
        const isGlass = category === 'glass';
        
        if (isGlass) {
          console.log(`✅ Glass product found: ${p.name} | subcategory: ${p.subcategory}`);
        }
        
        return isGlass;
      });
      
      console.log(`✅ Total glass products: ${glassProducts.length}`);
      
      return {
        data: glassProducts,
        total: glassProducts.length
      };
      
    } catch (error) {
      console.error('🔴 Error in getAll:', error);
      return { data: [], total: 0 };
    }
  }

  // ===== GET PRODUCTS BY SUBCATEGORY =====
  async getBySubcategory(subcategory) {
    console.log(`🔵 [getBySubcategory] Fetching ${subcategory} products...`);
    
    try {
      const result = await this.getAll();
      
      const filtered = result.data.filter(p => {
        if (!p.subcategory) return false;
        
        const productSubcat = p.subcategory.toLowerCase();
        const searchSubcat = subcategory.toLowerCase();
        
        // Exact match
        if (productSubcat === searchSubcat) {
          console.log(`✅ Exact match: ${p.name}`);
          return true;
        }
        
        // Contains match
        if (productSubcat.includes(searchSubcat)) {
          console.log(`✅ Contains match: ${p.name}`);
          return true;
        }
        
        return false;
      });
      
      console.log(`✅ Found ${filtered.length} ${subcategory} products`);
      
      return {
        data: filtered,
        total: filtered.length
      };
      
    } catch (error) {
      console.error('🔴 Error:', error);
      return { data: [], total: 0 };
    }
  }

  // ===== SPECIFIC GLASS TYPE METHODS =====
  async getWindowGlass() {
    return this.getBySubcategory('window-glass');
  }

  async getMirrorGlass() {
    return this.getBySubcategory('mirror-glass');
  }

  async getFluteGlass() {
    return this.getBySubcategory('flute-glass');
  }

  async getPlainGlass() {
    return this.getBySubcategory('plain-glass');
  }

  async getLaminatedGlass() {
    return this.getBySubcategory('laminated-glass');
  }

  async getToughenedGlass() {
    return this.getBySubcategory('toughened-glass');
  }

  async getFrostedGlass() {
    return this.getBySubcategory('frosted-glass');
  }

  async getStainedGlass() {
    return this.getBySubcategory('stained-glass');
  }

  async getBevelledGlass() {
    return this.getBySubcategory('bevelled-glass');
  }

  // ===== CREATE GLASS PRODUCT =====
  async create(productData) {
    console.log('🟢 [create] Creating glass product:', productData);
    
    try {
      // Validate required fields
      if (!productData.name) {
        throw new Error('Product name is required');
      }
      
      // Ensure category is glass
      const dataToSend = {
        ...productData,
        category: 'glass'
      };
      
      // Agar subcategory nahi di to default 'none' set karo
      if (!dataToSend.subcategory) {
        dataToSend.subcategory = 'none';
      }
      
      console.log('📦 Sending to backend:', dataToSend);
      
      const response = await API.post("/products", dataToSend);
      
      console.log('✅ Backend response:', response.data);
      
      toast.success('Glass product created successfully');
      
      return response.data;
      
    } catch (error) {
      console.error('🔴 [create] Error:', error);
      toast.error(error.response?.data?.message || 'Failed to create product');
      throw error;
    }
  }
}

const glassService = new GlassService();
export default glassService;