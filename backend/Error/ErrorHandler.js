class ErrorHandler extends Error {
  constructor(message, statusCode, res) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
    res.status(statusCode).json({
      success: false,
      message: message,
    });
  }
}
module.exports = ErrorHandler;
