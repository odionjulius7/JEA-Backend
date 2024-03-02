const mongoose = require("mongoose"); // Erase if already required
// !mdbgum
// Declare the Schema of the Mongo model
var blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide the title of the blog"],
    },
    image: {
      type: String,
      required: [true, "Please provide the featured image of the blog"],
    },
    body: {
      type: String,
      required: [true, "Please provide the body of the blog"],
    },
  },
  {
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model("Blog", blogSchema);
