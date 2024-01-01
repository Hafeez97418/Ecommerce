const HandleAsyncErrors = require("../Error/HandleAsyncErr");
const ErrorHandler = require("../Error/ErrorHandler");
const ProductModel = require("../Models/ProductModel");
const Apifeatures = require("../Utils/features");
// createing the product --Admin
exports.CreateProduct = HandleAsyncErrors(async (req, res, next) => {
  const product = await ProductModel.create({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    rating: req.body.rating,
    images: req.body.images,
    productCategory: req.body.category,
    stock: req.body.stock,
    NumOfReviews: req.body.NumOfReviews,
    reviews: req.body.reviews,
  });
  res.status(200).json({
    success: true,
    product,
  });
});

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
exports.UpdateProduct = HandleAsyncErrors(async (req, res, next) => {
  const product = await ProductModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!product) {
    return next(new ErrorHandler("Product not found", 404, res));
  }
  res.status(200).json({
    success: true,
    product,
  });
});
exports.DeleteProduct = HandleAsyncErrors(async (req, res, next) => {
  const product = await ProductModel.findByIdAndDelete(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404, res));
  }
  res.status(200).json({
    success: true,
    product,
  });
});
exports.GetProductDetails = HandleAsyncErrors(async (req, res, next) => {
  const product = await ProductModel.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404, res));
  }
  res.status(200).json({
    success: true,
    product,
  });
});
