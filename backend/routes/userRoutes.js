// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, admin } = require('../middleware/authMiddleware');
const {
  getProfile,
  getUserById,
  updateUser,
  getUserOrders
} = require('../controllers/userController');

// @desc    Get user profile (logged in user)
// @route   GET /api/users/profile
router.get('/profile', protect, getProfile);

// @desc    Get all users (admin only)
// @route   GET /api/users
router.get('/', protect, admin, async (req, res) => {
  try {
    console.log('👤 Admin fetching users:', req.user.email);
    const users = await User.find().select('-password');
    res.json({ success: true, data: users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get user orders
// @route   GET /api/users/:id/orders
router.get('/:id/orders', protect, getUserOrders);

// @desc    Get single user by ID
// @route   GET /api/users/:id
router.get('/:id', protect, getUserById);

// @desc    Update user
// @route   PUT /api/users/:id
router.put('/:id', protect, updateUser);

// @desc    Update user status (admin only)
// @route   PATCH /api/users/:id/status
router.patch('/:id/status', protect, admin, async (req, res) => {
  try {
    const { status } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Update user role (admin only)
// @route   PATCH /api/users/:id/role
router.patch('/:id/role', protect, admin, async (req, res) => {
  try {
    const { role } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Ban user (admin only)
// @route   POST /api/users/:id/ban
router.post('/:id/ban', protect, admin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: 'banned' },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    console.error('Error banning user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Delete user (admin only)
// @route   DELETE /api/users/:id
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;