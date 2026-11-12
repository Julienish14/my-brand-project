const multer = require("multer");

const errorHandler = (err, req, res, next) => {
  console.log("🚨 ERROR CAUGHT:", err.name, err.message);

  if (err.name === "ValidationError" && err.details && err.details.body) {
    return res.status(400).json({
      status: "fail",
      message: err.details.body[0].message,
    });
  }
};

module.exports = errorHandler;
