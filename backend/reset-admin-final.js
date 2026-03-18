// backend/reset-admin-final.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function resetAdmin() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/glasshouse');
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    const users = db.collection('users');

    // Admin credentials
    const adminEmail = 'admin@newpremglass.com';
    const adminPassword = 'admin123';

    // Delete existing admin
    await users.deleteMany({ email: adminEmail });
    console.log('🗑️ Deleted existing admin');

    // Create hash
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    // Create admin
    const admin = {
      name: 'Super Admin',
      email: adminEmail,
      phone: '7328019093',
      password: hashedPassword,
      role: 'admin',
      isActive: true,
      addresses: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await users.insertOne(admin);
    console.log('✅ Admin created successfully');

    // Verify
    const savedAdmin = await users.findOne({ email: adminEmail });
    const verifyMatch = await bcrypt.compare(adminPassword, savedAdmin.password);
    
    console.log('\n📧 Email:', adminEmail);
    console.log('🔑 Password:', adminPassword);
    console.log('🔐 Password verification:', verifyMatch ? '✅ WORKS' : '❌ FAILED');
    console.log('🔐 Stored hash:', savedAdmin.password);

    await mongoose.connection.close();

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

resetAdmin();