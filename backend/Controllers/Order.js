const HandleAsyncErrors = require("../Error/HandleAsyncErr");
const ErrorHandler = require("../Error/ErrorHandler");
const { VerifyToken } = require("../Utils/jsonwebtoken");
const ProductModel = require("../Models/ProductModel");
const OrderModel = require("../Models/OrderModel");

//creating an order
exports.NewOrder = HandleAsyncErrors(async (req, res, next) => {
  const user = VerifyToken(req.cookies.token);
  let expected = 7 * 24 * 60 * 60 * 1000;
  const date = new Date();
  const product = await ProductModel.findById(req.params.id);
  if (!product || !user) {
    next(new ErrorHandler("product not found please login and try again", 400));
  } else {
    date.setMilliseconds(date.getMilliseconds() + expected);
    const OrderObject = {
      customer: user.id,
      product: product._id,
      quantity: req.body.quantity,
      price: product.price,
      totalAmount: product.price * req.body.quantity,
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
      deliverdAt: date,
    };
    const order = await OrderModel.create(OrderObject);
    product.stock = product.stock - req.body.quantity;
    await product.save();
    if (!order) {
      next(
        new ErrorHandler(
          "opps someting went wrong please login and try again",
          500
        )
      );
    } else {
      res.status(200).json({
        success: true,
        message: "your order has been placed",
      });
    }
  }
});

//getting my orders
exports.GetMyOrders = HandleAsyncErrors(async (req, res, next) => {
  const user = VerifyToken(req.cookies.token);
  const order = await OrderModel.find({ customer: user.id });
  if (!order) {
    next(new ErrorHandler("order not found", 404));
  } else {
    res.status(200).json({
      success: true,
      orders: order,
    });
  }
});
//get all orders --admin
exports.GetAllOrders = HandleAsyncErrors(async (req, res, next) => {
  const { status } = req.query;
  if (!status || status == "") {
    order = await OrderModel.find();
  } else {
    order = await OrderModel.find({ status: status });
  }
  if (!order) {
    next(new ErrorHandler("order not found", 404));
  } else {
    res.status(200).json({
      success: true,
      orders: order,
    });
  }
});
//updating order status --admin
exports.UpdateOrderStatus = HandleAsyncErrors(async (req, res, next) => {
  const { status } = req.body;
  let checkStatus = false;
  const statusOption = ["pending", "processing", "shipped", "delivered"];
  for (let i of statusOption) {
    if (status == i) {
      checkStatus = true;
      break;
    }
  }
  if (checkStatus === false) {
    next(new ErrorHandler("Invalid status", 400));
  } else {
    const order = await OrderModel.findByIdAndUpdate(
      req.params.id,
      {
        status: status,
      },
      { runValidators: true }
    );
    if (!order) {
      next(
        new ErrorHandler("something went wrong please login and try again", 404)
      );
    } else {
      res.status(200).json({
        success: true,
        message: "order status changed",
      });
    }
  }
});
//cancel order
exports.DeleteOrder = HandleAsyncErrors(async (req, res, next) => {
  const order = await OrderModel.findByIdAndDelete(req.params.id);
  if (!order) {
    next(
      new ErrorHandler("something went wrong please login and try again", 404)
    );
  } else {
    const product = await ProductModel.findById(order.product);
    product.stock = product.stock + order.quantity;
    await product.save();
    res.status(200).json({
      success: true,
      message: "order has been deleted",
    });
  }
});
