const mongoose = require("mongoose");
const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter a Product name"],
  },
  description: {
    type: String,
    required: [true, "Please enter a Product description"],
  },
  price: {
    type: Number,
    required: [true, "Please enter a Product price"],
    MaxLength: 8,
  },
  rating: {
    type: Number,
    default: 0,
  },
  images: [
    {
      publicId: {
        type: String,
        required: [true, "Please enter Image PublicId"],
      },
      url: [],
    },
  ],
  productCategory: {
    type: String,
    required: [true, "Please enter Product Category"],
    unique:false
  },
  stock: {
    type: Number,
    required: [true, "Please enter The Number of Product in Stock"],
  },
  NumOfReviews: {
    type: Number,
    default:0
  },
  reviews: [
    {
      Name: {
        type: String,
        required: [true, "please enter a review name"],
      },
      rating: {
        type: Number,
        required: [true, "please give us a rating from 1 to 5"],
      },
      comment: {
        type: String,
        required: [true, "please enter a review comment"],
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});
module.exports = mongoose.model("ProductSchema", ProductSchema);