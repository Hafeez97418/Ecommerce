const ErrorHandler = require("./ErrorHandler");

const HandleAsyncErrors = (theFunc) => (req, res, next) => {
  Promise.resolve(theFunc(req, res, next)).catch((err) => {
    if (err.name === "CastError") {
      const message = `Resource not found. Invalid: ${err.path}`;
      next(new ErrorHandler(message, 400));
    } else if (err.code === 11000) {
      const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
      next(new ErrorHandler(message, 400));
    } else if (err.name === "ValidationError") {
      next(new ErrorHandler(err.message, 400));
    } else {
      next(new ErrorHandler(err.message, 500));
    }
  });
};

module.exports = HandleAsyncErrors;
