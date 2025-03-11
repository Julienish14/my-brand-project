const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies) {
      token = req.cookies.jwt;
    } else if (req.body.jwt) {
      token = req.body.jwt;
    }
    if (!token) {
      return res.status(401).json({
        status: "fail",
        message: "You are not logged in! Please log in to get access.",
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_KEY);

    const freshUser = await User.findById(decoded.userId);
    if (!freshUser) {
      return res.status(401).json({
        status: "fail",
        message: "The user belonging to this token no longer exists.",
      });
    }
    req.user = freshUser;

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        status: "fail",
        message: "Invalid token! Please log in again.",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        status: "fail",
        message: "Your token has expired! Please log in again.",
      });
    }

    console.log(error);
    return res.status(500).json({
      status: "error",
      message: "Something went wrong!",
    });
  }
};
