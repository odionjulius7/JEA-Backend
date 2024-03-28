const {
  createProject,
  getAllProjects,
  getProject,
  updateProject,
  deleteProject,
  updateFeaturedProject,
  getProjectBySlug,
  createFeaturesLogo,
  getAllFeaturesLog,
  getProjectByTag,
} = require("../controllers/projectCtrl");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const { isAdmin, authMiddleware } = require("../middleware/authentication");

const projectRouter = require("express").Router();

projectRouter.post(
  "/",
  // authMiddleware,
  // isAdmin,
  upload.array("images"),
  // upload.single("logo"),
  createProject
);

projectRouter.get("/all", getAllProjects);

projectRouter.get("/:id", getProject);
projectRouter.get("/proj/:slug", getProjectBySlug);
projectRouter.get("/tag/:tag", getProjectByTag);

projectRouter.put(
  "/:id",
  //  authMiddleware, isAdmin,
  updateProject
);
projectRouter.delete("/:id", authMiddleware, isAdmin, deleteProject);

projectRouter.put("/featured/:id/:oldId", updateFeaturedProject);

// Features And Logo
projectRouter.post(
  "/features/logo",
  upload.single("f-image"),
  createFeaturesLogo
);
projectRouter.get("/features/logo/all", getAllFeaturesLog);
// createFeaturesLogo,
// getAllFeaturesLog,
module.exports = projectRouter;
