const express = require("express");
const { body } = require("express-validator");
const {
  Register,
  Login,
  Logout,
  ResetPassword,
  NewPassword,
} = require("../Controllers/User");
const { checkLoggedIn, checkAdmin } = require("../Utils/Auth");

const UsersRouter = express.Router();
UsersRouter.post(
  "/new",
  [
    body("name", "Name must be atleast 3 characters").isLength({ min: 3 }),
    body("email", "Email is required").isEmail(),
    body("password", "Password must be atleast 6 characters").isLength({
      min: 6,
    }),
  ],
  Register
);
UsersRouter.post(
  "/login",
  [
    body("email", "Email is required").trim().isEmail(),
    body("password", "Password must be atleast 6 characters").isLength({
      min: 6,
    }),
  ],
  Login
);
UsersRouter.get("/logout", checkLoggedIn, Logout);
UsersRouter.post("/resetpassword", ResetPassword);
UsersRouter.post("/newpassword", NewPassword);
module.exports = UsersRouter;
