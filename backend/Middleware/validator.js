const validator = require("validator");
const ErrorHandler = require("../Error/ErrorHandler");
const check = (conditions, next, message, statusCode) => {
  if (conditions === true) {
    next();
  } else {
    next(new ErrorHandler(message, statusCode));
  }
};
exports.validateInput = (req, res, next) => {
  switch (req.route.path) {
    case "/login":
      check(
        validator.isEmail(req.body.email) &&
          !validator.isEmpty(req.body.password),
        next,
        "invalid credentials",
        400
      );
      break;
  }
};
