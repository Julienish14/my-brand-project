const multer = require("multer");

const errorHandler = (err, req, res, next) => {
  console.log("🚨 ERROR CAUGHT:", err.name, err.message);

  // 1. Handle express-validation errors (This is what you are using!)
  // It throws an error with name 'ValidationError' and details.body as an array
  if (err.name === "ValidationError" && err.details && err.details.body) {
    return res.status(400).json({
      status: "fail",
      message: err.details.body[0].message, // Extract the custom Joi message
    });
  }
};

module.exports = errorHandler;
