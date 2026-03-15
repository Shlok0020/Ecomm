// src/services/glassService.js - COMPLETE WITH DATA FLOW
import API from './api';
import { cache } from './api';
import toast from 'react-hot-toast';

// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
  STORAGE_MODE: 'api', // 'local' or 'api'
  STORAGE_KEYS: {
    PRODUCTS: 'glass_products',
    DELETED_IDS: 'glass_deleted_ids',
    CUSTOM_CATEGORIES: 'glass_custom_categories',
    LAST_SYNC: 'glass_last_sync'
  },
  API_ENDPOINTS: {
    PRODUCTS: '/glass',
    CATEGORIES: '/glass/categories'
  }
};

// ============================================
// DEFAULT CATEGORIES
// ============================================
const defaultCategories = [
  { 
    id: 'window', 
    label: 'Window Glass', 
    icon: 'FaWindowMaximize', 
    color: '#4f8a8b',
    description: 'Premium quality window glass for modern facades and interiors.',
    features: ['Toughened', 'Sound Proof', 'UV Protection'],
    isDefault: true,
    order: 1
  },
  { 
    id: 'mirror', 
    label: 'Mirror Glass', 
    icon: 'FaImages', 
    color: '#bd7b4d',
    description: 'High quality silver backing mirror for interiors.',
    features: ['Crystal Clear', 'Silver Backing', 'Scratch Resistant'],
    isDefault: true,
    order: 2
  },
  { 
    id: 'fluted', 
    label: 'Fluted Glass', 
    icon: 'FaThLarge', 
    color: '#c45a5a',
    description: 'Decorative fluted glass for modern interior design.',
    features: ['Textured Finish', 'Light Diffusion', 'Privacy'],
    isDefault: true,
    order: 3
  },
  { 
    id: 'toughened', 
    label: 'Toughened Glass', 
    icon: 'FaShieldAlt', 
    color: '#6a4e8c',
    description: 'Safety glass for doors, windows and partitions.',
    features: ['Heat Strengthened', 'Impact Resistant', 'Safety Glass'],
    isDefault: true,
    order: 4
  }
];

// ============================================
// DEFAULT PRODUCTS
// ============================================
const defaultProducts = [
  {
    id: 1,
    name: 'Clear Float Glass',
    description: 'Premium clear float glass for windows and facades with crystal clear transparency and distortion-free finish.',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800',
    category: 'window',
    categoryLabel: 'Window Glass',
    thickness: ['5mm', '8mm', '10mm', '12mm'],
    size: '8x4 ft',
    price: 350,
    mrp: 400,
    stock: 100,
    features: ['Crystal Clear', 'Distortion Free', 'High Light Transmission'],
    brand: 'Saint Gobain',
    warranty: '5 years',
    isDefault: true,
    isAdminAdded: false,
    isActive: true,
    rating: 4.5,
    reviews: 128,
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 2,
    name: 'Toughened Glass',
    description: 'Safety glass for doors, windows and partitions. Heat strengthened for extra durability.',
    image: 'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?auto=format&fit=crop&q=80&w=800',
    category: 'toughened',
    categoryLabel: 'Toughened Glass',
    thickness: ['8mm', '10mm', '12mm'],
    size: 'Custom',
    price: 550,
    mrp: 650,
    stock: 75,
    features: ['Heat Strengthened', 'Safety Glass', 'Impact Resistant'],
    brand: 'Asahi Glass',
    warranty: '10 years',
    isDefault: true,
    isAdminAdded: false,
    isActive: true,
    rating: 4.8,
    reviews: 95,
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 3,
    name: 'Silver Mirror',
    description: 'High quality silver backing mirror for interiors with crystal clear reflection.',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800',
    category: 'mirror',
    categoryLabel: 'Mirror Glass',
    thickness: ['4mm', '5mm', '6mm'],
    size: 'Various',
    price: 450,
    mrp: 500,
    stock: 50,
    features: ['Crystal Clear', 'Silver Backing', 'Scratch Resistant'],
    brand: 'Modi Mirror',
    warranty: '3 years',
    isDefault: true,
    isAdminAdded: false,
    isActive: true,
    rating: 4.3,
    reviews: 67,
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 4,
    name: 'Fluted Glass',
    description: 'Decorative fluted glass for modern interiors with textured finish.',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800',
    category: 'fluted',
    categoryLabel: 'Fluted Glass',
    thickness: ['8mm', '10mm'],
    size: '8x4 ft',
    price: 650,
    mrp: 750,
    stock: 30,
    features: ['Textured Finish', 'Light Diffusion', 'Privacy'],
    brand: 'Saint Gobain',
    warranty: '5 years',
    isDefault: true,
    isAdminAdded: false,
    isActive: true,
    rating: 4.6,
    reviews: 42,
    createdAt: '2024-01-01T00:00:00.000Z'
  }
];

// ============================================
// STORAGE MANAGER
// ============================================
class StorageManager {
  constructor() {
    this.cache = {
      products: null,
      deletedIds: null,
      customCategories: null,
      lastSync: null
    };
    this.listeners = new Set();
  }

  // Subscribe to changes
  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  // Notify all listeners
  notifyListeners() {
    this.listeners.forEach(callback => callback());
  }

  // ===== PRODUCTS =====
  async getProducts() {
    try {
      if (this.cache.products) {
        return this.cache.products;
      }
      const saved = localStorage.getItem(CONFIG.STORAGE_KEYS.PRODUCTS);
      const products = saved ? JSON.parse(saved) : [];
      this.cache.products = products;
      return products;
    } catch (error) {
      console.error('Error loading products:', error);
      return [];
    }
  }

  async saveProducts(products) {
    try {
      localStorage.setItem(CONFIG.STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
      this.cache.products = products;
      this.cache.lastSync = new Date().toISOString();
      
      // Trigger events
      this.notifyListeners();
      this.triggerEvents('products');
      
      return true;
    } catch (error) {
      console.error('Error saving products:', error);
      return false;
    }
  }

  // ===== DELETED IDs =====
  async getDeletedIds() {
    try {
      if (this.cache.deletedIds) {
        return this.cache.deletedIds;
      }
      const saved = localStorage.getItem(CONFIG.STORAGE_KEYS.DELETED_IDS);
      const ids = saved ? JSON.parse(saved) : [];
      this.cache.deletedIds = ids;
      return ids;
    } catch (error) {
      console.error('Error loading deleted IDs:', error);
      return [];
    }
  }

  async saveDeletedIds(ids) {
    try {
      localStorage.setItem(CONFIG.STORAGE_KEYS.DELETED_IDS, JSON.stringify(ids));
      this.cache.deletedIds = ids;
      return true;
    } catch (error) {
      console.error('Error saving deleted IDs:', error);
      return false;
    }
  }

  // ===== CUSTOM CATEGORIES =====
  async getCustomCategories() {
    try {
      if (this.cache.customCategories) {
        return this.cache.customCategories;
      }
      const saved = localStorage.getItem(CONFIG.STORAGE_KEYS.CUSTOM_CATEGORIES);
      const categories = saved ? JSON.parse(saved) : [];
      this.cache.customCategories = categories;
      return categories;
    } catch (error) {
      console.error('Error loading custom categories:', error);
      return [];
    }
  }

  async saveCustomCategories(categories) {
    try {
      localStorage.setItem(CONFIG.STORAGE_KEYS.CUSTOM_CATEGORIES, JSON.stringify(categories));
      this.cache.customCategories = categories;
      
      this.notifyListeners();
      this.triggerEvents('categories');
      
      return true;
    } catch (error) {
      console.error('Error saving custom categories:', error);
      return false;
    }
  }

  // ===== SYNC =====
  async getLastSync() {
    try {
      const saved = localStorage.getItem(CONFIG.STORAGE_KEYS.LAST_SYNC);
      return saved || null;
    } catch (error) {
      return null;
    }
  }

  async updateLastSync() {
    try {
      const now = new Date().toISOString();
      localStorage.setItem(CONFIG.STORAGE_KEYS.LAST_SYNC, now);
      this.cache.lastSync = now;
      return now;
    } catch (error) {
      return null;
    }
  }

  // ===== CLEAR =====
  async clearAll() {
    try {
      localStorage.removeItem(CONFIG.STORAGE_KEYS.PRODUCTS);
      localStorage.removeItem(CONFIG.STORAGE_KEYS.DELETED_IDS);
      localStorage.removeItem(CONFIG.STORAGE_KEYS.CUSTOM_CATEGORIES);
      localStorage.removeItem(CONFIG.STORAGE_KEYS.LAST_SYNC);
      
      this.cache = {
        products: null,
        deletedIds: null,
        customCategories: null,
        lastSync: null
      };
      
      this.notifyListeners();
      this.triggerEvents('all');
      
      return true;
    } catch (error) {
      console.error('Error clearing storage:', error);
      return false;
    }
  }

  // Trigger events for real-time updates
  triggerEvents(type) {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('productsUpdated', { detail: { type } }));
      window.dispatchEvent(new CustomEvent('glassProductsUpdated', { detail: { type } }));
    }
  }
}

// ============================================
// GLASS SERVICE
// ============================================
class GlassService {
  constructor() {
    this.storage = new StorageManager();
    this.defaultCategories = defaultCategories;
    this.defaultProducts = defaultProducts;
    this.api = API;
  }

  // ===== INITIALIZATION =====
  async initialize() {
    try {
      console.log('🚀 Initializing GlassService...');
      
      // Try to sync with backend if available
      if (CONFIG.STORAGE_MODE === 'api') {
        await this.syncWithBackend();
      }
      
      console.log('✅ GlassService initialized');
      return true;
    } catch (error) {
      console.error('❌ Error initializing GlassService:', error);
      return false;
    }
  }

  // ===== SYNC WITH BACKEND =====
  async syncWithBackend() {
    try {
      console.log('🔄 Syncing with backend...');
      
      // Fetch from backend
      const response = await this.api.get(CONFIG.API_ENDPOINTS.PRODUCTS);
      const backendProducts = response.data || [];
      
      // Merge with local data
      const localProducts = await this.storage.getProducts();
      const mergedProducts = this.mergeProducts(localProducts, backendProducts);
      
      // Save merged data
      await this.storage.saveProducts(mergedProducts);
      await this.storage.updateLastSync();
      
      console.log('✅ Sync complete');
      return true;
    } catch (error) {
      console.error('❌ Error syncing with backend:', error);
      return false;
    }
  }

  mergeProducts(local, backend) {
    // Create a map of backend products by ID
    const backendMap = new Map(backend.map(p => [p.id, p]));
    
    // Filter local products that don't exist in backend
    const validLocal = local.filter(p => !backendMap.has(p.id));
    
    // Return merged array
    return [...backend, ...validLocal];
  }

  // ===== CATEGORIES =====
  async getAllCategories() {
    try {
      const customCategories = await this.storage.getCustomCategories();
      
      const allCategories = [
        ...this.defaultCategories,
        ...customCategories.map(cat => ({
          ...cat,
          isDefault: false,
          isCustom: true
        }))
      ];
      
      // Sort by order
      return allCategories.sort((a, b) => (a.order || 999) - (b.order || 999));
    } catch (error) {
      console.error('Error getting categories:', error);
      return this.defaultCategories;
    }
  }

  async addCategory(categoryData) {
    try {
      const customCategories = await this.storage.getCustomCategories();
      
      const allCategories = await this.getAllCategories();
      const maxOrder = Math.max(...allCategories.map(c => c.order || 0), 0);
      
      const newCategory = {
        id: categoryData.id || `cat_${Date.now()}`,
        label: categoryData.label,
        icon: categoryData.icon || 'FaGlassCheers',
        color: categoryData.color || '#c9a96e',
        description: categoryData.description || `Premium ${categoryData.label}`,
        features: categoryData.features || ['Premium Quality'],
        isDefault: false,
        isCustom: true,
        order: maxOrder + 1,
        createdAt: new Date().toISOString(),
        createdBy: 'admin',
        productCount: 0
      };
      
      customCategories.push(newCategory);
      await this.storage.saveCustomCategories(customCategories);
      
      toast.success(`Category "${newCategory.label}" added`);
      
      return {
        success: true,
        data: newCategory,
        message: `Category added successfully`
      };
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('Failed to add category');
      throw error;
    }
  }

  async updateCategory(categoryId, categoryData) {
    try {
      const customCategories = await this.storage.getCustomCategories();
      
      const categoryIndex = customCategories.findIndex(c => c.id === categoryId);
      
      if (categoryIndex === -1) {
        throw new Error('Category not found');
      }
      
      customCategories[categoryIndex] = {
        ...customCategories[categoryIndex],
        ...categoryData,
        updatedAt: new Date().toISOString()
      };
      
      await this.storage.saveCustomCategories(customCategories);
      
      toast.success('Category updated');
      
      return {
        success: true,
        data: customCategories[categoryIndex],
        message: 'Category updated successfully'
      };
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('Failed to update category');
      throw error;
    }
  }

  async deleteCategory(categoryId) {
    try {
      const customCategories = await this.storage.getCustomCategories();
      
      const categoryIndex = customCategories.findIndex(c => c.id === categoryId);
      
      if (categoryIndex === -1) {
        throw new Error('Category not found or cannot delete default category');
      }
      
      const deletedCategory = customCategories[categoryIndex];
      customCategories.splice(categoryIndex, 1);
      
      await this.storage.saveCustomCategories(customCategories);
      
      toast.success(`Category "${deletedCategory.label}" deleted`);
      
      return {
        success: true,
        data: deletedCategory,
        message: `Category deleted successfully`
      };
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
      throw error;
    }
  }

  async getCategoryStats() {
    try {
      const products = await this.getAll();
      const categories = await this.getAllCategories();
      
      const stats = categories.map(cat => ({
        ...cat,
        productCount: products.data.filter(p => p.category === cat.id).length
      }));
      
      return stats;
    } catch (error) {
      console.error('Error getting category stats:', error);
      return [];
    }
  }

  // ===== PRODUCTS =====
 async getAll() {
  try {
    const res = await API.get("/products");

    const glassProducts = res.data.filter(
      (p) => p.category === "glass"
    );

    return {
      data: glassProducts
    };

  } catch (error) {
    console.error("Glass fetch error:", error);
    return { data: [] };
  }
}

  async getById(id) {
    try {
      const searchId = typeof id === 'string' ? parseInt(id) : id;
      
      const customProducts = await this.storage.getProducts();
      const customProduct = customProducts.find(p => p.id === searchId);
      if (customProduct) {
        return { data: customProduct, source: 'local' };
      }
      
      const defaultProduct = this.defaultProducts.find(p => p.id === searchId);
      if (defaultProduct) {
        const deletedIds = await this.storage.getDeletedIds();
        if (!deletedIds.includes(searchId)) {
          return { data: defaultProduct, source: 'default' };
        }
      }
      
      throw new Error('Product not found');
    } catch (error) {
      console.error('Error in getById:', error);
      throw error;
    }
  }

  async getByCategory(category) {
    try {
      const allProducts = await this.getAll();
      const filtered = allProducts.data.filter(p => p.category === category);
      return { 
        data: filtered,
        count: filtered.length
      };
    } catch (error) {
      console.error('Error in getByCategory:', error);
      return { data: [], count: 0 };
    }
  }

  async getRecent(limit = 10) {
    try {
      const allProducts = await this.getAll();
      const sorted = allProducts.data.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);
        return dateB - dateA;
      });
      
      return { 
        data: sorted.slice(0, limit),
        total: allProducts.data.length
      };
    } catch (error) {
      console.error('Error in getRecent:', error);
      return { data: [], total: 0 };
    }
  }

  async search(query) {
    try {
      const allProducts = await this.getAll();
      const searchLower = query.toLowerCase();
      
      const results = allProducts.data.filter(p => 
        p.name.toLowerCase().includes(searchLower) ||
        p.description?.toLowerCase().includes(searchLower) ||
        p.categoryLabel?.toLowerCase().includes(searchLower) ||
        p.brand?.toLowerCase().includes(searchLower)
      );
      
      return {
        data: results,
        count: results.length,
        query
      };
    } catch (error) {
      console.error('Error in search:', error);
      return { data: [], count: 0 };
    }
  }

  // ===== CREATE PRODUCT =====
  async create(productData) {
    try {
      console.log('🟡 Creating product:', productData);
      
      // Validate required fields
      if (!productData.name) {
        throw new Error('Product name is required');
      }
      
      if (!productData.category) {
        throw new Error('Category is required');
      }
      
      // Get category label
      const categories = await this.getAllCategories();
      const category = categories.find(c => c.id === productData.category);
      
      const newProduct = {
        id: Date.now(),
        name: productData.name,
        description: productData.description || 'No description available',
        image: productData.image || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800',
        category: productData.category,
        categoryLabel: category?.label || productData.categoryLabel || 'Glass Products',
        price: Number(productData.price) || 0,
        mrp: Number(productData.mrp) || Number(productData.price) + 500 || 0,
        stock: Number(productData.stock) || 0,
        thickness: productData.thickness ? 
          (Array.isArray(productData.thickness) ? productData.thickness : [productData.thickness]) : 
          [],
        size: productData.size || 'Standard',
        features: productData.features || ['Premium Quality', 'Durable'],
        brand: productData.brand || 'New Prem',
        warranty: productData.warranty || '5 years',
        isDefault: false,
        isAdminAdded: true,
        isActive: true,
        rating: 0,
        reviews: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      console.log('🟢 New product object:', newProduct);
      
      const customProducts = await this.storage.getProducts();
      customProducts.push(newProduct);
      await this.storage.saveProducts(customProducts);
      
      toast.success('Product created successfully');
      
      return { 
        success: true,
        data: newProduct, 
        message: 'Product created successfully' 
      };
    } catch (error) {
      console.error('Error in create:', error);
      toast.error(error.message || 'Failed to create product');
      throw error;
    }
  }

  // ===== UPDATE PRODUCT =====
  async update(id, productData) {
    try {
      const searchId = typeof id === 'string' ? parseInt(id) : id;
      
      const customProducts = await this.storage.getProducts();
      const index = customProducts.findIndex(p => p.id === searchId);
      
      if (index !== -1) {
        // Get category label if category changed
        let categoryLabel = customProducts[index].categoryLabel;
        if (productData.category && productData.category !== customProducts[index].category) {
          const categories = await this.getAllCategories();
          const category = categories.find(c => c.id === productData.category);
          categoryLabel = category?.label || productData.categoryLabel;
        }
        
        customProducts[index] = {
          ...customProducts[index],
          ...productData,
          categoryLabel: categoryLabel || customProducts[index].categoryLabel,
          updatedAt: new Date().toISOString()
        };
        
        await this.storage.saveProducts(customProducts);
        
        toast.success('Product updated');
        
        return { 
          success: true,
          data: customProducts[index], 
          message: 'Product updated successfully' 
        };
      }
      
      throw new Error('Product not found');
    } catch (error) {
      console.error('Error in update:', error);
      toast.error('Failed to update product');
      throw error;
    }
  }

  // ===== DELETE PRODUCT =====
  async delete(id) {
    try {
      const searchId = typeof id === 'string' ? parseInt(id) : id;
      
      console.log('🔴 Attempting to delete product with ID:', searchId);
      
      const customProducts = await this.storage.getProducts();
      console.log('📦 Products before delete:', customProducts.length);
      
      const index = customProducts.findIndex(p => p.id === searchId);
      console.log('🔍 Product index:', index);
      
      if (index !== -1) {
        const deletedProduct = customProducts[index];
        customProducts.splice(index, 1);
        
        await this.storage.saveProducts(customProducts);
        
        console.log('✅ Product permanently deleted:', deletedProduct);
        console.log('📦 Products after delete:', customProducts.length);
        
        toast.success('Product deleted');
        
        return { 
          success: true, 
          data: { id: searchId, isDefault: false },
          message: 'Product deleted successfully' 
        };
      }
      
      const defaultProduct = this.defaultProducts.find(p => p.id === searchId);
      if (defaultProduct) {
        console.log('⚠️ Hiding default product:', defaultProduct);
        
        const deletedIds = await this.storage.getDeletedIds();
        if (!deletedIds.includes(searchId)) {
          deletedIds.push(searchId);
          await this.storage.saveDeletedIds(deletedIds);
        }
        
        this.storage.triggerEvents('products');
        
        toast.success('Default product hidden');
        
        return { 
          success: true, 
          data: { id: searchId, isDefault: true },
          message: 'Default product hidden' 
        };
      }
      
      throw new Error('Product not found');
    } catch (error) {
      console.error('🔴 Error in delete:', error);
      toast.error('Failed to delete product');
      throw error;
    }
  }

  // ===== BULK OPERATIONS =====
  async bulkDelete(ids) {
    try {
      console.log('🔴 Bulk deleting products:', ids);
      
      const customProducts = await this.storage.getProducts();
      const deletedIds = await this.storage.getDeletedIds();
      
      let deletedCount = 0;
      let hiddenCount = 0;
      
      ids.forEach(id => {
        const searchId = typeof id === 'string' ? parseInt(id) : id;
        
        const index = customProducts.findIndex(p => p.id === searchId);
        if (index !== -1) {
          customProducts.splice(index, 1);
          deletedCount++;
        } else {
          const defaultExists = this.defaultProducts.some(p => p.id === searchId);
          if (defaultExists && !deletedIds.includes(searchId)) {
            deletedIds.push(searchId);
            hiddenCount++;
          }
        }
      });
      
      await this.storage.saveProducts(customProducts);
      await this.storage.saveDeletedIds(deletedIds);
      
      toast.success(`${deletedCount} products deleted, ${hiddenCount} hidden`);
      
      return {
        success: true,
        data: { deleted: deletedCount, hidden: hiddenCount }
      };
    } catch (error) {
      console.error('Error in bulkDelete:', error);
      toast.error('Failed to bulk delete');
      throw error;
    }
  }

  async bulkUpdateStatus(ids, isActive) {
    try {
      const customProducts = await this.storage.getProducts();
      
      ids.forEach(id => {
        const searchId = typeof id === 'string' ? parseInt(id) : id;
        const product = customProducts.find(p => p.id === searchId);
        if (product) {
          product.isActive = isActive;
        }
      });
      
      await this.storage.saveProducts(customProducts);
      
      toast.success(`${ids.length} products updated`);
      
      return { success: true };
    } catch (error) {
      console.error('Error in bulkUpdateStatus:', error);
      toast.error('Failed to update products');
      throw error;
    }
  }

  // ===== STATISTICS =====
  async getStats() {
    try {
      const products = await this.getAll();
      const categories = await this.getAllCategories();
      const customProducts = await this.storage.getProducts();
      
      const stats = {
        total: products.data.length,
        default: this.defaultProducts.length,
        custom: customProducts.length,
        active: products.data.filter(p => p.isActive).length,
        inactive: products.data.filter(p => !p.isActive).length,
        categories: categories.length,
        byCategory: {},
        totalStock: 0,
        totalValue: 0
      };
      
      // Calculate by category and totals
      products.data.forEach(p => {
        const cat = p.category;
        if (!stats.byCategory[cat]) {
          stats.byCategory[cat] = {
            count: 0,
            totalStock: 0,
            totalValue: 0
          };
        }
        stats.byCategory[cat].count++;
        stats.byCategory[cat].totalStock += p.stock || 0;
        stats.byCategory[cat].totalValue += (p.price || 0) * (p.stock || 0);
        
        stats.totalStock += p.stock || 0;
        stats.totalValue += (p.price || 0) * (p.stock || 0);
      });
      
      return stats;
    } catch (error) {
      console.error('Error in getStats:', error);
      return {};
    }
  }

  // ===== SUBSCRIPTION =====
  subscribe(callback) {
    return this.storage.subscribe(callback);
  }

  // ===== RESET =====
  async resetToDefault() {
    try {
      await this.storage.clearAll();
      
      toast.success('Reset to default successful');
      
      return { 
        data: this.defaultProducts,
        message: 'Reset to default successful' 
      };
    } catch (error) {
      console.error('Error in resetToDefault:', error);
      toast.error('Failed to reset');
      throw error;
    }
  }
}

// Create and export singleton instance
const glassService = new GlassService();

// Initialize on import
if (typeof window !== 'undefined') {
  glassService.initialize();
}

export default glassService;