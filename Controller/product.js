const express = require("express");
const fs = require("fs");
const path = require("path");
const Product = require("../Schema/product"); // Assuming you have a Product model defined

const router = express.Router();

// Create a new product
router.post("/products", async (req, res) => {
  try {
    const { name, price } = req.body;
    const image = req.files && req.files.image;
    if (!image) {
      return res.status(400).send("Image is required");
    }

    const imagePath = saveImage(image);

    const product = new Product({
      name,
      price,
      image: imagePath,
    });

    await product.save();

    res.status(201).send("Product created successfully");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Get all products
router.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Update a product
router.put("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price } = req.body;
    const image = req.files && req.files.image;

    const productToUpdate = await Product.findById(id);

    if (!productToUpdate) {
      return res.status(404).send("Product not found");
    }

    if (name) {
      productToUpdate.name = name;
    }
    if (price) {
      productToUpdate.price = price;
    }
    if (image) {
      const imagePath = saveImage(image);
      deleteImage(productToUpdate.image);

      productToUpdate.image = imagePath;
    }

    await productToUpdate.save();

    res.status(200).send("Product updated successfully");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Delete a product
router.delete("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const productToDelete = await Product.findById(id);

    if (!productToDelete) {
      return res.status(404).send("Product not found");
    }

    deleteImage(productToDelete.image);
    await productToDelete.deleteOne();

    res.status(200).send("Product deleted successfully");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

function saveImage(image) {
  const imageName = Date.now() + "_" + image.name;
  const imagePath = path.join("uploads", imageName);
  const imageDir = path.dirname(imagePath);
  if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir, { recursive: true });
  }
  fs.writeFileSync(imagePath, image.data);

  return imageName;
}

function deleteImage(imagePath) {
  const oldImagePath = path.join("uploads", imagePath);
  if (fs.existsSync(oldImagePath)) {
    fs.unlinkSync(oldImagePath);
  }
}
router.post("/products/search", async (req, res) => {
  const {
    keyword = "",
    sort = "_id",
    order = "asc",
    page = 0,
    size = 10,
  } = req.body;

  const sortOptions = { [sort]: order === "asc" ? 1 : -1 };
  const skip = parseInt(page) * parseInt(size);
  const limit = parseInt(size);

  const query = keyword ? { name: { $regex: keyword, $options: "i" } } : {};

  try {
    const totalCount = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    res.json({
      items: products,
      page: parseInt(page),
      pageSize: parseInt(size),
      totalCount: totalCount,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});
module.exports = router;
