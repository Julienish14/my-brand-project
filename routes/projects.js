const express = require("express");
const router = express.Router();
const projectsController = require("../controllers/projectController");
const checkAuth = require("../middleware/check-auth");
const protect = require("../middleware/protected");
const { upload } = require("../utils/multer");

router.get("/", projectsController.getAllProjects);
router.get("/:projectId", projectsController.getOneProject);

router.post(
  "/",
  [checkAuth, protect],
  upload.array("projectImages", 5),
  projectsController.createProject,
);

router.patch(
  "/:projectId",
  [checkAuth, protect],
  upload.array("projectImages", 5),
  projectsController.updateProject,
);

router.delete(
  "/:projectId",
  [checkAuth, protect],
  projectsController.deleteProject,
);

module.exports = router;
