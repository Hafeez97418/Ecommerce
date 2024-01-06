const HandleAsyncErrors = require("../Error/HandleAsyncErr");
const ErrorHandler = require("../Error/ErrorHandler");
const ProductModel = require("../Models/ProductModel");
const Apifeatures = require("../Utils/features");

const { VerifyToken } = require("../Utils/jsonwebtoken");
const UserModel = require("../Models/UserModel");
const OrderModel = require("../Models/OrderModel");
const { sendEmail } = require("../Utils/SendMail");
// createing the product --Admin

exports.CreateProduct = HandleAsyncErrors(async (req, res, next) => {
  const verify = VerifyToken(req.cookies.token);
  const object = {
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    rating: req.body.rating,
    images: req.body.images,
    productCategory: req.body.productCategory,
    stock: req.body.stock,
    NumOfReviews: req.body.NumOfReviews,
    reviews: req.body.reviews,
  };
  req.body.reviews.forEach((review) => {
    review.id = verify.id;
  });

  const product = await ProductModel.create(object);
  res.status(200).json({
    success: true,
    product,
  });
});
//getting all products
exports.GetAllProducts = HandleAsyncErrors(async (req, res, next) => {
  const model = ProductModel;
  const resultPerPage = 5;
  const products = new Apifeatures(model.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);
  let product = await products.query;
  res.status(200).json({
    success: true,
    product,
  });
});
//updating product details --admin
exports.UpdateProduct = HandleAsyncErrors(async (req, res, next) => {
  const { name, description, price, images, productCategory, stock } = req.body;
  const product = await ProductModel.findByIdAndUpdate(
    req.params.id,
    {
      name,
      description,
      price,
      images,
      productCategory,
      stock,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  res.status(200).json({
    success: true,
    product,
  });
});
//deleteing existing product --admin
exports.DeleteProduct = HandleAsyncErrors(async (req, res, next) => {
  const order = await OrderModel.find({ product: req.params.id });
  if (order.length == 0) {
    const product = await ProductModel.findByIdAndDelete(req.params.id);
    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }
    res.status(200).json({
      success: true,
      message: "product deleted successfully",
    });
  } else {
    return next(new ErrorHandler("customers has orderd this product", 400));
  }
});
exports.InformProductCancelation = HandleAsyncErrors(async (req, res, next) => {
  const order = await OrderModel.find({ product: req.params.id });

  if (order.length == 0) {
    next(new ErrorHandler("orders not placed for this product", 404));
  } else {
    let ids = order.map((o) => {
      return o.customer;
    });
    let user = await UserModel.find({ _id: { $in: ids } });
    let emails = user.map((u) => {
      return u.email;
    });
    emails = emails.toString();
    emails = emails.replace(/\[|\]/g, "");
    const product = await ProductModel.findById(req.params.id);
    const del = await OrderModel.deleteMany({ product: req.params.id });
    await sendEmail(
      emails,
      "Ecommerce",
      `
    <h2>your order has canceled due to some technical issue</h2>
    <p>you have placed an order ${product.name} of 
    price: ${product.price} was canceled due to some technical issue </p>
    `
    );
    res.status(200).json({
      success: true,
      message:
        "orders for this product has been deleted and information is sendend to users",
    });
  }
});
//getting a single product details
exports.GetProductDetails = HandleAsyncErrors(async (req, res, next) => {
  const product = await ProductModel.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  res.status(200).json({
    success: true,
    product,
  });
});

//creating a product reviews
exports.CreateProductReviews = HandleAsyncErrors(async (req, res, next) => {
  const verify = VerifyToken(req.cookies.token);
  const { rating, comment } = req.body;
  const token = VerifyToken(req.cookies.token);
  const product = await ProductModel.findById(req.params.id);
  const user = await UserModel.findById(token.id);
  if (!product) {
    next(new ErrorHandler("product not found", 404));
  } else if (rating < 0 || rating > 5) {
    next(new ErrorHandler("rating must be from 0 to 5"));
  } else {
    const review = {
      Name: user.name,
      rating,
      comment,
      id: verify.id,
    };
    product.reviews.push(review);
    product.NumOfReviews += 1;
    let rat = 0;
    product.reviews.map((review) => {
      return (rat += review.rating);
    });
    product.rating = rat / product.NumOfReviews;
    await product.save();
    res.status(200).json({
      success: true,
      message: "Review has sended",
    });
  }
});
//getting product reviews
exports.GetProductReviews = HandleAsyncErrors(async (req, res, next) => {
  const product = await ProductModel.findById(req.params.id);
  if (!product) {
    next(new ErrorHandler("product not found", 404));
  } else {
    res.status(200).json({
      success: true,
      reviews: product.reviews,
    });
  }
});
//deleteing product reviews
exports.DeleteProductReviews = HandleAsyncErrors(async (req, res, next) => {
  const verify = VerifyToken(req.cookies.token);
  const product = await ProductModel.findById(req.params.id);
  if (!product) {
    next(new ErrorHandler("product not found", 404));
  } else {
    product.reviews = product.reviews.filter((review) => {
      review.id.toString() !== verify.id.toString();
      product.NumOfReviews = product.NumOfReviews - 1;
    });
    let rat = 0;
    product.reviews.map((review) => {
      return (rat += review.rating);
    });
    let value = rat / product.NumOfReviews;
    value = isNaN(value) == true ? 0 : value;
    product.rating = value;
    await product.save();
    res.status(200).json({
      success: true,
      message: "Review has deleted",
    });
  }
});
