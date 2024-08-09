const {
  getAllPropertys,
  createProperty,
  getProperty,
  updateProperty,
  deleteProperty,
  searchProperties,
  createPropRequest,
  getAPropRequest,
  getAllPropRequest,
  postGetInTouct,
  getPropertyBySlug,
  updatePropertyImages,
} = require("../controllers/propertyCtrl");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const { isAdmin, authMiddleware } = require("../middleware/authentication");

const propertyRouter = require("express").Router();

propertyRouter.post(
  "/",
  authMiddleware,
  isAdmin,
  upload.array("images"),
  createProperty
);

propertyRouter.get("/all", getAllPropertys);
propertyRouter.get("/search", searchProperties);

propertyRouter.get("/:id", getProperty);
propertyRouter.get("/prop/:slug", getPropertyBySlug);

propertyRouter.put("/:id", authMiddleware, isAdmin, updateProperty);
propertyRouter.delete("/:id", authMiddleware, isAdmin, deleteProperty);

propertyRouter.patch(
  "/img/prop/:id",
  authMiddleware,
  isAdmin,
  upload.array("images"),
  updatePropertyImages
);
// Request Prop
propertyRouter.post("/getintouch", postGetInTouct);
propertyRouter.post("/request", createPropRequest);
propertyRouter.get("/request/all", getAllPropRequest);
propertyRouter.get("/request/:id", getAPropRequest);

module.exports = propertyRouter;
