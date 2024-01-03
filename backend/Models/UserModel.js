const mongoose = require("mongoose");
const UserModel = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    MinLength: [3, "please enter your full name"],
    MaxLength: [30, "name cannot exceed 30 characters"],
  },
  email: {
    type: String,
    required: [true, "please enter an email"],
    unique: [true, "user already exists"],
  },
  password: {
    type: String,
    required: [true, "please enter your password"],
    MinLength: [5, "password should exceed 5 characters"],
  },
  avtar: {
    publicId: {
      type: String,
      required: [true, "Please enter Image PublicId"],
    },
    url: [],
  },
  role: {
    type: String,
    default: "user",
  },
  resetPasswordToken: {
    type: String,
    default: null,
  },
  resetPasswordExpire: {
    type: Date,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});
module.exports = mongoose.model("UserModel", UserModel);
