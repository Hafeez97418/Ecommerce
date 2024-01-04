const express = require("express");
const { body } = require("express-validator");
const {
  CreateProduct,
  GetAllProducts,
  UpdateProduct,
  DeleteProduct,
  GetProductDetails,
  CreateProductReviews,
  GetProductReviews,
  DeleteProductReviews,
} = require("../Controllers/Product");
const { checkLoggedIn, checkAdmin } = require("../Utils/Auth");

const ProductsRouter = express.Router();

ProductsRouter.post(
  "/new",
  checkLoggedIn,
  checkAdmin,
  [
    body("name", "please enter a product name").notEmpty(),
    body(
      "description",
      "minimum characters for description must be 5"
    ).isLength({ min: 5 }),
    body("price", "please enter the price of the product").notEmpty(),
    body("productCategory", "Please enter Product Category").notEmpty(),
    body("stock", "Please enter The Number of Product in Stock").notEmpty(),
  ],
  CreateProduct
)
  .get("/all", GetAllProducts)
  .put("/update/:id", checkLoggedIn, checkAdmin, UpdateProduct)
  .delete("/delete/:id", checkLoggedIn, checkAdmin, DeleteProduct)
  .get("/details/:id", GetProductDetails)
  .put(
    "/review/:id",
    checkLoggedIn,
    [
      body("rating", "please enter your correct rating").notEmpty().isNumeric(),
      body("comment", "please enter the comment for your rating").notEmpty(),
    ],
    CreateProductReviews
  )
  .get("/getreviews/:id", GetProductReviews)
  .delete("/deletereview/:id", checkLoggedIn, DeleteProductReviews);
module.exports = { ProductsRouter };
