const multer = require("multer");

const errorHandler = (err, req, res, next) => {
  if (err.isJoi) {
    return res.status(400).json({
      status: "fail",
      message: err.details[0].message,
    });
  }

  if (err.name === "ValidationError") {
    return res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }

  if (err.name === "CastError") {
    return res.status(400).json({
      status: "fail",
      message: `Invalid ${err.path}: ${err.value}`,
    });
  }

  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      status: "fail",
      message: `Upload Error: ${err.message}`,
    });
  }

  if (err.statusCode) {
    return res.status(err.statusCode).json({
      status: "fail",
      message: err.message,
    });
  }

  console.error("💥 GLOBAL ERROR:", err);
  res.status(500).json({
    status: "error",
    message: "Something went wrong on the server.",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
};

module.exports = errorHandler;
