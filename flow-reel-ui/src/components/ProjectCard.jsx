import React from "react";
import { useNavigate } from "react-router-dom";

const ProjectCard = ({ project }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/editor/${project.id}`)}
      className="p-4 bg-gray-800 rounded-xl cursor-pointer hover:bg-gray-700 hover:shadow-lg transition-all duration-200"
    >
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