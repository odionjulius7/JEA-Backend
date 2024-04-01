const asyncHandler = require("express-async-handler");
const Project = require("../models/projectModel");
const FeaturesAndLogo = require("../models/featuresAndLogo");
const cloudinary = require("cloudinary").v2;
const { validateMongoDBId } = require("../config/validateMongoDBId");
const { default: slugify } = require("slugify");
const { findAvailableSlug } = require("./customCtrl");
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Create Our Project
// const createProject = asyncHandler(async (req, res) => {
//   // console.log(req.body);
//   try {
//     if (!req.body.title) {
//       return res
//         .status(400)
//         .json({ status: false, message: "Title is required" });
//     }

//     // Generate slug based on the title
//     const baseSlug = slugify(req.body.title.toLowerCase());
//     req.body.slug = await findAvailableSlug(Project, baseSlug);

//     // Upload images to Cloudinary
//     const uploadImages = async () => {
//       const imageUrls = [];
//       const images = req.files["images"]; // Access uploaded images array
//       if (images) {
//         for (const image of images) {
//           const result = await cloudinary.uploader.upload(image.path);
//           imageUrls.push(result.secure_url);
//         }
//       }
//       return imageUrls;
//     };

//     // Upload logo to Cloudinary
//     const uploadLogo = async () => {
//       const logo = req.files["logo"]; // Access uploaded logo file
//       console.log(logo);
//       if (!logo || logo.length === 0) {
//         console.error("No logo file found in the request");
//         return null;
//       }

//       const logoResult = await cloudinary.uploader.upload(logo[0].path);
//       console.log("Logo uploaded successfully:", logoResult.secure_url);
//       return logoResult.secure_url;
//     };

//     // Perform image and logo uploads concurrently
//     const [imageUrls, logoUrl] = await Promise.all([
//       uploadImages(),
//       uploadLogo(),
//     ]);

//     // Set images and logo URLs in req.body
//     req.body.images = imageUrls;
//     req.body.logo = logoUrl;

//     // Create project with req.body containing images and logo URLs
//     const project = await Project.create(req.body);

//     // Return response
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

const createProject = asyncHandler(async (req, res) => {
  try {
    if (req.body.title) {
      const baseSlug = slugify(req.body.title.toLowerCase());
      req.body.slug = await findAvailableSlug(Project, baseSlug);
    }

    // Check if featuresAndLogos field exists in request body
    if (req.body.featuresAndLogos) {
      // Split the comma-separated string into an array of IDs
      req.body.featuresAndLogos = req.body.featuresAndLogos.split(",");
    }

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

    const imageUrls = await Promise.all(uploadPromises);
    req.body.images = imageUrls;

    // Push the last item from imageUrls array to req.body.logo
    if (imageUrls.length > 0) {
      req.body.logo = imageUrls[imageUrls.length - 1];
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
    const project = await Project.findById(id).populate("featuresAndLogos");
    res.status(200).json({
      status: true,
      message: "Project Found!",
      project,
    });
  } catch (error) {
    throw new Error(error);
  }
});
// Slug
const getProjectByTag = asyncHandler(async (req, res) => {
  const { tag } = req.params;
  try {
    const project = await Project.findOne({ tag: tag }).populate(
      "featuresAndLogos"
    );
    res.status(200).json({
      status: true,
      message: "Project Found!",
      project,
    });
  } catch (error) {
    throw new Error(error);
  }
});
// Tag
const getProjectBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  try {
    const project = await Project.findOne({ slug: slug }).populate(
      "featuresAndLogos"
    );
    res.status(200).json({
      status: true,
      message: "Project Found!",
      project,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Update Featured Project
const updateFeaturedProject = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { oldId } = req.body;

  try {
    // Check if oldId is provided and if it's different from the current id
    if (oldId && oldId !== id) {
      // Find the old project and check if it has a tag of "featured"
      const oldProject = await Project.findById(oldId);
      if (oldProject && oldProject.tag === "featured") {
        // Update the tag of the old project to "regular"
        await Project.findByIdAndUpdate(oldId, { tag: "regular" });
      }
    }

    // Update the project with the id parameter to have the tag "featured"
    const updatedProject = await Project.findByIdAndUpdate(
      id,
      { tag: "featured" },
      { new: true }
    );

    res.status(200).json({
      status: true,
      message: "Project Featured!",
      updatedProject,
    });
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
});

// Update Project
const updateProject = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDBId(id);
  try {
    if (req.body.title) {
      const baseSlug = slugify(req.body.title.toLowerCase());
      req.body.slug = await findAvailableSlug(Project, baseSlug);
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

// Create Our Featueres N Icon
const createFeaturesLogo = asyncHandler(async (req, res) => {
  try {
    // console.log("req.file:", req.file); // Log req.file to check its contents
    if (!req.file) {
      return res
        .status(400)
        .json({ status: false, message: "No file uploaded" });
    }

    cloudinary.uploader.upload(req.file.path, async (error, result) => {
      if (result) {
        let image = result.secure_url;
        req.body.image = image;
        const featuresLogo = await FeaturesAndLogo.create(req.body);

        res.status(200).json({
          status: true,
          message: "Features N Logo created successfully",
          featuresLogo,
        });
      } else {
        res
          .status(500)
          .json({ status: false, message: "Failed to upload image" });
      }
    });
  } catch (error) {
    console.error("Error creating Features and Logo:", error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
});

//
const getAllFeaturesLog = asyncHandler(async (req, res) => {
  try {
    const allFeat = await FeaturesAndLogo.find();
    res.status(200).json({
      status: true,
      message: "All Fetched!",
      allFeat,
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
  updateFeaturedProject,
  getProjectBySlug,
  getProjectByTag,
  //
  createFeaturesLogo,
  getAllFeaturesLog,
};
