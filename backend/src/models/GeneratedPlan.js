// backend/src/models/GeneratedPlan.js
import mongoose from "mongoose";

const GeneratedPlanSchema = new mongoose.Schema({
  userId: {
    type: String, // string to support demo / non-auth
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  preferences: {
    dietType: String,
    mealsPerDay: String,
    allergies: [String],
    healthGoals: [String],
  },
  weekMatches: [
    {
      day: String, // Mon, Tue, etc.
      totalCalories: Number,
      meals: [
        {
          type: { type: String }, // Breakfast, Lunch...
          name: String,
          calories: Number,
          lowGI: Boolean,
          ingredients: [String],
          benefits: [String],
        },
      ],
    },
  ],
});

const GeneratedPlan = mongoose.model("GeneratedPlan", GeneratedPlanSchema);

export default GeneratedPlan;
