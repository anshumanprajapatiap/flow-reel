import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);


  const user = JSON.parse(localStorage.getItem("flowreel_user"));
  const userId = user?.id;

  console.log("User ID:", userId);
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

  // Fetch user projects on load
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(`${API_BASE}/projects/${userId}`);
        const data = await res.json();
        setProjects(data.projects || []);
      } catch (err) {
        setError("Failed to fetch projects");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Handle new project creation
  const handleCreateProject = async () => {
    const name = prompt("Enter new project name:");
    if (!name) return;

    setCreating(true);
    try {
      const formData = new FormData();
      formData.append("user_id", userId);
      formData.append("project_name", name);

      const res = await fetch(`${API_BASE}/projects/create`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to create project");

      const data = await res.json();
      setProjects((prev) => [...prev, data.project_id]);
      navigate(`/editor/${data.project_id}`);
    } catch (err) {
      console.error(err);
      setError("Could not create project");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">🎬 BeatForge Projects</h1>
        <button
          className={`bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 ${
            creating ? "opacity-60 cursor-wait" : ""
          }`}
          onClick={handleCreateProject}
          disabled={creating}
        >
          {creating ? "Creating..." : "+ New Project"}
        </button>
      </div>

      {/* Loading & Error States */}
      {loading ? (
        <p className="text-gray-400">Loading projects...</p>
      ) : error ? (
        <p className="text-red-400">{error}</p>
      ) : projects.length === 0 ? (
        <p className="text-gray-400">No projects yet. Create your first project!</p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {projects.map((projectId) => (
            <div
              key={projectId}
              onClick={() => navigate(`/editor/${projectId}`)}
              className="p-4 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition"
            >
              <div className="h-32 bg-gray-700 rounded mb-3"></div>
              <h2 className="text-lg font-semibold">{projectId}</h2>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
