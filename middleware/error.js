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
  // 2. Handle standard Joi errors (if validated directly inside the controller)
  if (err.details && Array.isArray(err.details) && err.details.length > 0) {
    return res.status(400).json({
      status: "fail",
      message: err.details[0].message,
    });
  }

  // 3. Handle Mongoose Validation Errors
  if (err.name === "ValidationError" && err.errors) {
    const messages = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({
      status: "fail",
      message: messages.join(", "),
    });
  }

  // 4. Handle Multer Errors (File uploads)
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      status: "fail",
      message: `Upload Error: ${err.message}`,
    });
  }

  // 5. Fallback for any other unhandled errors
  console.error("💥 GLOBAL ERROR:", err);
  res.status(500).json({
    status: "error",
    message: "Something went wrong on the server.",
  });
};

module.exports = errorHandler;
