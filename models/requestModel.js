const mongoose = require("mongoose"); // Erase if already required
// !mdbgum
// Declare the Schema of the Mongo model
var requestSchema = new mongoose.Schema(
  {
    inquirer_category: {
      type: String,
      enum: ["individual", "agent", "developer"],
    },
    property_category: {
      type: String,
    },
    number_of_room: {
      type: Number,
    },
    maximum_budget: {
      type: String,
    },
    location: {
      type: String,
    },

    fullName: {
      type: String,
    },
    country: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    email: {
      type: String,
    },
    fisrt_Name: {
      type: String,
    },
    last_Name: {
      type: String,
    },
    additional_details: {
      type: String,
    },
    status: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model("Request", requestSchema);
