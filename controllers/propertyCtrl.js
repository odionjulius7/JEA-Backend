const asyncHandler = require("express-async-handler");
const Property = require("../models/propertyModel");
const Request = require("../models/requestModel");
const cloudinary = require("cloudinary").v2;
const { validateMongoDBId } = require("../config/validateMongoDBId");
const { default: slugify } = require("slugify");
const { getAll, findAvailableSlug } = require("./customCtrl");
const welcome = require("../helper/emailTemplates");
const sendEmail = require("../helper/emailCtrl");
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const createProperty = asyncHandler(async (req, res) => {
  try {
    if (req.body.title) {
      const baseSlug = slugify(req.body.title.toLowerCase());
      req.body.slug = await findAvailableSlug(Property, baseSlug);
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

    const property = await Property.create(req.body);
    res.status(200).json({
      status: true,
      message: "Property Created Successfully",
      property,
    });
  } catch (error) {
    console.error("Error creating property:", error);
    res
      .status(500)
      .json({ status: false, message: "Internal Server Error", error });
  }
});

// update property images

const updatePropertyImages = asyncHandler(async (req, res) => {
  try {
    const propertyId = req.params.id;
    const property = await Property.findById(propertyId);

    if (!property) {
      return res
        .status(404)
        .json({ status: false, message: "Property not found" });
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
    property.images = imageUrls;

    await property.save();
    res.status(200).json({
      status: true,
      message: "Property images updated successfully",
      property,
    });
  } catch (error) {
    console.error("Error updating property images:", error);
    res
      .status(500)
      .json({ status: false, message: "Internal Server Error", error });
  }
});

// Create Our Property
// const createProperty = asyncHandler(async (req, res) => {
//   try {
//     if (req.body.title) {
//       req.body.slug = slugify(req.body.title.toLowerCase());
//     }
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

//     const imageUrls = await Promise.all(uploadPromises);
//     req.body.images = imageUrls;

//     const property = await Property.create(req.body);
//     res.status(200).json({
//       status: true,
//       message: "Property Created Successfully",
//       property,
//     });
//   } catch (error) {
//     console.error("Error creating property:", error);
//     res
//       .status(500)
//       .json({ status: false, message: "Internal Server Error", error });
//   }
// });

// Get All Propertys
const getAllPropertys = asyncHandler(async (req, res) => {
  try {
    const allProperty = await Property.find();
    res.status(200).json({
      status: true,
      message: "All Propertys Fetched!",
      allProperty,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const searchProperties = getAll(Property);

// Find A Property
const getProperty = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    // const Property = await Property.findOne({ slug: slug });
    const property = await Property.findById(id);
    res.status(200).json({
      status: true,
      message: "Property  Found!",
      property,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getPropertyBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  try {
    const property = await Property.findOne({ slug: slug });
    if (!property) {
      return res.status(404).json({
        status: false,
        message: "Property not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Property found!",
      property,
    });
  } catch (error) {
    console.error("Error retrieving property:", error);
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

// Update Property
const updateProperty = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDBId(id);
  try {
    if (req.body.title) {
      const baseSlug = slugify(req.body.title.toLowerCase());
      req.body.slug = await findAvailableSlug(Property, baseSlug);
    }
    const updateProperty = await Property.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json({
      status: true,
      message: "Property Updated Successfully!",
      updateProperty,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Delete Property
const deleteProperty = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDBId(id);
  try {
    const deleteProperty = await Property.findByIdAndDelete(id);
    res.status(200).json({
      status: true,
      message: "Property Deleted Successfully!",
      deleteProperty,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Request Properties
const createPropRequest = asyncHandler(async (req, res) => {
  // const email = req.body.email
  const email = "odionjulius7@gmail.com";
  try {
    const propRequest = await Request.create(req.body);
    const resetLink = `http://localhost:5000/api/property/request/${propRequest._id}`;

    const emailData = {
      username: propRequest?.fullName,
      resetLink,
      inquirer_category: propRequest?.inquirer_category,
      emailto: propRequest?.email,
    };
    const data = {
      to: email,
      text: `Hey Admin, ${propRequest.fullName} is requesting for a property`,
      subject: "Property Request",
      html: welcome(emailData),
      //   html: resetLink,
    };
    sendEmail(data);
    res.status(200).json({
      status: true,
      message: "Request Sent Successfully",
      propRequest,
    });
  } catch (error) {
    console.error("Error sending request:", error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
});

// Get All Request
const getAllPropRequest = asyncHandler(async (req, res) => {
  try {
    const allPropRequest = await Request.find();
    res.status(200).json({
      status: true,
      message: "All Propertys Fetched!",
      allPropRequest,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Find A Property
const getAPropRequest = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    // Retrieve the property request
    const propertyReq = await Request.findById(id);

    // Check if property request exists
    if (!propertyReq) {
      return res.status(404).json({
        status: false,
        message: "Property Request Not Found",
      });
    }

    // Update the status to true
    await Request.updateOne({ _id: id }, { $set: { status: true } });

    // Fetch the updated property request
    const updatedPropertyReq = await Request.findById(id);

    res.status(200).json({
      status: true,
      message: "Property Request Found!",
      propertyReq: updatedPropertyReq,
    });
  } catch (error) {
    console.error("Error getting property request:", error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
});

// Get In Touch
const postGetInTouct = asyncHandler(async (req, res) => {
  // const email = req.body.email
  const email = "odionjulius7@gmail.com";
  try {
    const propRequest = await Request.create(req.body);
    // const resetLink = `http://localhost:5000/api/property/request/${propRequest._id}`;

    const emailData = {
      fisrt_Name: propRequest?.fisrt_Name,
      last_Name: propRequest?.last_Name,
      additional_details: propRequest?.additional_details,
      emailto: propRequest?.email,
    };
    const data = {
      to: email,
      text: `Hey Admin, ${propRequest.fisrt_Name} is getting in touch with you`,
      subject: "Get In Touch",
      html: welcome(emailData),
      //   html: resetLink,
    };
    sendEmail(data);
    res.status(200).json({
      status: true,
      message: "Request Sent Successfully",
      propRequest,
    });
  } catch (error) {
    console.error("Error sending request:", error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
});

module.exports = {
  updatePropertyImages,
  createProperty,
  getAllPropertys,
  getProperty,
  updateProperty,
  deleteProperty,
  searchProperties,
  createPropRequest,
  getAPropRequest,
  getAllPropRequest,
  postGetInTouct,
  getPropertyBySlug,
};
