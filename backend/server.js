//imports
const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config({ path: "backend/config/config.env" });
const { DB_Connect } = require("./config/DBconfig");
const { ProductsRouter } = require("./Routes/product.Routes");
const UsersRouter = require("./Routes/User.Routes.js");
const cookieparser = require("cookie-parser");
const { errors } = require("./Middleware/err.js");
const OrderRouter = require("./Routes/Order.routes.js");
//end of imports
const app = express();


//handling uncaughterror
process.on("uncaughtException", (err) => {
  console.log(`Error:${err.message}`);
  console.log(`Shutting down the server due to Uncaught Exception`);
  process.exit(1);
});
//end of handling uncaughterror
//middlewares
DB_Connect();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieparser());
app.use("/api/v1/products", ProductsRouter);
app.use("/api/v1/user", UsersRouter);
app.use("/api/v1/orders",OrderRouter)
app.use(errors);


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
