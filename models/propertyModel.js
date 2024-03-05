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
      required: true,
    },
    price: {
      type: Number,
      default: 0,
    },
    location: {
      type: String,
      required: true,
    },
    features: {
      type: String,
    },
    neighborhood_info: {
      type: String,
    },
    property_details: {
      type: String,
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
    category: {
      type: String,
      required: true,
      enum: ["buy", "rent", "land", "short let"],
    },
    tag: {
      type: String,
      enum: ["regular", "available luxury", "property of the week"],
      default: "regular",
    },
  },
  {
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model("Property", propertySchema);
