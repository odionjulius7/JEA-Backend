const asyncHandler = require("express-async-handler");
const Project = require("../models/projectModel");
const cloudinary = require("cloudinary").v2;
const { validateMongoDBId } = require("../config/validateMongoDBId");
const { default: slugify } = require("slugify");
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Create Our Project
const createProject = asyncHandler(async (req, res) => {
  try {
    // Upload Logo
    const logoResult = await cloudinary.uploader.upload(
      req.files.image[0].path,
      {
        resource_type: "image",
      }
    );

    const uploadPromises = req.files.map((file) => {
      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(file.path, (error, result) => {
          if (result) {
            resolve(result.secure_url);
          } else {
            reject(error);
          }
        });
      });
    });

    const logoUrl = logoResult.secure_url;

    const imageUrls = await Promise.all(uploadPromises);
    req.body.images = imageUrls;
    req.body.logo = logoUrl;

    if (req.body.title) {
      req.body.slug = slugify(req.body.title.toLowerCase());
    }

    const project = await Project.create(req.body);
    res.status(200).json({
      status: true,
      message: "Project Created Successfully",
      project,
    });
  } catch (error) {
    console.error("Error creating Project:", error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
});

// const createFeaturedProject = asyncHandler(async (req, res) => {
//   try {
//     const uploadPromises = req.files.map((file) => {
//       return new Promise((resolve, reject) => {
//         cloudinary.uploader.upload(file.path, (error, result) => {
//           if (result) {
//             resolve(result.secure_url);
//           } else {
//             reject(error);
//           }
//         });
//       });
//     });

//     // Upload Logo
//     const logResult = await cloudinary.uploader.upload(
//       req.files.image[0].path,
//       {
//         resource_type: "image",
//       }
//     );
//     const logoUrl = imageResult.logResult;

//     const imageUrls = await Promise.all(uploadPromises);
//     req.body.images = imageUrls;

//     if (req.body.title) {
//       req.body.slug = slugify(req.body.title.toLowerCase());
//     }

//     const project = await Project.create(req.body);
//     res.status(200).json({
//       status: true,
//       message: "Project Created Successfully",
//       project,
//     });
//   } catch (error) {
//     console.error("Error creating Project:", error);
//     res.status(500).json({ status: false, message: "Internal Server Error" });
//   }
// });

// Get All Projects
const getAllProjects = asyncHandler(async (req, res) => {
  try {
    const allProject = await Project.find();
    res.status(200).json({
      status: true,
      message: "All Projects Fetched!",
      allProject,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Find A Project
const getProject = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const project = await Project.findById(id);
    res.status(200).json({
      status: true,
      message: "Project Found!",
      project,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Update Project
const updateProject = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDBId(id);
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title.toLowerCase());
    }
    const updateProject = await Project.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json({
      status: true,
      message: "Project Updated Successfully!",
      updateProject,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Delete Project
const deleteProject = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDBId(id);
  try {
    const deleteProject = await Project.findByIdAndDelete(id);
    res.status(200).json({
      status: true,
      message: "Project Deleted Successfully!",
      deleteProject,
    });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createProject,
  getAllProjects,
  getProject,
  updateProject,
  deleteProject,
};
