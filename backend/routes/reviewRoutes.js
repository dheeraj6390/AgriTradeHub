const express = require("express");
const Review = require("../models/review");
const auth = require("../middleware/auth");

const router = express.Router();

// ADD REVIEW (Merchant)
router.post("/", auth, async (req, res) => {
  try {
    if (req.user.role !== "merchant") {
      return res.status(403).json({ msg: "Only merchant allowed" });
    }

    const { productId, rating, comment } = req.body;

    const review = await Review.create({
      product: productId,
      merchant: req.user.id,
      rating,
      comment,
    });

    res.json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET REVIEWS OF PRODUCT
router.get("/:productId", async (req, res) => {
  const reviews = await Review.find({
    product: req.params.productId,
  }).populate("merchant", "name");

  res.json(reviews);
});

module.exports = router;
