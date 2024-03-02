const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
dotenv.config();

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
// cloudinary.config({
//   cloud_name: "dnd6g0t90",
//   api_key: "781724666986137",
//   api_secret: "6VguEEHeACX-SuR2bwa7zktPT4M",
// });

module.exports = cloudinary;
