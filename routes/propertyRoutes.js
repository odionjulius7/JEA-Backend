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
} = require("../controllers/propertyCtrl");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const { isAdmin, authMiddleware } = require("../middleware/authentication");

const propertyRouter = require("express").Router();

propertyRouter.post(
  "/",
  // authMiddleware,
  // isAdmin,
  upload.array("images"),
  createProperty
);

propertyRouter.get("/all", getAllPropertys);
propertyRouter.get("/search", searchProperties);

propertyRouter.get("/:id", getProperty);

propertyRouter.put("/:id", authMiddleware, isAdmin, updateProperty);
propertyRouter.delete("/:id", authMiddleware, isAdmin, deleteProperty);

// Request Prop
propertyRouter.post("/getintouch", postGetInTouct);
propertyRouter.post("/request", createPropRequest);
propertyRouter.get("/request/all", getAllPropRequest);
propertyRouter.get("/request/:id", getAPropRequest);

module.exports = propertyRouter;
