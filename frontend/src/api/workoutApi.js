export async function getWorkoutPlan() {
    const token = localStorage.getItem("token");
  
    const res = await fetch(
      "http://localhost:5000/api/workouts/plan",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  
    const result = await res.json();
    return { status: res.status, result };
  }
  