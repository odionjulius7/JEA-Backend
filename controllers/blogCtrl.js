const { default: slugify } = require("slugify");
const { validateMongoDBId } = require("../config/validateMongoDBId");
const cloudinary = require("cloudinary").v2;
const Blog = require("../models/blogModel");
const asyncHandler = require("express-async-handler");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
// create or post Blog
const postBlog = asyncHandler(async (req, res) => {
  try {
    cloudinary.uploader.upload(req.file.path, async (error, result) => {
      if (result) {
        let image = result.secure_url;
        req.body.image = image;

        if (req.body.title) {
          req.body.slug = slugify(req.body.title.toLowerCase());
        }

        const blog = await Blog.create(req.body);

        res.status(200).json({
          status: true,
          message: "Blog Post created successfully",
          blog,
        });
      }
    });
  } catch (error) {
    throw new Error(error);
  }
});

// get a Blog
const getABlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await Blog.findById(id);
    res.status(200).json({
      status: true,
      message: "Blog Fetched Successfully!",
      blog,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// get all Blogs
const getAllBlogs = asyncHandler(async (req, res) => {
  try {
    const blog = await Blog.find();
    res.status(200).json({
      status: true,
      message: "Blogs Found!",
      blog,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// delete a Blog
const deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDBId(id);
  try {
    const blog = await Blog.findByIdAndDelete(id);
    res.status(200).json({
      status: true,
      message: "Blog Deleted!",
    });
  } catch (error) {
    throw new Error(error);
  }
});

// update a Blog
const updateABlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title.toLowerCase());
    }
    const updateBlog = await Blog.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json({
      status: true,
      message: "Blog Updated Successfully!",
      updateBlog,
    });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  postBlog,
  getABlog,
  getAllBlogs,
  deleteBlog,
  updateABlog,
};
