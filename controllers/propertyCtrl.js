const asyncHandler = require("express-async-handler");
const Property = require("../models/propertyModel");
const Request = require("../models/requestModel");
const cloudinary = require("cloudinary").v2;
const { validateMongoDBId } = require("../config/validateMongoDBId");
const { default: slugify } = require("slugify");
const { getAll } = require("./customCtrl");
const welcome = require("../helper/emailTemplates");
const sendEmail = require("../helper/emailCtrl");
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Create Our Property
const createProperty = asyncHandler(async (req, res) => {
  try {
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

    if (req.body.title) {
      req.body.slug = slugify(req.body.title.toLowerCase());
    }

    const property = await Property.create(req.body);
    res.status(200).json({
      status: true,
      message: "Property Created Successfully",
      property,
    });
  } catch (error) {
    console.error("Error creating property:", error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
});

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

// const searchProperties = asyncHandler(async (req, res) => {
//   try {
//     const features = new apiFeatures(Property.find(), req.query)
//       .filter()
//       .sort()
//       .limitFields()
//       .paginate();

//     const properties = await features.query.exec();

//     res.status(200).json(properties);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

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

// Update Property
const updateProperty = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDBId(id);
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title.toLowerCase());
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

module.exports = {
  createProperty,
  getAllPropertys,
  getProperty,
  updateProperty,
  deleteProperty,
  searchProperties,
  createPropRequest,
  getAPropRequest,
  getAllPropRequest,
};
