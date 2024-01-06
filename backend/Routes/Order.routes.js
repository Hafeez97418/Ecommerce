const express = require("express");
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
  .put("/updateorderstatus/:id", checkLoggedIn, checkAdmin, UpdateOrderStatus)
  .delete("/cancelorder/:id", checkLoggedIn, DeleteOrder)
  .get("/myorders", checkLoggedIn, GetMyOrders)
  .get("/getallorders", checkLoggedIn, checkAdmin, GetAllOrders);

module.exports = OrderRouter;
