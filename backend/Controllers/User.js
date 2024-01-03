const HandleAsyncErrors = require("../Error/HandleAsyncErr");
const ErrorHandler = require("../Error/ErrorHandler");
const UserModel = require("../Models/UserModel");
const { GenrateToken } = require("../Utils/jsonwebtoken");
const bcrypt = require("bcrypt");
const { sendEmail } = require("../Utils/SendMail");
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
});

exports.ResetPassword = HandleAsyncErrors(async (req, res, next) => {
  const { email } = req.body;
  const user = await UserModel.findOne({ email });
  if (!user) {
    next(new ErrorHandler("Invalid credentials", 404, res));
  } else {
    const otp = Math.floor(Math.random() * 10000 + 1);
    const data = {
      otp,
      email,
    };
    res.cookie("otp", data, {
      httpOnly: true,
      expires: new Date(Date.now() + 60 * 60 * 1000),
    });
    const info = await sendEmail(
      email,
      "OTP from ecommerce",
      `<b>Your OTP for resetting <br> your password is :${otp}</b> <br>
<h2>click on this link to change your password</h2><br><a href="${
        req.protocol
      }://${req.get("host")}:${process.env.PORT}/api/v1/user/newpassword">
http://localhost:4000
</a> `
    );
    if (!info) {
      next(new ErrorHandler("Email not sent somthing went wrong", 404, res));
    } else {
      res.status(200).json({
        success: true,
        message: "OTP has been sent to your email",
      });
    }
  }
});
exports.NewPassword = HandleAsyncErrors(async (req, res, next) => {
  const { password, otp } = req.body;
  if (!req.cookies.otp) {
    next(new ErrorHandler("Invalid OTP", 404, res));
  } else if (otp != req.cookies.otp.otp) {
    next(new ErrorHandler("Invalid OTP", 404, res));
  } else {
    const HashedPassword = await bcrypt.hash(password, 10);
    const user = await UserModel.updateOne(
      { email: req.cookies.otp.email },
      { password: HashedPassword }
    );
    if (!user) {
      next(new ErrorHandler("Invalid credentials", 404, res));
    } else {
      res.cookie("otp", null, {
        httpOnly: true,
        expires: new Date(Date.now()),
      });
      res.status(200).json({
        success: true,
        message: "Password has been changed successfully",
      });
    }
  }
});
