const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { ref } = require("joi");
const { uploadImage, deleteImage } = require("../utils/cloudinary");

const signUp = async (req, res, next) => {
  try {
    const { full_name, email, password, bio, location, website } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: "Email already Exist" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let imageUrl = "";
    if (req.file) {
      imageUrl = await uploadImage(req.file);
    }
    // 4. Create User
    const newUser = new User({
      full_name,
      email: email.toLowerCase(),
      password: hashedPassword,
      bio,
      location,
      website,
      profileImage: imageUrl,
    });

    await newUser.save();

    const userResponse = newUser.toObject();
    delete userResponse.password;

    res.status(201).json({
      message: "User Created Successfully!",
      data: { user: userResponse },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(401).json({
        message: "You have no account! Please SignUp",
      });
    }

    bcrypt.compare(req.body.password, user.password, (err, result) => {
      if (err || !result) {
        return res.status(401).json({
          message: "Invalid email or password",
        });
      }

      const token = jwt.sign(
        {
          full_name: user.full_name,
          email: user.email,
          userId: user._id,
          isAdmin: user.isAdmin,
        },
        process.env.JWT_KEY,
        { expiresIn: "24h" },
      );

      const cookieOptions = {
        expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        secure: false,
        httpOnly: true,
      };

      res.cookie("jwt", token, cookieOptions);

      return res.status(200).json({
        message: "logged in successfully!",
        token,
        user,
      });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      message: "All Users accounts",
      users,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: "Fail to get users",
    });
  }
};

const getSpecificUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    res.status(200).json({
      message: "Selected User",
      user,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: "Fail to get all users",
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let updateData = {
      full_name: req.body.full_name || user.full_name,
      email: req.body.email ? req.body.email.toLowerCase() : user.email,
      bio: req.body.bio !== undefined ? req.body.bio : user.bio,
      location:
        req.body.location !== undefined ? req.body.location : user.location,
      website: req.body.website !== undefined ? req.body.website : user.website,
    };

    if (req.body.password) {
      updateData.password = await bcrypt.hash(req.body.password, 10);
    }

    if (req.file) {
      if (user.profileImage) {
        await deleteImage(user.profileImage);
      }
      updateData.profileImage = await uploadImage(req.file);
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { $set: updateData },
      { new: true, runValidators: true },
    ).select("-password");

    return res.status(200).json({
      message: "User profile updated successfully!",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "fail",
      message: "Failed to update user",
      error: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const deleteUser = await User.deleteMany({
      _id: req.params.userId,
    });
    return res.status(200).json({
      message: "User deleted!",
      deleteUser,
    });
  } catch (err) {
    return res.status(404).json({
      status: "fail",
      message: "user Not found",
    });
  }
};

const logout = async (req, res, next) => {
  try {
    res.clearCookie("jwt");
    res.status(200).json({
      message: "You logged Out successfully!",
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  signUp,
  login,
  getAllUsers,
  getSpecificUser,
  updateUser,
  deleteUser,
  logout,
};
