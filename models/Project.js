const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "A project must have a title"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "A project must have a description"],
    },
    techStack: {
      type: [String],
      required: true,
    },
    githubLink: {
      type: String,
    },
    liveLink: {
      type: String,
    },
    projectImages: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Project", projectSchema);
