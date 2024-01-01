//imports
const express = require("express");
const app = express();
require("dotenv").config({ path: "backend/config/config.env" });
const { DB_Connect } = require("./config/DBconfig");
const { ProductsRouter } = require("./Routes/product.Routes");
const { err } = require("./middleware/err.js");
//end of imorts
//handling uncaughterror
process.on("uncaughtException", (err) => {
  console.log(`Error:${err.message}`);
  console.log(`Shutting down the server due to Uncaught Exception`);
  process.exit(1);
});
//end of handling uncaughterror
//middlewares
app.use(express.json());
DB_Connect();
app.use(err);
app.use("/api/v1/products", ProductsRouter);

//end of middlewares

app.listen(process.env.PORT, () => {
  console.log(`your app is listened on http://localhost:${process.env.PORT}`);
});

//handling unHandledPromiceRejection
process.on("unhandledRejection", (err) => {
  console.log(`Error:${err.message}`);
  console.log(`Shutting down the server due to Unhandled Promise Rejection`);
  server.close(() => {
    process.exit(1);
  });
});
//end of handling unHandledPromiceRejection
