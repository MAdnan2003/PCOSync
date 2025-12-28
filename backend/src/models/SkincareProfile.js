// backend/src/models/SkincareProfile.js

import mongoose from "mongoose";

const skincareProfileSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },

    // PRIMARY PROFILE FIELDS
    skinType: {
      type: String,
      enum: ["Oily", "Dry", "Combination", "Normal", "Sensitive"],
      required: true
    },

    acneType: {
      type: String,
      enum: ["Hormonal", "Inflammatory", "Comedonal", "Cystic", "None"],
      required: true
    },

    sensitivity: {
      type: String,
      enum: ["Low", "Medium", "High"],
      required: true
    },

    oilLevel: {
      type: String,
      enum: ["Low", "Moderate", "High"],
      default: "Moderate"
    },

    hyperpigmentation: {
      type: Boolean,
      default: false
    },

    darkSpots: {
      type: Boolean,
      default: false
    },

    lifestyle: {
      type: String,
      enum: ["Indoor", "Outdoor", "Mixed"],
      default: "Mixed"
    },

    sunscreenPreference: {
      type: String,
      enum: ["Mineral", "Chemical", "No Preference"],
      default: "No Preference"
    },

    amazonProducts: [
      {
        label: String,
        placeholderUrl: String
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("SkincareProfile", skincareProfileSchema);
