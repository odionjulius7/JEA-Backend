const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var featuresAndLogoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide the title "],
    },
    image: {
      type: String,
      required: [true, "Please provide the features image"],
    },
  },
  {
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model("FeaturesAndLogo", featuresAndLogoSchema);
