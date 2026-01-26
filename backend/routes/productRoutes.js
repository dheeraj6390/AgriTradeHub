const express = require("express");
const Product = require("../models/product");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
const cloudinary = require("../config/cloudinary");

const router = express.Router(); // 🔴 THIS WAS MISSING

// GET ALL PRODUCTS (merchant)
router.get("/", async (req, res) => {
  const products = await Product.find().populate("farmer", "name");
  res.json(products);
});

// GET MY PRODUCTS (farmer)
router.get("/mine", auth, async (req, res) => {
  if (req.user.role !== "farmer") {
    return res.status(403).json({ msg: "Only farmer allowed" });
  }

  const products = await Product.find({ farmer: req.user.id });
  res.json(products);
});

// ADD PRODUCT
 router.post("/", auth, upload.single("image"), async (req, res) => {
  try {
    if (req.user.role !== "farmer") {
      return res.status(403).json({ msg: "Only farmer allowed" });
    }

    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: "agritrade_products",
    });

    const product = await Product.create({
      name: req.body.name,
      price: req.body.price,
      image: uploadResult.secure_url,

      quality: req.body.quality,
      farmerName: req.body.farmerName,
      contact: req.body.contact,
      area: req.body.area,
      district: req.body.district,
      state: req.body.state,

      farmer: req.user.id,
    });

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// DELETE PRODUCT
router.delete("/:id", auth, async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) return res.status(404).json({ msg: "Not found" });

  if (product.farmer.toString() !== req.user.id) {
    return res.status(403).json({ msg: "Not allowed" });
  }

  await product.deleteOne();
  res.json({ msg: "Deleted" });
});

module.exports = router;
