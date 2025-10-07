import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";

import ProjectCard from "../components/ProjectCard";

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
    <div>
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b-gray-800">
        <div onClick={() => navigate(`/`)}>
          <h1 className="text-2xl font-bold cursor-pointer">🎬 Flow Reel</h1>
        </div>
        
        <div className="flex justify-between gap-5">
            <button
              className={`bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 ${
                creating ? "opacity-60 cursor-wait" : ""
              }`}
              onClick={handleCreateProject}
              disabled={creating}
            >
              {creating ? "Creating..." : "+ New Project"}
            </button>

            <button className="flex items-center gap-1 px-3 py-1 bg-red-600 rounded hover:bg-red-700 text-sm"
              onClick={ () => navigate("/") }
            >
              <User size={16} /> Logout
            </button>
        </div>
        
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
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
    {/* 🌙 Bottom Bar */}
      <footer className="w-full mt-6 border-t border-gray-800 bg-[#111] py-3 flex items-center justify-between text-sm text-gray-400 px-6">
        <p>🎬 Flow Reel — Built for learning & creativity</p>

        <div className="flex items-center gap-4">
          <a
            href="https://github.com/anshumanprajapatiap"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition"
          >
            GitHub
          </a>
          <a
            href="https://x.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition"
          >
            Twitter
          </a>
          <a
            href="https://www.linkedin.com/in/anshumanprajapatiap/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition"
          >
            LinkedIn
          </a>
        </div>
      </footer>
    </div>
  );
}