const express = require("express");
const { body } = require("express-validator");
const {
  Register,
  Login,
  Logout,
  ResetPassword,
  NewPassword,
  GetUserDetails,
  GetAllUsers,
  UpdateProfile,
  UpdateUserRole,
  DeleteUser,
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
)
  .post(
    "/login",
    [
      body("email", "Email is required").trim().isEmail(),
      body("password", "Password must be atleast 6 characters").isLength({
        min: 6,
      }),
    ],
    Login
  )
  .put("/updateprofile", checkLoggedIn, UpdateProfile)
  .put("/updaterole/:id", checkLoggedIn, checkAdmin, UpdateUserRole)
  .delete("/delete/:id", checkLoggedIn, checkAdmin, DeleteUser)
  .get("/logout", checkLoggedIn, Logout)
  .post("/resetpassword", ResetPassword)
  .post("/newpassword", NewPassword)
  .get("/getuserdetails/:id", checkLoggedIn, GetUserDetails)
  .get("/getallusers", checkLoggedIn, checkAdmin, GetAllUsers);
module.exports = UsersRouter;
