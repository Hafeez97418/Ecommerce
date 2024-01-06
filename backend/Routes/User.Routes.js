const express = require("express");
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
const { validateInput } = require("../Middleware/validator");
const UsersRouter = express.Router();
UsersRouter.post("/new", Register)
  .post("/login", validateInput,Login)
  .post("/resetpassword", ResetPassword)
  .post("/newpassword", NewPassword)
  .put("/updateprofile", checkLoggedIn, UpdateProfile)
  .put("/updaterole/:id", checkLoggedIn, checkAdmin, UpdateUserRole)
  .get("/logout", checkLoggedIn, Logout)
  .get("/getuserdetails/:id", checkLoggedIn, GetUserDetails)
  .get("/getallusers", checkLoggedIn, checkAdmin, GetAllUsers)
  .delete("/delete/:id", checkLoggedIn, checkAdmin, DeleteUser);
module.exports = UsersRouter;
