const ErrorHandler = require("./ErrorHandler.js");
const HandleAsyncErrors = (func) => {
  return (req, res, next) => {
    func(req, res, next).catch((err) => {
      return next(new ErrorHandler(err.message, 500, res));
    });
  };
};
module.exports = HandleAsyncErrors;
