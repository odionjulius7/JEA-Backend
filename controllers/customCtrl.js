const asyncHandler = require("express-async-handler");
const { validateMongoDBId } = require("../config/validateMongoDBId");
// const apiFeatures = require("../utils/apiFeatures");
const { default: slugify } = require("slugify");
const apiFeatures = require("../utils/apiFeatures");

const createOne = (Model) => {
  return asyncHandler(async (req, res) => {
    try {
      if (req.body.title) {
        req.body.slug = slugify(req.body.title.toLowerCase());
      }
      const data = await Model.create(req.body);
      res
        .status(200)
        .json({ status: true, message: "Created Successfully!!", data });
    } catch (error) {
      throw new Error(error);
    }
  });
};

const getOne = (Model, populateOptions) => {
  return asyncHandler(async (req, res) => {
    const { id, slug } = req.params;
    if (id) validateMongoDBId(id);

    try {
      let query;
      if (id) {
        query = await Model.findById(id);
      }
      if (slug) {
        query = await Model.findOne({ slug: slug });
        // query = await Model.findOne({ slug: slug });
      }
      if (populateOptions) {
        query = query.populate(populateOptions);
      }

      const data = await query;

      // if (!data) {
      //   throw new Error("No Data Found With This Id");
      // }
      res.status(200).json({ status: true, message: "Found!!", data });
    } catch (error) {
      throw new Error(error);
    }
  });
};

const updateOne = (Model) => {
  return asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDBId(id);
    try {
      if (req.body.title) {
        req.body.slug = slugify(req.body.title.toLowerCase());
      }
      const data = await Model.findByIdAndUpdate(id, req.body, { new: true });
      res
        .status(200)
        .json({ status: true, message: "Updated Successfully!!", data });
    } catch (error) {
      throw new Error(error);
    }
  });
};

const deleteOne = (Model) => {
  return asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDBId(id);
    try {
      const data = await Model.findByIdAndDelete(id);
      res
        .status(200)
        .json({ status: true, message: "Deleted Successfully!!", data });
    } catch (error) {
      throw new Error(error);
    }
  });
};

const getAll = (Model, populateOptions) => {
  return asyncHandler(async (req, res) => {
    try {
      let filter = {};

      // Create an instance of it using the new keyword
      const features = new apiFeatures(Model.find(filter), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

      // Construct a dynamic query based on the provided search parameters
      const dynamicQuery = {};

      // Handle price[gte]
      if (req.query.price && req.query.price.gte !== undefined) {
        dynamicQuery.price = {
          ...dynamicQuery.price,
          $gte: req.query.price.gte,
        };
      }

      // Handle price[lte]
      if (req.query.price && req.query.price.lte !== undefined) {
        dynamicQuery.price = {
          ...dynamicQuery.price,
          $lte: req.query.price.lte,
        };
      }

      if (req.query.location) {
        dynamicQuery.location = { $regex: new RegExp(req.query.location, "i") };
      }
      if (req.query.number_of_room) {
        dynamicQuery.number_of_room = req.query.number_of_room;
      }
      if (req.query.category) {
        dynamicQuery.category = req.query.category;
      }

      // Merge the dynamic query with the existing features.query
      features.query = { ...features.query, ...dynamicQuery };

      if (populateOptions) {
        query = features.query.populate(populateOptions);
      } else {
        query = features.query;
      }

      const data = await query;

      res
        .status(200)
        .json({ status: true, message: "Fetched Successfully!!", data });
    } catch (error) {
      throw new Error(error);
    }
  });
};

// const getAll = (Model, populateOptions) => {
//   return asyncHandler(async (req, res) => {
//     try {
//       let filter = {};

//       /* create an instance of it using the new keyword  */
//       const features = new apiFeatures(Model.find(filter), req.query)
//         .filter()
//         .sort()
//         .limitFields()
//         .paginate();
//       //
//       if (populateOptions) {
//         query = features.query.populate(populateOptions);
//       } else {
//         query = features.query;
//       }
//       const data = await query;
//       //
//       res
//         .status(200)
//         .json({ status: true, message: "Fetched Successfully!!", data });
//     } catch (error) {
//       throw new Error(error);
//     }
//   });
// };

module.exports = { createOne, getOne, updateOne, deleteOne, getAll };
