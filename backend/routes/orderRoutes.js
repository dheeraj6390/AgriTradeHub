const express = require("express");
const Order = require("../models/Order");
const Product = require("../models/Product");
const auth = require("../middleware/auth");

const router = express.Router();

// CREATE ORDER (Merchant)
 const transporter = require("../config/mailer");
const User = require("../models/User");

// CREATE ORDER
router.post("/", auth, async (req, res) => {
  try {
    if (req.user.role !== "merchant") {
      return res.status(403).json({ msg: "Only merchant allowed" });
    }

    const { productId, quantity } = req.body;

    const product = await Product.findById(productId).populate("farmer");
    if (!product) return res.status(404).json({ msg: "Product not found" });

    // SAVE ORDER
    const order = await Order.create({
      product: product._id,
      merchant: req.user.id,
      farmer: product.farmer._id,
      quantity: quantity || 1,
    });

    // 📧 SEND EMAIL TO FARMER
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: product.farmer.email,
      subject: "New Order Received 🌾",
      text: `
Hello ${product.farmer.name},

You have received a new order!

Product: ${product.name}
Price: ₹${product.price}
Quantity: ${quantity || 1}

Please login to AgriTradeHub to view details.

Thanks,
AgriTradeHub Team
      `,
    });

    res.json({ msg: "Order placed & email sent", order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


// MERCHANT ORDER HISTORY
router.get("/my", auth, async (req, res) => {
  if (req.user.role !== "merchant") {
    return res.status(403).json({ msg: "Only merchant allowed" });
  }

  const orders = await Order.find({ merchant: req.user.id })
    .populate("product")
    .sort({ createdAt: -1 });

  res.json(orders);
});

module.exports = router;
