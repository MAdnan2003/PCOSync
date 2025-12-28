import GeneratedPlan from "../models/GeneratedPlan.js";
import DietPlan from "../models/DietPlan.js";

/* =========================
   🎯 MEAL OPTION POOL
   (converted from your teammate's version)
========================= */

const mealOptions = {
  Breakfast: [
    { name: "Avocado Toast with Poached Egg", calories: 350, lowGI: true, ingredients: ["Whole grain bread", "Avocado", "Egg", "Chili flakes"], benefits: ["Healthy fats", "Protein", "Fiber"] },
    { name: "Oatmeal with Berries", calories: 320, lowGI: true, ingredients: ["Oats", "Blueberries", "Almond Milk", "Chia Seeds"], benefits: ["Antioxidants", "High Fiber", "Heart Health"] },
    { name: "Greek Yogurt Parfait", calories: 300, lowGI: true, ingredients: ["Greek Yogurt", "Granola", "Honey", "Strawberries"], benefits: ["Probiotics", "Protein", "Calcium"] },
    { name: "Scrambled Eggs with Spinach", calories: 340, lowGI: true, ingredients: ["Eggs", "Spinach", "Olive Oil", "Feta Cheese"], benefits: ["Iron", "Protein", "Low Carb"] },
    { name: "Chia Seed Pudding", calories: 280, lowGI: true, ingredients: ["Chia Seeds", "Coconut Milk", "Mango", "Lime"], benefits: ["Omega-3", "Hydration", "Digestion"] },
    { name: "Buckwheat Pancakes", calories: 380, lowGI: true, ingredients: ["Buckwheat Flour", "Banana", "Walnuts", "Maple Syrup"], benefits: ["Gluten-free", "Magnesium", "Energy"] },
    { name: "Tofu Scramble", calories: 310, lowGI: true, ingredients: ["Tofu", "Turmeric", "Bell Peppers", "Onions"], benefits: ["Plant Protein", "Anti-inflammatory", "Low Cholesterol"] }
  ],
  Lunch: [
    { name: "Quinoa Salad with Chickpeas", calories: 450, lowGI: true, ingredients: ["Quinoa", "Chickpeas", "Cucumber", "Lemon dressing"], benefits: ["Complex carbs", "Plant protein", "Hydration"] },
    { name: "Lentil Soup", calories: 400, lowGI: true, ingredients: ["Lentils", "Carrots", "Celery", "Tomatoes"], benefits: ["Iron", "Fiber", "Comforting"] },
    { name: "Grilled Chicken Caesar Salad", calories: 480, lowGI: false, ingredients: ["Chicken Breast", "Romaine Lettuce", "Parmesan", "Croutons"], benefits: ["High Protein", "Calcium", "Vitamins"] },
    { name: "Buddha Bowl", calories: 500, lowGI: true, ingredients: ["Brown Rice", "Sweet Potato", "Kale", "Tahini Dressing"], benefits: ["Nutrient Dense", "Balanced", "Sustained Energy"] },
    { name: "Tuna Wrap", calories: 420, lowGI: true, ingredients: ["Whole Wheat Tortilla", "Tuna", "Lettuce", "Greek Yogurt"], benefits: ["Omega-3", "Lean Protein", "Portable"] },
    { name: "Stuffed Bell Peppers", calories: 460, lowGI: true, ingredients: ["Bell Peppers", "Ground Turkey", "Rice", "Tomato Sauce"], benefits: ["Vitamin C", "Lean Protein", "Low Fat"] },
    { name: "Mushroom Risotto", calories: 520, lowGI: false, ingredients: ["Arborio Rice", "Mushrooms", "Parmesan", "White Wine"], benefits: ["Comfort food", "Selenium", "Vegetarian"] }
  ],
  Dinner: [
    { name: "Grilled Chicken with Steamed Broccoli", calories: 500, lowGI: true, ingredients: ["Chicken breast", "Broccoli", "Garlic", "Olive oil"], benefits: ["Lean protein", "Detoxification", "Low carb"] },
    { name: "Baked Salmon with Asparagus", calories: 550, lowGI: true, ingredients: ["Salmon", "Asparagus", "Lemon", "Dill"], benefits: ["Omega-3", "Brain Health", "Heart Health"] },
    { name: "Vegetable Stir-Fry", calories: 450, lowGI: true, ingredients: ["Tofu", "Broccoli", "Carrots", "Soy Sauce"], benefits: ["Vitamins", "Plant Protein", "Quick"] },
    { name: "Zucchini Noodles with Pesto", calories: 380, lowGI: true, ingredients: ["Zucchini", "Basil Pesto", "Cherry Tomatoes", "Pine Nuts"], benefits: ["Low Carb", "Antioxidants", "Light"] },
    { name: "Turkey Meatballs with Marinara", calories: 520, lowGI: true, ingredients: ["Ground Turkey", "Marinara Sauce", "Whole Wheat Pasta", "Parsley"], benefits: ["Lean Protein", "Fiber", "Comfort"] },
    { name: "Cod with Roasted Veggies", calories: 480, lowGI: true, ingredients: ["Cod Fillet", "Brussels Sprouts", "Sweet Potato", "Rosemary"], benefits: ["Lean Protein", "Vitamins", "Potassium"] },
    { name: "Eggplant Parmesan", calories: 580, lowGI: false, ingredients: ["Eggplant", "Marinara", "Mozzarella", "Breadcrumbs"], benefits: ["Vegetarian", "Calcium", "Flavorful"] }
  ],
  Snack: [
    { name: "Almonds and Dark Chocolate", calories: 200, lowGI: true, ingredients: ["Almonds", "70% Dark Chocolate"], benefits: ["Magnesium", "Antioxidants"] },
    { name: "Apple Slices with Peanut Butter", calories: 220, lowGI: true, ingredients: ["Apple", "Peanut Butter"], benefits: ["Fiber", "Healthy Fats"] },
    { name: "Carrot Sticks with Hummus", calories: 180, lowGI: true, ingredients: ["Carrots", "Hummus"], benefits: ["Vitamin A", "Protein", "Crunchy"] },
    { name: "Hard Boiled Egg", calories: 70, lowGI: true, ingredients: ["Egg", "Paprika"], benefits: ["High Protein", "Portable"] },
    { name: "Trail Mix", calories: 250, lowGI: false, ingredients: ["Nuts", "Seeds", "Dried Fruit"], benefits: ["Energy", "Healthy Fats", "Vitamins"] },
    { name: "Cottage Cheese with Pineapple", calories: 200, lowGI: true, ingredients: ["Cottage Cheese", "Pineapple chunks"], benefits: ["High Protein", "Calcium", "Sweet & Savory"] },
    { name: "Edamame", calories: 150, lowGI: true, ingredients: ["Edamame beans", "Sea Salt"], benefits: ["Plant Protein", "Fiber", "Isoflavones"] }
  ],
};

/* Helpers */

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

const generateDay = (day) => {
  const meals = [
    { type: "Breakfast", ...getRandom(mealOptions.Breakfast) },
    { type: "Lunch", ...getRandom(mealOptions.Lunch) },
    { type: "Dinner", ...getRandom(mealOptions.Dinner) },
    { type: "Snack", ...getRandom(mealOptions.Snack) },
  ];

  const totalCalories = meals.reduce((sum, m) => sum + m.calories, 0);

  return { day, totalCalories, meals };
};

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/* =========================
   🚀 GENERATE PLAN
========================= */

export const generatePlan = async (req, res) => {
  try {
    const { preference, mealsPerDay, allergies, goals } = req.body;

    const weekMatches = DAYS.map((d) => generateDay(d));

    const userId = req.userId || "demo-user";

    const plan = await GeneratedPlan.create({
      userId,
      preferences: {
        dietType: preference,
        mealsPerDay,
        allergies,
        healthGoals: goals,
      },
      weekMatches,
    });

    return res.json({
      success: true,
      weekMatches: plan.weekMatches,
    });
  } catch (err) {
    console.error("Diet plan generation error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/* =========================
   🟢 GET LATEST PLAN
========================= */

export const getPlan = async (req, res) => {
  try {
    const userId = req.userId || "demo-user";

    const plan = await GeneratedPlan.findOne({ userId })
      .sort({ createdAt: -1 })
      .lean();

    if (!plan)
      return res.status(404).json({ success: false, message: "No plan found" });

    return res.json({
      success: true,
      weekMatches: plan.weekMatches,
    });
  } catch (err) {
    console.error("Get diet plan error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/* =========================
   📦 LEGACY DietPlan entries
========================= */

export const getDiet = async (req, res) => {
  try {
    const items = await DietPlan.find().lean();
    return res.json(items);
  } catch (err) {
    console.error("Legacy diet fetch error:", err);
    return res.status(500).json({ message: "Failed to fetch diet entries" });
  }
};

export const addDiet = async (req, res) => {
  try {
    const { user, mealType, description, calories } = req.body;

    const item = await DietPlan.create({
      user,
      mealType,
      description,
      calories,
    });

    return res.status(201).json(item);
  } catch (err) {
    console.error("Legacy diet add error:", err);
    return res.status(500).json({ message: "Failed to add diet entry" });
  }
};
