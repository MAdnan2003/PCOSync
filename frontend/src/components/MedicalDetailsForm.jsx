import React, { useEffect, useState } from "react";
import {
  createMedicalDetails,
  getMyMedicalDetails,
} from "../api/medicalDetailsApi";

const PCOS_TYPES = [
  "Insulin-Resistant PCOS",
  "Inflammatory PCOS",
  "Post-Pill PCOS",
  "Adrenal PCOS",
  "Unknown / Not diagnosed yet",
];

const SYMPTOMS_LIST = [
  "Irregular periods",
  "Acne",
  "Hair loss",
  "Weight gain",
  "Fatigue",
  "Mood changes",
  "Sugar cravings",
];

const EXERCISE_LEVELS = ["Sedentary", "Light", "Moderate", "Intense"];
const DIET_TYPES = ["Balanced", "Low-carb", "High-protein", "Vegetarian", "Vegan", "Other"];
const STRESS_LEVELS = ["Low", "Medium", "High"];
const SMOKING_STATUS = ["Non-smoker", "Occasional", "Regular"];

function MedicalDetailsForm() {
  const [form, setForm] = useState({
    weight: "",
    height: "",
    pcosType: "",
    symptoms: [],
    exerciseLevel: "",
    dietType: "",
    stressLevel: "",
    smokingStatus: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 🔁 Load existing data
  useEffect(() => {
    getMyMedicalDetails().then((res) => {
      if (res?.data) setForm(res.data);
    });
  }, []);

  const toggleSymptom = (symptom) => {
    setForm((prev) => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter((s) => s !== symptom)
        : [...prev.symptoms, symptom],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await createMedicalDetails(form);
      setMessage(res.message);
    } catch {
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-4">
      <h4>Medical Details</h4>

      {message && <div className="alert alert-info">{message}</div>}

      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-2"
          type="number"
          placeholder="Weight (kg)"
          value={form.weight}
          onChange={(e) => setForm({ ...form, weight: e.target.value })}
        />

        <input
          className="form-control mb-2"
          type="number"
          placeholder="Height (cm)"
          value={form.height}
          onChange={(e) => setForm({ ...form, height: e.target.value })}
        />

        <select
          className="form-select mb-2"
          value={form.pcosType}
          onChange={(e) => setForm({ ...form, pcosType: e.target.value })}
        >
          <option value="">Select PCOS Type</option>
          {PCOS_TYPES.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>

        <h6>Symptoms</h6>
        {SYMPTOMS_LIST.map((s) => (
          <div key={s}>
            <input
              type="checkbox"
              checked={form.symptoms.includes(s)}
              onChange={() => toggleSymptom(s)}
            />{" "}
            {s}
          </div>
        ))}

        <select
          className="form-select mt-2"
          value={form.exerciseLevel}
          onChange={(e) => setForm({ ...form, exerciseLevel: e.target.value })}
        >
          <option value="">Exercise Level</option>
          {EXERCISE_LEVELS.map((l) => (
            <option key={l}>{l}</option>
          ))}
        </select>

        <select
          className="form-select mt-2"
          value={form.dietType}
          onChange={(e) => setForm({ ...form, dietType: e.target.value })}
        >
          <option value="">Diet Type</option>
          {DIET_TYPES.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>

        <select
          className="form-select mt-2"
          value={form.stressLevel}
          onChange={(e) => setForm({ ...form, stressLevel: e.target.value })}
        >
          <option value="">Stress Level</option>
          {STRESS_LEVELS.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>

        <select
          className="form-select mt-2"
          value={form.smokingStatus}
          onChange={(e) => setForm({ ...form, smokingStatus: e.target.value })}
        >
          <option value="">Smoking Status</option>
          {SMOKING_STATUS.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>

        <button className="btn btn-primary mt-3" disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
}

export default MedicalDetailsForm;
