import BodyProfile from "../models/BodyProfile.js";

/**
 * CREATE or UPDATE BODY PROFILE
 */
export const createOrUpdateProfile = async (req, res) => {
  try {
    const { measurements, bodyShape, preferences } = req.body;

    // supports both req.user.id & req.user._id
    const userId = req.user?._id || req.user?.id;

    let profile = await BodyProfile.findOne({ userId });

    if (profile) {
      profile.measurements = measurements;
      profile.bodyShape = bodyShape;
      profile.preferences = preferences;
      profile.updatedAt = Date.now();
    } else {
      profile = new BodyProfile({
        userId,
        measurements,
        bodyShape,
        preferences
      });
    }

    await profile.save();

    res.status(200).json({
      success: true,
      message: "Body profile saved successfully",
      data: profile
    });
  } catch (error) {
    console.error("Profile Error:", error);
    res.status(500).json({
      success: false,
      message: "Error saving body profile",
      error: error.message
    });
  }
};


/**
 * GET USER PROFILE
 */
export const getProfile = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;

    const profile = await BodyProfile
      .findOne({ userId })
      .populate("userId", "name email age");

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Body profile not found"
      });
    }

    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving body profile",
      error: error.message
    });
  }
};


/**
 * ANALYZE BODY SHAPE (placeholder)
 */
export const analyzeBodyShape = async (req, res) => {
  try {
    const { measurements } = req.body;

    const analysis = {
      measurements,
      analysis: "Body shape analysis placeholder",
      recommendations: []
    };

    res.status(200).json({
      success: true,
      data: analysis
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error analyzing body shape",
      error: error.message
    });
  }
};


/**
 * GET MEASUREMENT HISTORY
 */
export const getMeasurementHistory = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;

    const profile = await BodyProfile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "No measurement history found"
      });
    }

    res.status(200).json({
      success: true,
      data: {
        measurements: profile.measurements,
        updatedAt: profile.updatedAt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving measurement history",
      error: error.message
    });
  }
};
