// backend/controllers/productController.js
const Product = require('../models/Product');
const fs = require('fs');
const path = require('path');

// @desc    Get all products
// @route   GET /api/products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort('-createdAt');
    
    // Ensure image URLs are correct
    const productsWithImages = products.map(product => {
      const productObj = product.toObject();
      if (productObj.images && productObj.images.length > 0) {
        productObj.images = productObj.images.map(img => 
          img.startsWith('http') ? img : `http://localhost:5000${img}`
        );
        productObj.image = productObj.images[0];
      }
      return productObj;
    });
    
    res.json({
      success: true,
      data: productsWithImages
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    const productObj = product.toObject();
    if (productObj.images && productObj.images.length > 0) {
      productObj.images = productObj.images.map(img => 
        img.startsWith('http') ? img : `http://localhost:5000${img}`
      );
      productObj.image = productObj.images[0];
    }
    
    res.json({
      success: true,
      data: productObj
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
};

// backend/controllers/productController.js - FIXED createProduct function
// @desc    Create a product
// @route   POST /api/products
const createProduct = async (req, res) => {
  try {
    console.log('📥 REQUEST BODY:', req.body);
    console.log('📥 REQUEST FILES:', req.files);

    // Handle images
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      imageUrls = req.files.map(file => `/uploads/${file.filename}`);
    }

    // ✅ Ensure description has a value
    const description = req.body.description || 'No description provided';

    // Create product data
    const productData = {
      name: req.body.name,
      category: req.body.category,
      description: description, // ✅ Use the guaranteed value
      price: parseFloat(req.body.price) || 0,
      images: imageUrls,
      image: imageUrls.length > 0 ? imageUrls[0] : (req.body.image || null),
      subcategory: req.body.subcategory === 'none' ? null : req.body.subcategory,
      mrp: req.body.mrp ? parseFloat(req.body.mrp) : null,
      stock: req.body.stock ? parseInt(req.body.stock) : 0,
      brand: req.body.brand || '',
      size: req.body.size || '',
      isActive: true
    };

    // Handle arrays
    if (req.body.thickness) {
      try {
        productData.thickness = JSON.parse(req.body.thickness);
      } catch {
        productData.thickness = req.body.thickness.split(',').map(t => t.trim());
      }
    }

    if (req.body.features) {
      try {
        productData.features = JSON.parse(req.body.features);
      } catch {
        productData.features = req.body.features.split(',').map(f => f.trim());
      }
    }

    console.log('📦 SAVING PRODUCT:', productData);

    const product = await Product.create(productData);
    
    res.status(201).json({
      success: true,
      data: product
    });

  } catch (error) {
    console.error('❌ Create product error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
      error: error.toString()
    });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
const updateProduct = async (req, res) => {
  try {
    let imageUrls = [];
    
    // Handle new image uploads
    if (req.files && req.files.length > 0) {
      imageUrls = req.files.map(file => `/uploads/${file.filename}`);
    } else if (req.file) {
      imageUrls = [`/uploads/${req.file.filename}`];
    }

    // Prepare update data
    const updateData = { ...req.body };
    
    if (imageUrls.length > 0) {
      updateData.images = imageUrls;
      updateData.image = imageUrls[0];
    }

    // Parse numeric fields
    if (updateData.price) updateData.price = parseFloat(updateData.price);
    if (updateData.mrp) updateData.mrp = parseFloat(updateData.mrp);
    if (updateData.stock) updateData.stock = parseInt(updateData.stock);
    if (updateData.rating) updateData.rating = parseFloat(updateData.rating);
    
    // Parse features if it's a string
    if (updateData.features && typeof updateData.features === 'string') {
      try {
        updateData.features = JSON.parse(updateData.features);
      } catch (e) {
        updateData.features = updateData.features.split(',').map(f => f.trim());
      }
    }
    
    // Parse thickness if it's a string
    if (updateData.thickness && typeof updateData.thickness === 'string') {
      try {
        updateData.thickness = JSON.parse(updateData.thickness);
      } catch (e) {
        updateData.thickness = updateData.thickness.split(',').map(t => t.trim());
      }
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const productObj = product.toObject();
    if (productObj.images && productObj.images.length > 0) {
      productObj.images = productObj.images.map(img => 
        img.startsWith('http') ? img : `http://localhost:5000${img}`
      );
      productObj.image = productObj.images[0];
    }

    res.json({
      success: true,
      data: productObj
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating product',
      error: error.message
    });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Delete associated image files
    if (product.images && product.images.length > 0) {
      product.images.forEach(imagePath => {
        if (imagePath.startsWith('/uploads/')) {
          const filename = path.basename(imagePath);
          const fullPath = path.join(__dirname, '../uploads', filename);
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
          }
        }
      });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: error.message
    });
  }
};

// @desc    Get products by category
// @route   GET /api/products/category/:category
const getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.find({ 
      category: req.params.category,
      isActive: true 
    }).sort('-createdAt');
    
    const productsWithImages = products.map(product => {
      const productObj = product.toObject();
      if (productObj.images && productObj.images.length > 0) {
        productObj.images = productObj.images.map(img => 
          img.startsWith('http') ? img : `http://localhost:5000${img}`
        );
        productObj.image = productObj.images[0];
      }
      return productObj;
    });
    
    res.json({
      success: true,
      data: productsWithImages
    });
  } catch (error) {
    console.error('Get products by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory
};