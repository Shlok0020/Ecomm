// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, admin } = require('../middleware/authMiddleware'); // ✅ FIXED IMPORT

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

// @desc    Get single user by ID
// @route   GET /api/users/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Update user
// @route   PUT /api/users/:id
router.put('/:id', protect, async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    
    // Check if user is updating their own profile or is admin
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, phone, address },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

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