const {
  postBlog,
  getABlog,
  getAllBlogs,
  updateABlog,
  deleteBlog,
} = require("../controllers/blogCtrl");
const multer = require("multer");
const upload = multer({ dest: "uploads/" }); // uploads is the directory images are stored locally
const { authMiddleware, isAdmin } = require("../middleware/authentication");
const blogRouter = require("express").Router();

blogRouter.post("/", authMiddleware, isAdmin, upload.single("image"), postBlog);
blogRouter.get("/", getAllBlogs);

blogRouter.get("/:id", getABlog);

blogRouter.put("/:id", authMiddleware, isAdmin, updateABlog);
blogRouter.delete("/:id", authMiddleware, isAdmin, deleteBlog);

module.exports = blogRouter;
