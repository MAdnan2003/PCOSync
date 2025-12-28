// frontend/src/components/Diet/DietPlanForm.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChefHat, Check } from "lucide-react";
import axios from "axios";
import "./Diet.css";

const DietPlanForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    preference: "Balanced",
    mealsPerDay: "3",
    allergies: [],
    goals: [],
    activityLevel: "Moderate",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (group, value) => {
    setFormData((prev) => {
      const current = prev[group];
      const updated = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value];

      return { ...prev, [group]: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/diet/generate", formData);
      setLoading(false);
      navigate("/diet-plan");
    } catch (error) {
      console.error("Error generating plan:", error);
      setLoading(false);
      alert("Failed to generate plan. Please try again.");
    }
  };

  return (
    <div className="diet-page fade-in">
      <div className="diet-header-section">
        <h1>Generate Your Personalized Diet Plan</h1>
        <p>
          Tell us about your preferences and we'll create a PCOS-friendly meal
          plan just for you
        </p>
      </div>

      <form onSubmit={handleSubmit} className="diet-form card">
        {/* Diet Preference */}
        <div className="form-group">
          <label className="group-label">Diet Preference</label>
          <div className="radio-group-vertical">
            {[
              "Balanced (Includes all food groups)",
              "Vegetarian",
              "Pescatarian",
              "Vegan",
              "Keto",
            ].map((opt) => {
              const val = opt.split(" ")[0];
              return (
                <label
                  key={val}
                  className={`radio-card ${
                    formData.preference === val ? "selected" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="preference"
                    value={val}
                    checked={formData.preference === val}
                    onChange={handleChange}
                  />
                  <div className="radio-content">
                    <span className="radio-circle"></span>
                    <span>{opt}</span>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Meals Per Day */}
        <div className="form-group">
          <label className="group-label">Meals Per Day</label>
          <div className="radio-group-vertical">
            {[
              { label: "3 Main Meals", value: "3" },
              { label: "3 Main Meals + 1 Snack", value: "4" },
              { label: "3 Main Meals + 2 Snacks", value: "5" },
            ].map((opt) => (
              <label
                key={opt.value}
                className={`radio-card ${
                  formData.mealsPerDay === opt.value ? "selected" : ""
                }`}
              >
                <input
                  type="radio"
                  name="mealsPerDay"
                  value={opt.value}
                  checked={formData.mealsPerDay === opt.value}
                  onChange={handleChange}
                />
                <div className="radio-content">
                  <span className="radio-circle"></span>
                  <span>{opt.label}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Allergies */}
        <div className="form-group">
          <label className="group-label">
            Allergies or Restrictions (Select all that apply)
          </label>
          <div className="checkbox-grid">
            {[
              "Dairy",
              "Gluten",
              "Eggs",
              "Nuts",
              "Soy",
              "Fish",
              "Shellfish",
            ].map((allergy) => (
              <label
                key={allergy}
                className={`checkbox-card ${
                  formData.allergies.includes(allergy) ? "selected" : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={formData.allergies.includes(allergy)}
                  onChange={() => handleCheckboxChange("allergies", allergy)}
                />
                <div className="checkbox-content">
                  <div
                    className={`checkbox-box ${
                      formData.allergies.includes(allergy) ? "checked" : ""
                    }`}
                  >
                    {formData.allergies.includes(allergy) && (
                      <Check size={12} color="white" />
                    )}
                  </div>
                  <span>{allergy}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Health Goals */}
        <div className="form-group">
          <label className="group-label">
            Health Goals (Select all that apply)
          </label>
          <div className="checkbox-grid">
            {[
              "Weight management",
              "Balance hormones",
              "Increase energy",
              "Reduce inflammation",
              "Improve insulin sensitivity",
              "Better skin health",
            ].map((goal) => (
              <label
                key={goal}
                className={`checkbox-card ${
                  formData.goals.includes(goal) ? "selected" : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={formData.goals.includes(goal)}
                  onChange={() => handleCheckboxChange("goals", goal)}
                />
                <div className="checkbox-content">
                  <div
                    className={`checkbox-box ${
                      formData.goals.includes(goal) ? "checked" : ""
                    }`}
                  >
                    {formData.goals.includes(goal) && (
                      <Check size={12} color="white" />
                    )}
                  </div>
                  <span>{goal}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
            {loading ? (
              "Generating..."
            ) : (
              <>
                <ChefHat size={20} />
                Generate Plan
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DietPlanForm;
