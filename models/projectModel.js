const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var projectSchema = new mongoose.Schema(
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
    features: {},
    neighborhood_info: {},
    property_details: {},
    agent_whatsapp: {
      type: String,
    },
    agent_call: {
      type: String,
    },
    number_of_room: {
      type: Number,
    },
    logo: {
      type: String,
    },
    images: {
      type: [String], // Changed to an array of strings
      // Default image URL as the first item in the array
    },
    category: {
      type: String,
      required: true,
      enum: ["completed", "ongoing", "featured"],
    },
    // tag: {
    //   type: String,
    //   enum: ["regular", "featured"],
    //   default: "regular",
    // },
  },
  {
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model("Project", projectSchema);
