// backend/routes/medicalDetailsRoutes.js
import express from "express";
import MedicalDetails from "../models/MedicalDetails.js";
import auth from "../middleware/auth.js";

const router = express.Router();

/* =========================
   CREATE / SAVE MEDICAL DETAILS
========================= */
router.post("/", auth, async (req, res) => {
  try {
    const {
      weight,
      height,
      pcosType,
      symptoms,
      exerciseLevel,
      dietType,
      stressLevel,
      smokingStatus,
    } = req.body;

    if (
      !weight ||
      !height ||
      !pcosType ||
      !exerciseLevel ||
      !dietType ||
      !stressLevel ||
      !smokingStatus
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields.",
      });
    }

    const medicalDetails = new MedicalDetails({
      userId: req.userId, // ✅ JWT USER ID
      weight,
      height,
      pcosType,
      symptoms: Array.isArray(symptoms) ? symptoms : [],
      exerciseLevel,
      dietType,
      stressLevel,
      smokingStatus,
    });

    const saved = await medicalDetails.save();

    return res.status(201).json({
      success: true,
      message: "Medical details saved successfully.",
      data: saved,
    });
  } catch (err) {
    console.error("Error saving medical details:", err);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
});

/* =========================
   GET CURRENT USER MEDICAL DETAILS
========================= */
router.get("/", auth, async (req, res) => {
  try {
    const medicalDetails = await MedicalDetails.findOne({
      userId: req.userId,
    });

    if (!medicalDetails) {
      return res.status(404).json({
        success: false,
        message: "Medical details not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: medicalDetails,
    });
  } catch (err) {
    console.error("Error fetching medical details:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

export default router;
