const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect('mongodb://127.0.0.1:27017/glasshouse')
  .then(() => console.log('✅ MongoDB Connected'));

const User = require('./models/User');

const fixAdmin = async () => {
  try {
    // 1. Purane admin ko delete karo
    await User.deleteOne({ email: 'admin@newpremglass.com' });
    console.log('✅ Old admin deleted');

    // 2. Naya admin banao - DIRECT password do (model hash kar lega)
    const admin = new User({
      name: 'Super Admin',
      email: 'admin@newpremglass.com',
      phone: '7328019093',
      password: 'admin123',  // 👈 SIRF PLAIN TEXT - model hash karega
      role: 'admin'
    });

    await admin.save();
    console.log('✅ New admin created');

    // 3. Verify karo
    const saved = await User.findOne({ email: 'admin@newpremglass.com' });
    console.log('\n📦 Admin details:');
    console.log('   Email:', saved.email);
    console.log('   Role:', saved.role);
    console.log('   Password hash:', saved.password);

    // 4. Password test karo
    const isMatch = await saved.comparePassword('admin123');
    console.log('\n🔐 Password test:', isMatch ? '✅ MATCH' : '❌ MISMATCH');

  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    mongoose.connection.close();
  }
};

fixAdmin();