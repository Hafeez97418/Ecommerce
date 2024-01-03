const ErrorHandler = require("../Error/ErrorHandler");
const HandleAsyncErrors = require("../Error/HandleAsyncErr");
const UserModel = require("../Models/UserModel");
const jwt = require("jsonwebtoken");

exports.checkLoggedIn = HandleAsyncErrors(async (req, res, next) => {
  if (!req.cookies.token) {
    next(new ErrorHandler("please login to access this resource", 400));
  } else {
    const verify = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
    const user = await UserModel.findById(verify.id);
    if (!user) {
      next(new ErrorHandler("user not found", 400));
    } else {
      next();
    }
  }
});
exports.checkAdmin = HandleAsyncErrors(async (req, res, next) => {
  const verify = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
  const user = await UserModel.findById(verify.id);
  if (!user) {
    next(new ErrorHandler("user not found", 400));
  } else if (user.role != "admin") {
    next(
      new ErrorHandler("you are not authorized to access this resource", 400)
    );
  } else {
    next();
  }
});
