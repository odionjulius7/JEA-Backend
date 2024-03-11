const express = require("express");

const {
  loginAdmin,
  registerAdmin,
  changePassword,
  sendResetToken,
  resetPassword,
} = require("../controllers/auth");
const { isAdmin, authMiddleware } = require("../middleware/authentication");

const adminRouter = express.Router();

adminRouter.post("/register", registerAdmin);
adminRouter.post("/login", loginAdmin);
adminRouter.post("/change-password", authMiddleware, isAdmin, changePassword);
adminRouter.post("/send-token", sendResetToken);
adminRouter.post("/reset-password", resetPassword);
adminRouter.post("/change/password", changePassword);

// router.route("/change/password").post(authMiddleware, changePassword);
// //
// router.route("/register/admin").post(registerAdmin);
// router.route("/login/admin").post(loginAdmin);

// // Reset Token
// router.route("/send/token").post(sendResetToken);
// router.route("/reset/password").post(resetPassword);

module.exports = adminRouter;
