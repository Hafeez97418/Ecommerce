const HandleAsyncErrors = require("../Error/HandleAsyncErr");
const ErrorHandler = require("../Error/ErrorHandler");
const UserModel = require("../Models/UserModel");
const { GenrateToken } = require("../Utils/jsonwebtoken");
const bcrypt = require("bcrypt");
//register user
exports.Register = HandleAsyncErrors(async (req, res, next) => {
  const { name, email, password, avtar } = req.body;
  const HashedPassword = await bcrypt.hash(password, 10);
  const user = await UserModel.create({
    name,
    email,
    password: HashedPassword,
    avtar,
  });
  const token = GenrateToken(user._id);
  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + 60 * 60 * 1000),
  });
  res.status(201).json({
    success: true,
    message: "User created successfully",
  });
});
exports.Login = HandleAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });
  if (!user) {
    next(new ErrorHandler("User not found", 404, res));
  } else {
    const comparepassword = await bcrypt.compare(password, user.password);
    if (!comparepassword) {
      next(new ErrorHandler("Please enter correct Credentials", 404, res));
    } else {
      const token = GenrateToken(user._id);
      res.cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 60 * 60 * 1000),
      });
      res.status(200).json({
        success: true,
        message: "user has logged in",
      });
    }
  }
});

exports.Logout = HandleAsyncErrors(async (req, res, next) => { 
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.status(200).json({
    success: true,
    message: "user has logged out",
  });
})