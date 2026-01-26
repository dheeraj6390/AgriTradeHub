const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: String,
    price: Number,
    image: String,

    // Farmer details
    quality: String,
    farmerName: String,
    contact: String,
    area: String,
    district: String,
    state: String,

    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

 
module.exports =
  mongoose.models.Product ||
  mongoose.model("Product", productSchema);
