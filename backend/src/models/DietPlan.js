// backend/src/models/DietPlan.js
import mongoose from "mongoose";

const DietPlanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  mealType: {
    type: String,
    required: true,
    enum: ["breakfast", "lunch", "dinner", "snack"],
  },
  description: {
    type: String,
    required: true,
  },
  calories: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const DietPlan = mongoose.model("DietPlan", DietPlanSchema);

export default DietPlan;
