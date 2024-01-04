const express = require("express");
const { body } = require("express-validator");
const { checkLoggedIn, checkAdmin } = require("../Utils/Auth");
const {
  NewOrder,
  GetMyOrders,
  GetAllOrders,
  UpdateOrderStatus,
  DeleteOrder,
} = require("../Controllers/Order");
const OrderRouter = express.Router();
OrderRouter.post("/neworder/:id", checkLoggedIn, NewOrder)
  .get("/myorders", checkLoggedIn, GetMyOrders)
  .get("/getallorders", checkLoggedIn, checkAdmin, GetAllOrders)
  .put("/updateorderstatus/:id", checkLoggedIn, checkAdmin, UpdateOrderStatus)
  .delete("/cancelorder/:id",checkLoggedIn, DeleteOrder);

module.exports = OrderRouter;
