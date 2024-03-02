const multer = require("multer");
const path = require("path");
const fs = require("fs");

const destinationDirectory = "./images"; // Specify your destination directory

// Ensure the destination directory exists, create it if not
if (!fs.existsSync(destinationDirectory)) {
  fs.mkdirSync(destinationDirectory, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, destinationDirectory);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;

// const multer = require("multer");
// const path = require("path");

// module.exports = multer({
//   storage: multer.diskStorage({}),
//   fileFilter: (req, file, cb) => {
//     let ext = path.extname(file.originalname);
//     if (
//       ext !== ".jpg" &&
//       ext !== ".jpeg" &&
//       ext !== ".png" &&
//       ext !== ".pdf" &&
//       ext !== ".PNG"
//     ) {
//       cb(new Error("File type is not supported"), false);
//       return;
//     }
//     cb(null, true);
//   },
// });
