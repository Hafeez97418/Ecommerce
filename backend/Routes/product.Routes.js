const express = require("express");
const {
  CreateProduct,
  GetAllProducts,
  UpdateProduct,
  DeleteProduct,
  GetProductDetails,
  CreateProductReviews,
  GetProductReviews,
  DeleteProductReviews,
  InformProductCancelation,
} = require("../Controllers/Product");
const { checkLoggedIn, checkAdmin } = require("../Utils/Auth");

const ProductsRouter = express.Router();

ProductsRouter.get("/all", GetAllProducts)
  .get("/getreviews/:id", GetProductReviews)
  .get("/details/:id", GetProductDetails)
  .post("/new", checkLoggedIn, checkAdmin, CreateProduct)
  .put("/update/:id", checkLoggedIn, checkAdmin, UpdateProduct)
  .put("/review/:id", checkLoggedIn, CreateProductReviews)
  .delete("/delete/:id", checkLoggedIn, checkAdmin, DeleteProduct)
  .delete("/deletereview/:id", checkLoggedIn, DeleteProductReviews)
  .delete(
    "/informproductcancelation/:id",
    checkLoggedIn,
    checkAdmin,
    InformProductCancelation
  );
module.exports = { ProductsRouter };
