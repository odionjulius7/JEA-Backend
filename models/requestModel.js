const mongoose = require("mongoose"); // Erase if already required
// !mdbgum
// Declare the Schema of the Mongo model
var requestSchema = new mongoose.Schema(
  {
    inquirer_category: {
      type: String,
      required: true,
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
    additional_details: {
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
  },
  {
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model("Request", requestSchema);
