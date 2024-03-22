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

// projectRouter.post(
//   "/",
//   upload.fields([
//     { name: "logo", maxCount: 1 }, // Maximum 1 logo allowed
//     { name: "images", maxCount: 40 }, // Maximum 40 images allowed
//   ]),
//   createProject
// );

// upload.fields([
//   { name: "images", maxCount: 40 },
//   { name: "logo", maxCount: 1 },
// ]),

projectRouter.get("/all", getAllProjects);

projectRouter.get("/:id", getProject);
projectRouter.get("/proj/:slug", getProjectBySlug);

projectRouter.put(
  "/:id",
  //  authMiddleware, isAdmin,
  updateProject
);
projectRouter.delete("/:id", authMiddleware, isAdmin, deleteProject);

projectRouter.put(
  "/featured/:id",
  // authMiddleware,
  // isAdmin,
  upload.single("logo"),
  updateFeaturedProject
);

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
