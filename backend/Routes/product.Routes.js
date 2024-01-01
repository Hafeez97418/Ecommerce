const express = require("express");
const {
  CreateProduct,
  GetAllProducts,
  UpdateProduct,
  DeleteProduct,
  GetProductDetails,
} = require("../Controllers/Product");

const ProductsRouter = express.Router();

ProductsRouter.post("/new", CreateProduct);
ProductsRouter.get("/all", GetAllProducts);
ProductsRouter.put("/update/:id", UpdateProduct);
ProductsRouter.delete("/delete/:id", DeleteProduct);
ProductsRouter.get("/details/:id", GetProductDetails);
module.exports = { ProductsRouter };
