const mongoose = require("mongoose");

const DB_Connect = async () => {
  await mongoose.connect("mongodb://127.0.0.1:27017/Ecommerce");
  console.log("DataBase is Connected");
};
module.exports = { DB_Connect };