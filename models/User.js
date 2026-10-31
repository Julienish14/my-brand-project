const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  full_name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  bio: {
    type: String,
    maxlength: 500,
  },
  website: {
    type: String,
  },
  profileImage: {
    type: String,
    de,
  },
});

module.exports = mongoose.model("Users", UserSchema);
