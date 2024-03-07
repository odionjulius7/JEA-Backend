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
  // authMiddleware,
  // isAdmin,
  upload.fields([
    { name: "images", maxCount: 40 },
    { name: "image", maxCount: 1 },
  ]),
  // upload.array("images"),
  createProject
);

// projectRouter.post(
//   "/",
//   authMiddleware,
//   isAdmin,
//   upload.fields([
//     { name: "video", maxCount: 5 },
//     { name: "image", maxCount: 5 },
//   ]),
//   createProject
// );
projectRouter.get("/all", getAllProjects);

projectRouter.get("/:id", getProject);

projectRouter.put("/:id", authMiddleware, isAdmin, updateProject);
projectRouter.delete("/:id", authMiddleware, isAdmin, deleteProject);

module.exports = projectRouter;
