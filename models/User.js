const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Schema = mongoose.Schema;
const userSchema = new Schema({
  email: {
    type: String,
    required: [true, "Please, provide email"],
    unique: true,
    trim: true,
  },
  password: {
    type: String,
  },

  role: {
    type: String,
    default: "admin",
  },

  resetPasswordToken: String,
  resetPasswordExpires: Date,
});

// UserSchema.pre("save", async function (next) {
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);

//   next();
// });

// UserSchema.methods.createJWT = function () {
//   return jwt.sign(
//     { userId: this._id, email: this.email },
//     process.env.JWT_SECRET,
//     {
//       expiresIn: process.env.JWT_LIFETIME,
//     }
//   );
// };

// UserSchema.methods.comparePassword = async function (candidatePassword) {
//   const isMatch = await bcrypt.compare(candidatePassword, this.password);
//   return isMatch;
// };

// hash pssswd
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    /* The purpose of this code block is typically to avoid rehashing the password when you're updating other fields in the document that don't affect the password.  */
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt); // before saving to db hash the psswod
  next();
});

// compare login pwd to the user model pwd
(userSchema.methods.isPasswordMatched = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
}),
  // create password reset token
  (userSchema.methods.createPasswordResetToken = async function () {
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    this.passwordResetExpires = Date.now() + 30 * 60 * 1000; // 10 minutes to expire
    return resetToken;
  }),
  // const User = mongoose.model("User", userSchema);

  (module.exports = mongoose.model("User", userSchema));
