import { useEffect, useState } from "react";
import { Dumbbell, HeartPulse, Activity } from "lucide-react";
import { getWorkoutPlan } from "../api/workoutApi";

const SECTION_META = {
  yoga: {
    icon: HeartPulse,
    color: "bg-pink-100 text-pink-700",
    title: "Yoga & Flexibility",
  },
  strength: {
    icon: Dumbbell,
    color: "bg-purple-100 text-purple-700",
    title: "Strength Training",
  },
  cardio: {
    icon: Activity,
    color: "bg-indigo-100 text-indigo-700",
    title: "Low-Impact Cardio",
  },
};

const WorkoutPlan = () => {
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getWorkoutPlan().then(({ status, result }) => {
      if (status === 200) {
        setPlan(result.data);
      } else {
        setError(result?.message || "Failed to load workout plan");
      }
    });
  }, []);

  if (error) {
    return (
      <div className="max-w-xl mx-auto mt-10 p-4 bg-red-100 text-red-600 rounded-lg text-center">
        {error}
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="text-center mt-10 text-gray-500">
        Loading your personalized workout plan...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl p-6 shadow">
        <h2 className="text-2xl font-bold">
          Your Personalized Workout Plan 💪
        </h2>
        <p className="text-sm mt-1 opacity-90">
          Designed specifically for PCOS-friendly movement & balance
        </p>
      </div>

      {/* WORKOUT SECTIONS */}
      <div className="grid md:grid-cols-3 gap-6">
        {["yoga", "strength", "cardio"].map((type) => {
          const meta = SECTION_META[type];
          const Icon = meta.icon;

          return (
            <div
              key={type}
              className="bg-white rounded-xl shadow-sm border p-5 hover:shadow-md transition"
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`p-2 rounded-lg ${meta.color}`}
                >
                  <Icon size={20} />
                </div>
                <h3 className="font-semibold text-gray-800">
                  {meta.title}
                </h3>
              </div>

              <ul className="space-y-2 text-sm text-gray-600 list-disc pl-5">
                {plan[type].map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* NOTES */}
      {plan.notes?.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
          <h4 className="font-semibold text-blue-700 mb-2">
            🧠 Important Notes
          </h4>
          <ul className="list-disc pl-5 text-sm text-blue-700 space-y-1">
            {plan.notes.map((note, i) => (
              <li key={i}>{note}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default WorkoutPlan;
