const {
  createProject,
  getAllProjects,
  getProject,
  updateProject,
  deleteProject,
} = require("../controllers/projectCtrl");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const { isAdmin, authMiddleware } = require("../middleware/authentication");

const projectRouter = require("express").Router();

projectRouter.post(
  "/",
  authMiddleware,
  isAdmin,
  upload.array("images"),
  createProject
);
projectRouter.get("/all", getAllProjects);

projectRouter.get("/:id", getProject);

projectRouter.put("/:id", authMiddleware, isAdmin, updateProject);
projectRouter.delete("/:id", authMiddleware, isAdmin, deleteProject);

module.exports = projectRouter;
