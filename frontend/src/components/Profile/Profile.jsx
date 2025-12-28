import React, { useState, useEffect } from "react";
import { bodyProfileService } from "../../services/api";
import "./Profile.css";

const Profile = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    height: "",
    bodyType: "",
    style: "",
    goals: ""
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Prevent unauthorized request during first mount
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await bodyProfileService.getProfile();

        if (res.data?.success && res.data?.data) {
          const profile = res.data.data;

          setFormData({
            name: profile.userId?.name || "",
            email: profile.userId?.email || "",
            age: profile.userId?.age || "",
            height: profile.measurements?.height || "",
          
            bodyType: typeof profile.bodyShape === "string"
              ? profile.bodyShape
              : (Array.isArray(profile.bodyShape)
                  ? profile.bodyShape[0] || ""
                  : ""),
          
            style: typeof profile.preferences?.style === "string"
              ? profile.preferences.style
              : (Array.isArray(profile.preferences?.style)
                  ? profile.preferences.style[0] || ""
                  : ""),
          
            goals: profile.preferences?.goals || ""
          });
          
        }
      } catch (err) {
        console.log(
          "Error fetching profile",
          err?.response?.data || err.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const onSave = async () => {
    try {
      await bodyProfileService.createProfile({
        measurements: { height: formData.height },
        bodyShape: formData.bodyType,
        preferences: {
          style: formData.style,
          goals: formData.goals
        }
      });

      setMessage("Profile saved successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.log("Save error:", err?.response?.data || err);
      setMessage("Error saving profile");
    }
  };

  // UX: avoid flashing empty form while loading
  if (loading) {
    return <p style={{ padding: "20px" }}>Loading profile…</p>;
  }

  return (
    <div className="profile">
      <div className="profile-header">
        <h2>Your Profile</h2>
        <p className="text-muted">
          Personalize your experience and track your wellness journey
        </p>
      </div>

      <div className="grid grid-2 profile-grid">
        {/* LEFT COLUMN — PERSONAL INFO */}
        <div className="card">
          <div className="section-title">
            <span className="icon purple">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </span>
            <div>
              <h3>Personal Information</h3>
              <p className="text-muted">Your basic details</p>
            </div>
          </div>

          <div className="form-container">
            <div className="form-group-custom">
              <label>Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group-custom">
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group-custom">
              <label>Age</label>
              <input
                type="number"
                name="age"
                placeholder="Enter your age"
                value={formData.age}
                onChange={handleChange}
              />
            </div>

            <div className="form-group-custom">
              <label>Height (optional)</label>
              <input
                type="text"
                name="height"
                placeholder="e.g., 5ft 6in or 168cm"
                value={formData.height}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN — PREFERENCES */}
        <div className="card">
          <div className="section-title">
            <span className="icon pink">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <circle cx="12" cy="12" r="6"></circle>
                <circle cx="12" cy="12" r="2"></circle>
              </svg>
            </span>
            <div>
              <h3>Preferences & Goals</h3>
              <p className="text-muted">Customize your experience</p>
            </div>
          </div>

          <div className="form-container">
            <div className="form-group-custom">
              <label>Body Type</label>
              <select
                name="bodyType"
                value={formData.bodyType}
                onChange={handleChange}
              >
                <option value="">Select your body type</option>
                <option value="Hourglass">Hourglass</option>
                <option value="Pear">Pear</option>
                <option value="Apple">Apple</option>
                <option value="Rectangle">Rectangle</option>
                <option value="Inverted Triangle">Inverted Triangle</option>
              </select>
            </div>

            <div className="form-group-custom">
              <label>Preferred Style</label>
              <select
                name="style"
                value={formData.style}
                onChange={handleChange}
              >
                <option value="">Select your style</option>
                <option value="Casual">Casual</option>
                <option value="Professional">Professional</option>
                <option value="Elegant">Elegant</option>
                <option value="Minimalist">Minimalist</option>
                <option value="Athleisure">Athleisure</option>
              </select>
            </div>

            <div className="form-group-custom">
              <label>Wellness Goals</label>
              <textarea
                name="goals"
                placeholder="What are your wellness goals?"
                value={formData.goals}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
      </div>

      {/* INFO CARD */}
      <div className="about-section card">
        <h3>About PCOSync</h3>
        <p>
          PCOSync helps you manage symptoms while celebrating your body through
          personalized wellness & fashion insights.
        </p>
      </div>

      {/* SUCCESS / ERROR MESSAGE */}
      {message && (
        <p className={`message ${message.includes("Error") ? "error" : "success"}`}>
          {message}
        </p>
      )}

      {/* BUTTONS */}
      <div className="profile-actions">
        <button className="btn btn-secondary" onClick={() => window.location.reload()}>
          Reset
        </button>

        <button className="btn btn-primary" onClick={onSave}>
          Save Profile
        </button>
      </div>
    </div>
  );
};

export default Profile;
