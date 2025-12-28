// backend/src/routes/skincareRoutes.js

import express from "express";
import auth from "../middleware/auth.js";
import MedicalDetails from "../models/MedicalDetails.js";
import SkincareProfile from "../models/SkincareProfile.js";

const router = express.Router();

/* =========================
   SAVE / UPDATE SKINCARE PROFILE
========================= */
router.post("/profile", auth, async (req, res) => {
  try {
    const data = {
      userId: req.userId,

      skinType: req.body.skinType,
      acneType: req.body.acneType,
      sensitivity: req.body.sensitivity,

      oilLevel: req.body.oilLevel,
      hyperpigmentation: req.body.hyperpigmentation,
      darkSpots: req.body.darkSpots,

      lifestyle: req.body.lifestyle,
      sunscreenPreference: req.body.sunscreenPreference
    };

    const profile = await SkincareProfile.findOneAndUpdate(
      { userId: req.userId },
      data,
      { upsert: true, new: true }
    );

    return res.json({
      success: true,
      message: "Skincare profile saved",
      profile
    });

  } catch (err) {
    console.error("Skincare profile save error:", err);
    res.status(500).json({ success: false, message: "Server error saving profile" });
  }
});


/* ======================================
   HELPER — always return structured steps
====================================== */
const makeStep = (name, description = "", tip = "", duration = "") => ({
  name,
  description,
  tip,
  duration
});


/* =========================
   GET SKINCARE ROUTINE
========================= */
router.get("/routine", auth, async (req, res) => {
  try {
    const profile = await SkincareProfile.findOne({ userId: req.userId });

    const routine = {
      morning: [],
      night: [],
      tips: []
    };

    /* =========================
       PROFILE BASED MODE
    ========================== */
    if (profile) {

      // ---------- SKIN TYPE ----------
      if (profile.skinType === "Oily") {

        routine.morning.push(
          makeStep("Oil-control foaming cleanser", "Removes excess oil without stripping", "Avoid harsh scrubs", "60s"),
          makeStep("Niacinamide serum", "Reduces sebum + inflammation", "Best for hormonal acne", "1–2 min"),
          makeStep("Gel moisturizer", "Hydrates without clogging pores", "", "30s"),
          makeStep("Oil-free SPF 50", "Prevents dark spots & PIH", "Reapply outdoors", "Generous")
        );

        routine.night.push(
          makeStep("Salicylic acid cleanser", "Unclogs pores & reduces breakouts", "", "60s"),
          makeStep("Retinoid (2–3x/week)", "Boosts cell turnover", "Alternate nights", "Pea-size"),
          makeStep("Oil-free moisturizer", "Prevents dehydration", "", "30s")
        );

        routine.tips.push("Avoid coconut oil & heavy creams");
      }


      if (profile.skinType === "Dry") {

        routine.morning.push(
          makeStep("Cream cleanser", "Hydrates while cleansing", "", "60s"),
          makeStep("Hyaluronic acid serum", "Deep hydration booster", "Apply to damp skin", "1–2 min"),
          makeStep("Ceramide moisturizer", "Repairs moisture barrier", "", "30s"),
          makeStep("Hydrating SPF 50", "Prevents moisture loss", "", "Generous")
        );

        routine.night.push(
          makeStep("Gentle cleanser", "Non-stripping formula", "", "60s"),
          makeStep("Peptide serum", "Supports barrier repair", "", "1–2 min"),
          makeStep("Thick night cream", "Locks in hydration overnight", "", "30s")
        );

        routine.tips.push("Avoid foaming cleansers & harsh actives");
      }


      if (profile.skinType === "Combination") {

        routine.morning.push(
          makeStep("Balancing cleanser", "Controls oil while hydrating", "", "60s"),
          makeStep("Niacinamide serum", "Balances T-zone oil", "", "1–2 min"),
          makeStep("Lightweight moisturizer", "Hydrates dry areas", "", "30s"),
          makeStep("SPF 50", "Protects uneven tone", "", "Generous")
        );

        routine.night.push(
          makeStep("Zone-treat oily T-zone", "Apply actives only to oily areas"),
          makeStep("Hydrate dry cheeks", "Use richer cream on dry areas"),
          makeStep("Oil-free gel moisturizer", "Prevents congestion")
        );
      }


      // ---------- ACNE TYPE ----------
      if (profile.acneType === "Hormonal") {
        routine.night.push(
          makeStep("Azelaic acid", "Reduces inflammation & PIH"),
          makeStep("Retinoid (alternate nights)", "Improves texture")
        );
        routine.tips.push("Hormonal acne improves with consistent routines");
      }

      if (profile.acneType === "Cystic") {
        routine.night.push(
          makeStep("BHA exfoliant (2x/week)", "Decongests deep pores"),
          makeStep("Spot treatment", "Use only on active cysts")
        );
        routine.tips.push("Avoid popping cysts — prevents deep scarring");
      }


      // ---------- SENSITIVITY ----------
      if (profile.sensitivity === "High") {
        routine.tips.push(
          "Patch test new products",
          "Avoid fragrance + alcohol toners"
        );
      }


      // ---------- LIFESTYLE ----------
      if (profile.lifestyle === "Outdoor") {
        routine.morning.push(
          makeStep("Sweat-proof mineral sunscreen", "Best for sensitive + acne-prone skin")
        );
        routine.tips.push("Reapply SPF every 2 hours");
      }

      if (profile.lifestyle === "Indoor") {
        routine.tips.push("Use lightweight moisturizer to avoid congestion");
      }


      // ---------- EXTRA CONDITIONS ----------
      if (profile.hyperpigmentation) {
        routine.night.push(
          makeStep("Azelaic acid (pigmentation control)")
        );
        routine.tips.push("Daily sunscreen prevents dark spot darkening");
      }

      if (profile.darkSpots) {
        routine.night.push(
          makeStep("Niacinamide + Tranexamic Acid serum")
        );
      }

      return res.json({
        success: true,
        mode: "profile_based",

        data: {
          ...routine,

          profile: {
            skinType: profile.skinType,
            acneType: profile.acneType,
            sensitivity: profile.sensitivity,
            oilLevel: profile.oilLevel,
            lifestyle: profile.lifestyle,
            hyperpigmentation: profile.hyperpigmentation,
            darkSpots: profile.darkSpots
          }
        }
      });
    }


    /* =========================
       MEDICAL FALLBACK MODE
    ========================== */

    const medical = await MedicalDetails.findOne({ userId: req.userId });

    if (!medical) {
      return res.status(404).json({
        success: false,
        message: "Medical details not found"
      });
    }

    const fallback = [
      "Gentle foaming cleanser",
      "Niacinamide serum",
      "Oil-free moisturizer",
      "Salicylic acid (2–3x/week)",
      "SPF 50"
    ];

    return res.json({
      success: true,
      mode: "medical_fallback",
      data: {
        routine: fallback,
        profile: null
      }
    });

  } catch (err) {
    console.error("Skincare routine error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
