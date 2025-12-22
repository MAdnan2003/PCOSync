import express from "express";
import auth from "../middleware/auth.js";
import MedicalDetails from "../models/MedicalDetails.js";
import { generateWorkoutPlan } from "../services/workoutPlanService.js";

const router = express.Router();

/**
 * =========================
 * GET PERSONALIZED WORKOUT PLAN
 * =========================
 */
router.get("/plan", auth, async (req, res) => {
  try {
    const medical = await MedicalDetails.findOne({
      userId: req.userId
    });

    if (!medical) {
      return res.status(404).json({
        success: false,
        message: "Medical details not found"
      });
    }

    const workoutPlan = generateWorkoutPlan(medical);

    res.json({
      success: true,
      data: workoutPlan
    });
  } catch (err) {
    console.error("Workout plan error:", err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

export default router;
