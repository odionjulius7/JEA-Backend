const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 350,
    },
    slug: {
      type: String,
    },
    description: {
      type: String,
      // required: true,
    },
    price: {
      type: Number,
      default: 0,
    },
    location: {
      type: String,
      // required: true,
    },
    video_url: {
      type: String,
    },
    features: {
      feature_1: String,
      feature_2: String,
      feature_3: String,
      feature_4: String,
      feature_5: String,
      feature_6: String,
      feature_7: String,
      feature_8: String,
    },

    neighborhood_info: {
      neighborhood_info1: String,
      neighborhood_info2: String,
      neighborhood_info3: String,
      neighborhood_info4: String,
      neighborhood_info5: String,
      neighborhood_info6: String,
    },
    property_details: {
      price: String,
      address: String,
      additional_fees: String,
      property_id: String,
      property_type: String,
      year_built: String,
      category: String,
      status: String,
      Number_of_Stories: String,
      garage_capacity: String,
      recent_renovations: String,
      youtube_url: String,
    },
    number_of_room: {
      type: Number,
    },
    images: {
      type: [String], // Changed to an array of strings
    },
    category: {
      type: String,
      required: true,
      enum: ["buy", "rent", "land", "short let"],
    },
    // category: {
    //   type: String,
    //   required: true,
    //   enum: ["buy", "rent", "land", "short let"],
    // },
    tag: {
      type: String,
      enum: ["featured", "available luxury", "property of the week"],
      // default: "featured",
    },
  },
  {
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model("Property", propertySchema);
