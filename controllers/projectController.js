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

const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.status(200).json({
      message: "All projects retrieved successfully",
      results: projects.length,
      data: projects,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get projects", error: error.message });
  }
};

const getOneProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json({
      message: "Project retrieved successfully",
      data: project,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get project", error: error.message });
  }
};

// const updateProject = async (req, res) => {
//   try {
//     const project = await Project.findById(req.params.projectId);
//     if (!project) {
//       return res.status(404).json({ message: "Project not found" });
//     }

//     let updateData = { ...req.body };

//     if (updateData.techStack) {
//       updateData.techStack = updateData.techStack.split(",");
//     }

//     let finalImages = project.projectImages;

//     if (req.body.imagesToKeep !== undefined) {
//       let imagesToKeep = req.body.imagesToKeep;
//       if (typeof imagesToKeep === "string") {
//         imagesToKeep = JSON.parse(imagesToKeep);
//       }

//       const imagesToDelete = finalImages.filter(
//         (img) => !imagesToKeep.includes(img),
//       );
//       for (const imgUrl of imagesToDelete) {
//         await deleteImage(imgUrl);
//       }
//       finalImages = imagesToKeep;
//     }

//     if (req.files && req.files.length > 0) {
//       for (const file of req.files) {
//         const newImageUrl = await uploadImage(file);
//         finalImages.push(newImageUrl);
//       }
//     }

//     updateData.projectImages = finalImages;

//     const updatedProject = await Project.findByIdAndUpdate(
//       req.params.projectId,
//       { $set: updateData },
//       { new: true, runValidators: true },
//     );

//     res.status(200).json({
//       message: "Project updated successfully",
//       data: updatedProject,
//     });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Failed to update project", error: error.message });
//   }
// };
const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    let updateData = { ...req.body };
    if (updateData.techStack) {
      updateData.techStack = updateData.techStack.split(",");
    }

    if (req.files && req.files.length > 0) {
      if (project.projectImages && project.projectImages.length > 0) {
        for (const imgUrl of project.projectImages) {
          await deleteImage(imgUrl);
        }
      }

      let newImageUrls = [];
      for (const file of req.files) {
        const newImageUrl = await uploadImage(file);
        newImageUrls.push(newImageUrl);
      }

      updateData.projectImages = newImageUrls;
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.projectId,
      { $set: updateData },
      { new: true, runValidators: true },
    );

    res.status(200).json({
      message: "Project updated successfully",
      data: updatedProject,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update project", error: error.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // if (project.projectImages && project.projectImages.length > 0) {
    //   for (const imgUrl of project.projectImages) {
    //     await deleteImage(imgUrl);
    //   }
    // }

    await Project.findByIdAndDelete(req.params.projectId);

    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete project", error: error.message });
  }
};

module.exports = {
  createProject,
  getAllProjects,
  getOneProject,
  updateProject,
  deleteProject,
};
