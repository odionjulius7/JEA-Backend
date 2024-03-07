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
    agent_whatsapp: {
      type: String,
    },
    agent_call: {
      type: String,
    },
    video_url: {
      type: String,
    },
    features: {
      type: Object,
    },
    neighborhood_info: {
      type: Object,
    },
    property_details: {
      type: Object,
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
