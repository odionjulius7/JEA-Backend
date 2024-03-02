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
      // minlength: 3,
      // maxlength: 5000,
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
    // image: {
    //   type: String, // Changed to an array of strings
    //   default:
    //     "https://res.cloudinary.com/dnd6g0t90/image/upload/v1709065077/eiohkonftirfzbrpxqs5.png",
    // },
    images: {
      type: [String], // Changed to an array of strings
      default: [
        "https://climate.onep.go.th/wp-content/uploads/2020/01/default-image.jpg",
      ], // Default image URL as the first item in the array
    },
    category: {
      type: String,
      required: true,
      enum: ["buy", "rent", "land", "short let"],
    },
  },
  {
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model("Property", propertySchema);
