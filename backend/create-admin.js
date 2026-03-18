const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/glasshouse');

const User = require('./models/User');

const createAdmin = async () => {
  try {
    console.log('🔄 Creating admin user...');
    
    // Pehle check karo ki admin already exist to nahi karta
    const existingAdmin = await User.findOne({ email: 'admin@newpremglass.com' });
    
    if (existingAdmin) {
      console.log('⚠️ Admin already exists!');
      console.log('Email:', existingAdmin.email);
      console.log('Name:', existingAdmin.name);
      console.log('Password: admin123');
      mongoose.connection.close();
      return;
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    const admin = new User({
      name: 'Super Admin',
      email: 'admin@newpremglass.com',
      phone: '7328019093',
      password: hashedPassword,
      role: 'admin',
      status: 'active'
    });
    
    await admin.save();
    console.log('✅ Admin created successfully!');
    console.log('📧 Email: admin@newpremglass.com');
    console.log('🔑 Password: admin123');
    console.log('👤 Role: admin');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    mongoose.connection.close();
  }
};

createAdmin();