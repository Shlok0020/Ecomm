//backend/config/db.js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    
    // Check if MONGO_URI exists
    if (!process.env.MONGO_URI) {
      throw new Error('❌ MONGO_URI is not defined in .env file');
    }

    console.log('📦 MongoDB URI:', process.env.MONGO_URI);
    
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`🕒 Connected at: ${new Date().toLocaleTimeString()}`);
    
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    console.error('\n🔍 Please check:');
    console.error('   1. MongoDB is running:');
    console.error('      - Open PowerShell as Admin');
    console.error('      - Run: net start MongoDB');
    console.error('   2. .env file has correct MONGO_URI:');
    console.error('      - Should be: mongodb://127.0.0.1:27017/glasshouse');
    console.error('   3. MongoDB is installed:');
    console.error('      - Run: mongod --version');
    console.error('   4. If not installed, download from:');
    console.error('      - https://www.mongodb.com/try/download/community\n');
    
    process.exit(1);
  }
};

module.exports = connectDB;