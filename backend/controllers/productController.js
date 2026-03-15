const Product = require("../models/Product");

// GET ALL PRODUCTS
exports.getProducts = async (req, res) => {
  try {

    const products = await Product.find();

    res.status(200).json(products);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }
};


// CREATE PRODUCT
exports.createProduct = async (req, res) => {

  try {

    const product = new Product({
      name: req.body.name,
      category: req.body.category,
      price: req.body.price,
      stock: req.body.stock,
      isActive: req.body.isActive
    });

    const savedProduct = await product.save();

    res.status(201).json(savedProduct);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};


// DELETE PRODUCT
exports.deleteProduct = async (req, res) => {

  try {

    await Product.findByIdAndDelete(req.params.id);

    res.json({ message: "Product deleted" });

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};