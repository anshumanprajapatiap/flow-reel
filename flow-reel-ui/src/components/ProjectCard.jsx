import React from "react";
import { useNavigate } from "react-router-dom";
import { Delete } from "lucide-react";
import { deleteProject } from "../api/projectService";

const ProjectCard = ({ project, userId, onDelete }) => {
  const navigate = useNavigate();

  const handleDelete = async (e) => {
    e.stopPropagation(); // prevent navigation
    if (window.confirm(`Delete project "${project.name}"?`)) {
      try {
        await deleteProject(userId, project.id);
        if (onDelete) onDelete(project.id); // optional callback for parent refresh
      } catch (error) {
        alert("Failed to delete project. Check console for details.");
      }
    }
  };

  return (
    <div
      onClick={() => navigate(`/editor/${project.id}`)}
      className="relative p-4 bg-gray-800 rounded-xl cursor-pointer hover:bg-gray-700 hover:shadow-lg transition-all duration-200"
    >
      {/* Delete button (top-right corner) */}
      <button
        onClick={handleDelete}
        className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1 rounded"
      >
        <Delete></Delete>
      </button>

      {/* Thumbnail */}
      <div className="h-36 bg-gray-700 rounded-lg mb-3 flex items-center justify-center text-gray-400 text-sm">
        {project.thumbnail ? (
          <img
            src={project.thumbnail}
            alt={project.name}
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <span>No Preview</span>
        )}
      </div>

      {/* Project Name */}
      <h2 className="text-base font-semibold text-gray-100 truncate">
        {project.name || "Untitled Project"}
      </h2>

      {/* Optional metadata */}
      {project.created_at && (
        <p className="text-xs text-gray-400 mt-1">
          Created on {new Date(project.created_at).toLocaleDateString()}
        </p>
      )}
    </div>
  );
};

export default ProjectCard;