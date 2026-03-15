const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const Admin = require("./models/Admin");

mongoose.connect(process.env.MONGO_URI);

const createAdmin = async () => {
  try {

    const hashedPassword = await bcrypt.hash("admin123", 10);

    await Admin.create({
      email: "admin@newpremglass.com",
      password: hashedPassword
    });

    console.log("✅ Admin created successfully");

    process.exit();

  } catch (error) {
    console.log(error);
  }
};

createAdmin();