const mongoose = require("mongoose");

// Declare the Schema of the Mongo model
const projectSchema = new mongoose.Schema(
  {
    //
    title: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 350,
    },
    slug: {
      type: String,
      unique: true,
    },
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
    featuresAndLogos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FeaturesAndLogo",
      },
    ],
    description: {
      type: String,
    },
    price: {
      type: Number,
      default: 0,
    },
    location: {
      type: String,
    },
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
      type: [String],
    },

    category: {
      type: String,
      required: true,
      enum: ["completed", "ongoing"],
    },
    tag: {
      type: String,
      enum: ["regular", "featured"],
      default: "regular",
    },
    // Additional fields
    address: {
      type: String,
    },
    additional_fees: {
      type: String,
    },
    property_id: {
      type: String,
    },
    property_type: {
      type: String,
    },
    details_category: {
      type: String,
    },
    status: {
      type: String,
    },
    Number_of_Stories: {
      type: String,
    },
    year_built: {
      type: String,
    },
    garage_capacity: {
      type: String,
    },
    recent_renovations: {
      type: String,
    },
    youtube_url: {
      type: String,
    },
    // Features fields
    feature_1: {
      type: String,
    },
    feature_2: {
      type: String,
    },
    feature_3: {
      type: String,
    },
    feature_4: {
      type: String,
    },
    feature_5: {
      type: String,
    },
    feature_6: {
      type: String,
    },
    feature_7: {
      type: String,
    },
    feature_8: {
      type: String,
    },
    // Neighborhood info fields
    neighborhood_info1: {
      type: String,
    },
    neighborhood_info2: {
      type: String,
    },
    neighborhood_info3: {
      type: String,
    },
    neighborhood_info4: {
      type: String,
    },
    neighborhood_info5: {
      type: String,
    },
    neighborhood_info6: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Export the model
module.exports = mongoose.model("Project", projectSchema);
