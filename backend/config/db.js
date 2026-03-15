const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Check if MongoDB URI exists
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      console.error('❌ MONGODB_URI is not defined in .env file');
      console.log('📝 Please create .env file with MONGODB_URI=mongodb://localhost:27017/glasshouse');
      process.exit(1);
    }

    const conn = await mongoose.connect(mongoURI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    console.log('📝 Make sure MongoDB is installed and running');
    console.log('📝 Or check your MONGODB_URI in .env file');
    process.exit(1);
  }
};

module.exports = connectDB;