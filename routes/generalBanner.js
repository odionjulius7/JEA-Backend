const express = require("express");
const upload = require("../utils/multer");
const authMiddleware = require("../middleware/authentication");

const {
  addGeneralBanner,
  getGeneralBanner,
} = require("../controllers/generalBanner");

const genRouter = express.Router();

genRouter
  .route("/banner")
  .post(upload.single("generalBanner"), addGeneralBanner);
genRouter.route("/banner").get(getGeneralBanner);

module.exports = genRouter;
