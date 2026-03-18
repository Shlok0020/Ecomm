// backend/controllers/adminAuthController.js - WITH DEBUG LOGS

const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // ✅ Import for debugging

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '1d'
  });
};

// @desc    Admin login
// @route   POST /api/admin/login
// @access  Public
exports.adminLogin = async (req, res) => {
  try {
    console.log("🔐 Admin login attempt:", req.body.email);

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    // Find admin
    const admin = await Admin.findOne({ email });

    if (!admin) {
      console.log("❌ Admin not found:", email);
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    console.log("✅ Admin found in DB:", {
      id: admin._id,
      email: admin.email,
      hashedPassword: admin.password ? "✅ Hashed" : "❌ Missing"
    });

    // ✅ METHOD 1: Using model method (recommended)
    try {
      const isMatch = await admin.comparePassword(password);
      console.log("🔍 Password match (method):", isMatch);
      
      if (!isMatch) {
        console.log("❌ Password mismatch for:", email);
        return res.status(401).json({
          success: false,
          message: "Invalid email or password"
        });
      }
    } catch (methodError) {
      console.error("❌ comparePassword method error:", methodError);
      
      // ✅ METHOD 2: Direct bcrypt compare (fallback)
      console.log("⚠️ Falling back to direct bcrypt compare");
      const isMatch = await bcrypt.compare(password, admin.password);
      console.log("🔍 Password match (direct):", isMatch);
      
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password"
        });
      }
    }

    // Generate token
    const token = generateToken(admin._id);

    console.log("✅ Admin login successful:", email);

    // ✅ Return token directly
    res.status(200).json({
      token,
      user: {
        id: admin._id,
        name: admin.name || 'Admin',
        email: admin.email,
        role: 'admin'
      }
    });

  } catch (error) {
    console.error("❌ Admin Login Error:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};