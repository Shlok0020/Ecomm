// backend/controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {
  sendNewRegistrationNotification,
  sendWelcomeEmail
} = require('../utils/notificationService');

// Generate JWT Token
const generateToken = (userId, role) => {
  return jwt.sign(
    { 
      id: userId,
      role: role 
    }, 
    process.env.JWT_SECRET || 'your-secret-key', 
    {
      expiresIn: '30d'
    }
  );
};

// @desc    Register a new user
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    console.log('📝 Register request received:', req.body);
    
    const { name, email, password, phone, address } = req.body;

    // Validation
    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone,
      address: address || {}
    });

    // Generate token with role
    const token = generateToken(user._id, user.role);

    // 🚀 Send notifications in background (don't await)
    Promise.allSettled([
      // Notify admin about new registration
      sendNewRegistrationNotification({
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt
      }),
      // Send welcome email to new user
      sendWelcomeEmail({
        name: user.name,
        email: user.email,
        role: user.role
      })
    ]).then(results => {
      console.log('📧 Registration notifications sent:', 
        results.map(r => r.status));
    }).catch(err => {
      console.error('❌ Some notifications failed:', err);
    });

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        token
      }
    });

  } catch (error) {
    console.error('❌ Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering user',
      error: error.message
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    console.log('🔐 Login request received for email:', req.body.email);
    
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    console.log('✅ User found:', user.email, 'Role:', user.role);

    // Check password using bcrypt directly for debugging
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('🔍 Password match (bcrypt):', isMatch);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate token with role
    const token = generateToken(user._id, user.role);

    console.log('✅ Login successful for:', user.email);

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        token
      }
    });

  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error.message
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('❌ Profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message
    });
  }
};

// Export all functions
module.exports = {
  registerUser,
  loginUser,
  getProfile
};