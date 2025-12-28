// backend/src/controllers/skincareController.js

import SkincareProfile from "../models/SkincareProfile.js";

export const getSkincareRoutine = async (req, res) => {
  try {
    const profile = await SkincareProfile.findOne({ userId: req.userId });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Skincare profile not found"
      });
    }

    const routine = {
      morning: [],
      night: [],
      tips: []
    };

    /* ============================
       BASED ON SKIN TYPE
    ============================= */

    switch (profile.skinType) {
      case "Oily":
        routine.morning.push(
          "Oil-control foaming cleanser",
          "Niacinamide serum",
          "Gel moisturizer",
          "Oil-free SPF 50"
        );

        routine.night.push(
          "Salicylic acid cleanser",
          "Lightweight retinoid (2–3x/week)",
          "Oil-free moisturizer"
        );

        routine.tips.push("Avoid coconut oil & heavy creams");
        break;

      case "Dry":
        routine.morning.push(
          "Cream cleanser",
          "Hyaluronic acid serum",
          "Ceramide moisturizer",
          "Hydrating SPF 50"
        );

        routine.night.push(
          "Gentle cleanser",
          "Peptide serum",
          "Thick night repair cream"
        );

        routine.tips.push("Avoid foaming cleansers & harsh exfoliants");
        break;

      case "Combination":
        routine.morning.push(
          "Balancing cleanser",
          "Niacinamide serum",
          "Lightweight moisturizer",
          "SPF 50"
        );

        routine.night.push(
          "Zone-treat T-zone",
          "Hydrate dry cheek areas",
          "Oil-free gel moisturizer"
        );

        routine.tips.push("Use different moisturizers for T-zone vs cheeks");
        break;

      case "Sensitive":
        routine.morning.push(
          "CICA calming cleanser",
          "Ceramide barrier serum",
          "Fragrance-free moisturizer",
          "Mineral sunscreen"
        );

        routine.night.push(
          "Gentle milky cleanser",
          "Centella soothing gel",
          "Barrier-repair moisturizer"
        );

        routine.tips.push("Patch-test every product");
        break;

      default:
        routine.morning.push(
          "Gentle cleanser",
          "Basic hydrating moisturizer",
          "SPF 50"
        );
        routine.night.push(
          "Gentle cleanser",
          "Hydrating serum",
          "Night moisturizer"
        );
    }

    /* ============================
       ACNE TYPE — EXTRA LAYERS
    ============================= */

    switch (profile.acneType) {
      case "Hormonal":
        routine.night.push(
          "Azelaic acid treatment",
          "Retinoid (alternate nights)"
        );
        routine.tips.push("Hormonal acne improves with consistency");
        break;

      case "Cystic":
        routine.night.push(
          "BHA exfoliant (2x/week)",
          "Targeted spot treatment"
        );
        routine.tips.push("Avoid popping cysts — reduces scarring risk");
        break;

      case "Comedonal":
        routine.night.push(
          "Gentle exfoliating toner (2x/week)",
          "Niacinamide serum"
        );
        routine.tips.push("Avoid heavy oils & occlusives");
        break;

      case "Inflammatory":
        routine.night.push(
          "Calming serum",
          "Non-comedogenic moisturizer"
        );
        routine.tips.push("Reduce irritation — avoid scrubs");
        break;
    }

    /* ============================
       SENSITIVITY OVERRIDES
    ============================= */

    if (profile.sensitivity === "High") {
      routine.tips.push(
        "Avoid fragrance & alcohol-based products",
        "Introduce new actives slowly"
      );
    }

    /* ============================
       LIFESTYLE FACTORS
    ============================= */

    if (profile.lifestyle === "Outdoor") {
      routine.morning.push("Sweat-resistant sunscreen");
      routine.tips.push("Reapply SPF every 2 hours");
    }

    if (profile.lifestyle === "Indoor") {
      routine.morning.push("Blue-light protection moisturizer");
    }

    if (profile.hyperpigmentation) {
      routine.night.push("Dark-spot fading serum (PM only)");
      routine.tips.push("Use sunscreen daily to prevent pigmentation");
    }

    if (profile.oilLevel === "High") {
      routine.morning.push("Mattifying moisturizer (optional)");
      routine.tips.push("Blotting paper is better than over-washing");
    }

    /* ============================
       FINAL API RESPONSE
       (NO LINKS — FRONTEND ONLY)
    ============================= */

    return res.json({
      success: true,
      data: {
        morning: routine.morning,
        night: routine.night,
        tips: routine.tips,

        // sent for UI labeling, NOT logic
        profile: {
          skinType: profile.skinType,
          acneType: profile.acneType,
          sensitivity: profile.sensitivity,
          lifestyle: profile.lifestyle,
          oilLevel: profile.oilLevel,
          hyperpigmentation: profile.hyperpigmentation
        }
      }
    });

  } catch (err) {
    console.error("Skincare routine error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
