const { StatusCodes } = require("http-status-codes");
const sgMail = require("@sendgrid/mail");

const cloudinary = require("../utils/cloudinary");
const passwordGenerator = require("password-generator");
const User = require("../models/User");

const {
  BadRequestError,
  UnauthenticatedError,
  NotFoundError,
} = require("../errors");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../config/jwtToken");

// REGISTER
const registerUser = async (req, res) => {
  const { email } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.json({
      msg: "user already existed",
    });
  }

  const password = passwordGenerator(12, false);

  const newData = { ...req.body, password };
  const user = await User.create({ ...newData });

  // console.log(`${newData.password}, ${newData.email} `);
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: newData.email,
    from: "odionjulius7@gmail.com",
    subject: "Your new account has been created!",
    html: `<div>
    <p>Hello ${newData.firstName}, your new account has been created with the following login details:<br /> Email: ${newData.email}, Password: ${newData.password}</p>
    <a href="https://client.thekeona.com/">Click here to login</a>
    </div>`,
  };
  await sgMail.send(msg);
  // const info = await sgMail.send(msg);
  // res.json(info);

  const token = user.createJWT();

  res.status(StatusCodes.CREATED).json({
    success: true,
    msg: "user created successfully",
    user,
    token,
    password,
  });
};

//
const registerAdmin = asyncHandler(async (req, res) => {
  const email = req.body.email;

  /* find the user with this email from the req.body */
  const findUser = await User.findOne({ email: email });

  if (!findUser) {
    /* If user doesn't exist already */
    const createUser = await User.create(req.body);
    res.status(200).json({
      status: true,
      message: "User Created Successfully",
      createUser,
    });
  } else {
    throw new Error("User already exist!");
  }
});

// admin login
const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // if (!email || !password) {
  //   throw new Error("Please, provide email and password");
  // }
  // const user = await User.findOne({ email });
  // if (!user) {
  //   throw new Error("Invalid Credentials");
  // }
  // if (user.role === "user") {
  //   throw new Error("Unauthorize credential, This is not an admin account");
  // }
  // const isPasswordCorrect = await user.comparePassword(password);
  // if (!isPasswordCorrect) {
  //   throw new Error(`Invalid Credentials  password ${password}`);
  // }
  // const token = user.createJWT();
  // res.status(StatusCodes.OK).json({
  //   user: { name: user.name, email: user.email, id: user._id },
  //   token,
  //   role: user.role,
  // })
  //
  /* check if user exist */
  const findUser = await User.findOne({ email: email });

  if (findUser && (await findUser.isPasswordMatched(password))) {
    /* if user with the email exist and the password check matches then */
    res.status(200).json({
      status: true,
      message: "Logged In Successfully!",
      token: generateToken(findUser?._id),
      role: findUser?.roles,
      profession: findUser?.profession,
      username: findUser?.firstname + findUser?.lastname,
      email: findUser?.email,
      user_image: findUser?.user_image,
    });
  } else {
    throw new Error("Invalid Credentials");
  }
});

// change or forgot password
const changePassword = async (req, res) => {
  const { email, old_password, new_password } = req.body;

  // Check if the user with the provided email exists
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({
      msg: "User not found",
    });
  }

  // Check if the provided current password matches the user's current password
  if (!(await user.isPasswordMatched(old_password))) {
    return res.status(500).json({
      msg: "Incorrect current password",
    });
  }

  // Update the user's password
  user.password = new_password;
  await user.save();

  res.status(200).json({
    msg: "Password changed successfully",
  });
};
// change or forgot password
const sendResetToken = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "User with that email does not exist" });
    }
    const token = Math.random().toString(36).slice(-8);
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send an email to the user to confirm the password change
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: email,
      from: "odionjulius7@gmail.com",
      subject: "Your password reset token",
      html: `<strong>Hello ${user.firstName},</strong><br><br>
        You recently requested to reset your password. Please use the following token to reset your password:<br><br>
        Token: <strong>${token}</strong><br><br>
        Please note that this token will expire in 1 hour. If you did not request a password reset, you can safely ignore this email.`,
    };
    await sgMail.send(msg);

    res.status(200).json({ message: "Email sent" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const user = await User.findOne({
      /*
       *find the user with both the hashed ResetToken and the passwordResetExpires date
       * if passwordResetExpires is greater than the present time, get the user
       * else if less than passwordResetExpires has expired ({ $gt: Date.now() })
       */
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Password reset token is invalid or has expired" });
    }

    // const hash = await bcrypt.hash(password, 10);

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    // Send an email to the user to confirm the password change
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: user.email,
      from: "odionjulius7@gmail.com",
      subject: "Your password has been changed!",
      html: `<strong>Hello ${user.firstName}, your password has been changed successfully.</strong>`,
    };
    await sgMail.send(msg);

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  registerAdmin,
  loginAdmin,
  changePassword,
  sendResetToken,
  resetPassword,
};

// we can hash the password in our control or we use the mongoose middleware for that in the model
// const register = async (req, res) => {
//   const { name, email, password } = req.body;

//   const salt = await bcrypt.genSalt(10); // the number of rounds of byte of the hashed password should be(10 is a default)

// const addUserBanner = async (req, res) => {
//   const userId = req.params.userId;
//   try {
//     const user = await User.findById(userId);
//     if (!user) {
//       return res
//         .status(StatusCodes.NOT_FOUND)
//         .json({ error: "User not found" });
//     }
//     upload(req, res, async (error) => {
//       if (error) {
//         console.error(error);
//         return res
//           .status(StatusCodes.BAD_REQUEST)
//           .json({ error: error.message });
//       }
//       const result = await cloudinary.uploader.upload(req.file.path);
//       const userBanner = {
//         imgURL: result.secure_url,
//         cloudinary_id: result.public_id,
//       };
//       user.banner = userBanner;
//       await user.save();
//       return res
//         .status(StatusCodes.OK)
//         .json({ message: "User banner saved successfully", userBanner });
//     });
//   } catch (error) {
//     console.error(error);
//     return res
//       .status(StatusCodes.INTERNAL_SERVER_ERROR)
//       .json({ error: "An error occurred while saving user banner data" });
//   }
// };

//   const hashedPassword = await bcrypt.hash(password, salt);

//   const tempUser = { name, email, password: hashedPassword };

//   const user = await User.create({ ...tempUser });
//   res.status(StatusCodes.CREATED).json({ user });
// res
// .status(StatusCodes.CREATED)
// .json({ user: { name: user.getName() }, token }); // or use mongoose property getter method frm schema;
// .json({ user: { name: user.name, id: user._id }, token });
// };

// Generate password for users as admin
// const register = async (req, res) => {
//   const { name, email } = req.body;
//   const password = passwordGenerator(12, false);

//   const salt = await bcrypt.genSalt(10); // the number of rounds of byte of the hashed password should be(10 is a default)

//   // const hashedPassword = await bcrypt.hash(password, salt);

//   const tempUser = { name, email, password };
//   // const tempUser = { name, email, password: hashedPassword};

//   const user = await User.create({ ...tempUser });
//   res.status(StatusCodes.CREATED).json({ user });
// };

// const { StatusCodes } = require("http-status-codes");
// const User = require("../models/User");
// const { BadRequestError, UnauthenticatedError } = require("../errors");
// const bcrypt = require("bcrypt");
// // const passwordGenerator = require("password-generator"); // generated fakePassword

// const getUser = (req, res) => {
//   res.send("hi here");
// };

// // REGISTER
// const register = async (req, res) => {
//   const { email } = req.body;
//   const existingUser = await User.findOne({ email });

//   if (existingUser) {
//     return res.json({
//       msg: "user already existed",
//     });
//   }
//   const user = await User.create({ ...req.body });
//   // note: when we create(), mongose genearte a method to get the properties in the model

//   const token = user.createJWT();
//   // the token we created in the model to genrate token when we register and as well the method to get it through d model

//   res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
// };

// // LOGIN
// const login = async (req, res) => {
//   const { email, password } = req.body;
//   if (!email || !password) {
//     throw new BadRequestError("Please, provide email and password");
//   }

//   // first find the user with email, to know if it exist 1st
//   const user = await User.findOne({ email });

//   // check if user exist
//   if (!user) {
//     throw new UnauthenticatedError("Invalid Credentials");
//   }

//   const isPasswordCorrect = await user.comparePassword(password); // we wait for it to compare

//   // check if matches that of the user gotten user gotten
//   if (isPasswordCorrect) {
//     throw new UnauthenticatedError(`Invalid Credentials  password ${password}`);
//   }

//   const token = user.createJWT(); // us tha mongoose method to get the token with props

//   res.status(StatusCodes.OK).json({
//     user: { name: user.name, email: user.email, id: user._id },
//     token,
//     status: isPasswordCorrect,
//   });
// };

// module.exports = { register, login, getUser };

// // we can hash the password in our control or we use the mongoose middleware for that in the model
// // const register = async (req, res) => {
// //   const { name, email, password } = req.body;

// //   const salt = await bcrypt.genSalt(10); // the number of rounds of byte of the hashed password should be(10 is a default)

// //   const hashedPassword = await bcrypt.hash(password, salt);

// //   const tempUser = { name, email, password: hashedPassword };

// //   const user = await User.create({ ...tempUser });
// //   res.status(StatusCodes.CREATED).json({ user });
// // res
// // .status(StatusCodes.CREATED)
// // .json({ user: { name: user.getName() }, token }); // or use mongoose property getter method frm schema;
// // .json({ user: { name: user.name, id: user._id }, token });
// // };

// // Generate password for users as admin
// // const register = async (req, res) => {
// //   const { name, email } = req.body;
// //   const password = passwordGenerator(12, false);

// //   const salt = await bcrypt.genSalt(10); // the number of rounds of byte of the hashed password should be(10 is a default)

// //   // const hashedPassword = await bcrypt.hash(password, salt);

// //   const tempUser = { name, email, password };
// //   // const tempUser = { name, email, password: hashedPassword};

// //   const user = await User.create({ ...tempUser });
// //   res.status(StatusCodes.CREATED).json({ user });
// // };
