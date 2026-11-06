const multer = require("multer");

const errorHandler = (err, req, res, next) => {
  console.log("🚨 ERROR CAUGHT:", err.name, err.message);

  if (err.name === "ValidationError" && err.details && err.details.body) {
    return res.status(400).json({
      status: "fail",
      message: err.details.body[0].message,
    });
  }

  if (err.details && Array.isArray(err.details) && err.details.length > 0) {
    return res.status(400).json({
      status: "fail",
      message: err.details[0].message,
    });
  }

  if (err.name === "ValidationError" && err.errors) {
    const messages = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({
      status: "fail",
      message: messages.join(", "),
    });
  }

  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      status: "fail",
      message: `Upload Error: ${err.message}`,
    });
  }

  console.error("💥 GLOBAL ERROR:", err);
  res.status(500).json({
    status: "error",
    message: "Something went wrong on the server.",
  });
};

module.exports = errorHandler;
