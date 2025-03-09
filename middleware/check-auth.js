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

    const decoded = jwt.verify(token, process.env.JWT_KEY);

    const freshUser = await User.findById(decoded.userId);
    req.user = freshUser;
    console.log(freshUser);

    // if (!freshUser) {
    //   return res.status(401).json({
    //     status: "fail",
    //     message: "login first!",
    //   });
    // }
    next();
  } catch (error) {
    console.log(error);
  }
};
