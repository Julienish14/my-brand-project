const Project = require("../models/Project");
const { uploadImage, deleteImage } = require("../utils/cloudinary");

const createProject = async (req, res) => {
  try {
    const { title, description, techStack, githubLink, liveLink } = req.body;

    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const imageUrl = await uploadImage(file);
        imageUrls.push(imageUrl);
      }
    }

    const parsedTechStack =
      typeof techStack === "string" ? techStack.split(",") : techStack;

    const newProject = await Project.create({
      title,
      description,
      techStack: parsedTechStack,
      githubLink,
      liveLink,
      projectImages: imageUrls,
    });

    res.status(201).json({
      message: "Project created successfully!",
      data: newProject,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Failed to create project", error: error.message });
  }
};
