// backend/routes/settingsRoutes.js
const express = require("express");
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');

// Get settings - protected route (requires login)
router.get("/", protect, admin, (req, res) => {
  console.log('📦 Settings fetched by:', req.user?.email);
  
  res.json({
    success: true,
    data: {
      general: {
        storeName: "New Prem Glass House",
        storeEmail: "admin@newpremglass.com",
        storePhone: "+91 73280 19093",
        address: "Bombay Chowk, Jharsuguda, Odisha - 768201",
        gst: "21ABCDE1234F1Z5",
        pan: "ABCDE1234F"
      },
      appearance: {
        theme: "light",
        primaryColor: "#c9a96e"
      },
      notifications: {
        emailAlerts: true,
        orderNotifications: true,
        lowStockAlerts: true,
        newCustomerAlerts: false
      },
      security: {
        twoFactorAuth: false,
        sessionTimeout: 30,
        passwordExpiry: 90
      }
    }
  });
});

// Update settings - protected route
router.put("/", protect, admin, (req, res) => {
  console.log('📝 Settings updated by:', req.user?.email);
  console.log('Update data:', req.body);
  
  res.json({
    success: true,
    message: "Settings updated successfully",
    data: req.body
  });
});

module.exports = router;