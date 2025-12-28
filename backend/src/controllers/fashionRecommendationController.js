import FashionRecommendation from "../models/FashionRecommendation.js";
import BodyProfile from "../models/BodyProfile.js";
import Symptom from "../models/Symptom.js";

export const getRecommendations = async (req, res) => {
  try {
    // Support either req.user._id or req.user.id
    const userId = req.user?._id || req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication missing"
      });
    }

    // Fetch body profile
    const profile = await BodyProfile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Please complete your body profile first"
      });
    }

    const { bodyShape } = profile;

    // Some users may not have pcosType stored in req.user
    const pcosType = req.user?.pcosType || "Unknown";

    // ✅ FIX: use createdAt instead of date
    const latestSymptom = await Symptom
      .findOne({ userId })
      .sort({ createdAt: -1 });

    // 🟢 If no symptoms exist yet, use defaults
    const bloatingLevel = latestSymptom?.bloating ?? 0;
    const energyLevel = latestSymptom?.energy ?? 5;

    let recommendations = [];

    // ------------------------------------
    // 🔹 YOUR EXISTING LOGIC GOES HERE
    // (body shape + symptoms + PCOS type rules)
    // ------------------------------------
    // I am intentionally not modifying your teammate's logic,
    // just making sure inputs are correct + stable.

    // Example safe placeholder if list empty
    if (!Array.isArray(recommendations)) {
      recommendations = [];
    }

    res.status(200).json({
      success: true,
      data: {
        bodyShape,
        pcosType,
        currentSymptoms: {
          bloating: bloatingLevel,
          energy: energyLevel
        },
        recommendations
      }
    });

  } catch (error) {
    console.error("Recommendation Error:", error);
    res.status(500).json({
      success: false,
      message: "Error generating recommendations",
      error: error.message
    });
  }
};


export const saveRecommendation = async (req, res) => {
  try {
    const { bodyShape, pcosType, recommendations } = req.body;

    // Support both _id and id
    const userId = req.user?._id || req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication missing"
      });
    }

    const savedRec = await FashionRecommendation.create({
      userId,
      bodyShape,
      pcosType,
      recommendations
    });

    res.status(201).json({
      success: true,
      message: "Recommendation saved successfully",
      data: savedRec
    });

  } catch (error) {
    console.error("Recommendation Save Error:", error);
    res.status(500).json({
      success: false,
      message: "Error saving recommendation",
      error: error.message
    });
  }
};
