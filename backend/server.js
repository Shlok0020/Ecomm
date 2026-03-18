const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const path = require("path");

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Body parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`🚀 ${req.method} ${req.url}`);
  next();
});

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Make sure these are before your routes
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Import routes
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const orderRoutes = require("./routes/orderRoutes");
const userRoutes = require("./routes/userRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const settingsRoutes = require("./routes/settingsRoutes");

// Mount routes
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/settings", settingsRoutes);

// Health check route
app.get("/", (req, res) => {
  res.json({ 
    success: true, 
    message: "New Prem Glass House API Running",
    version: "1.0.0",
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: "/api/auth",
      admin: "/api/admin",
      products: "/api/products",
      orders: "/api/orders",
      users: "/api/users",
      dashboard: "/api/dashboard"
    }
  });
});

app.get("/api/health", (req, res) => {
  res.json({ 
    success: true, 
    status: "ok", 
    message: "Server is running",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: Object.values(err.errors).map(e => e.message)
    });
  }
  
  // Mongoose duplicate key error
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: 'Duplicate field value entered',
      field: Object.keys(err.keyPattern)[0]
    });
  }
  
  // JWT error
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
  
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.url}`
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log('\n' + '='.repeat(50));
  console.log(`✅ SERVER STARTED SUCCESSFULLY`);
  console.log('='.repeat(50));
  console.log(`📍 PORT: ${PORT}`);
  console.log(`📍 API URL: http://localhost:${PORT}/api`);
  console.log(`📍 Uploads URL: http://localhost:${PORT}/uploads`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('='.repeat(50) + '\n');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log('❌ UNHANDLED REJECTION! Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log('❌ UNCAUGHT EXCEPTION! Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});