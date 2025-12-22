export function generateWorkoutPlan(medical) {
    const plan = {
      yoga: [],
      strength: [],
      cardio: [],
      notes: []
    };
  
    // 🧘 YOGA (based on stress & PCOS type)
    if (medical.stressLevel === "High") {
      plan.yoga.push(
        "Restorative yoga (20–30 mins)",
        "Breathing exercises (Pranayama)",
        "Child’s pose, legs-up-the-wall"
      );
    } else {
      plan.yoga.push(
        "Hatha yoga (30 mins)",
        "Sun salutations (slow pace)"
      );
    }
  
    // 🏋️ STRENGTH (based on exercise level)
    if (medical.exerciseLevel === "Sedentary") {
      plan.strength.push(
        "Bodyweight squats",
        "Wall push-ups",
        "Glute bridges"
      );
    } else if (medical.exerciseLevel === "Light") {
      plan.strength.push(
        "Resistance band exercises",
        "Dumbbell squats",
        "Modified planks"
      );
    } else {
      plan.strength.push(
        "Full-body strength training (3x/week)",
        "Lower weights, higher reps"
      );
    }
  
    // 🚶 CARDIO (PCOS safe)
    plan.cardio.push(
      "Brisk walking (30 mins)",
      "Cycling (low intensity)",
      "Swimming"
    );
  
    // 🧠 PCOS-SPECIFIC NOTES
    if (medical.pcosType === "Insulin-Resistant PCOS") {
      plan.notes.push(
        "Avoid HIIT too frequently",
        "Focus on consistency over intensity"
      );
    }
  
    if (medical.symptoms.includes("Fatigue")) {
      plan.notes.push("Take rest days seriously");
    }
  
    return plan;
  }
  