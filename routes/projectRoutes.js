const {
  createProject,
  getAllProjects,
  getProject,
  updateProject,
  deleteProject,
  updateFeaturedProject,
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
  createProject
);
// upload.fields([
//   { name: "images", maxCount: 40 },
//   { name: "image", maxCount: 1 },
// ]),

projectRouter.get("/all", getAllProjects);

projectRouter.get("/:id", getProject);

projectRouter.put("/:id", authMiddleware, isAdmin, updateProject);
projectRouter.delete("/:id", authMiddleware, isAdmin, deleteProject);

projectRouter.put(
  "/featured/:id",
  // authMiddleware,
  // isAdmin,
  upload.single("logo"),
  updateFeaturedProject
);

module.exports = projectRouter;
