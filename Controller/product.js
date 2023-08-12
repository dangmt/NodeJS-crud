const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Product = require("../Schema/product"); // Import your Product model
const { Console } = require("console");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads"); // Change this to your desired image storage location
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Create a product
router.post("/products", upload.single("image"), async (req, res) => {
  try {
    const { name, price } = req.body;
    const imagePath = req.file.filename;
    console.log(req.body);
    const product = new Product({
      name: name,
      price: price,
      image: imagePath,
    });

    await product.save();
    res.status(201).send("Product created successfully");
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).send("Internal server error");
  }
});

// Get all products
router.get("/products", async (req, res) => {
  console.log(req.body);

  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send("Internal server error");
  }
});
router.get("/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send("Product not found");
    }
    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).send("Internal server error");
  }
});

// Update a product
router.put("/products/:id", upload.single("image"), async (req, res) => {
  const { id } = req.params;
  try {
    const productToUpdate = await Product.findById(id);

    if (!productToUpdate) {
      return res.status(404).send("Product not found");
    }

    const { name, price } = req.body;
    const image = req.file;

    if (name) {
      productToUpdate.name = name;
    }
    if (price) {
      productToUpdate.price = price;
    }
    if (image) {
      const imagePath = image.filename;
      await fs.unlinkSync(path.join("uploads", productToUpdate.image)); // Delete old image
      productToUpdate.image = imagePath;
    }

    await productToUpdate.save();
    res.status(200).send("Product updated successfully");
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).send("Internal server error");
  }
});

// Delete a product
router.delete("/products/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const productToDelete = await Product.findById(id);

    if (!productToDelete) {
      return res.status(404).send("Product not found");
    }
    if (fs.existsSync(path.join("uploads", productToDelete.image))) {
      await fs.unlinkSync(path.join("uploads", productToDelete.image));
    } // Delete product image
    await productToDelete.deleteOne();
    res.status(200).send("Product deleted successfully");
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
