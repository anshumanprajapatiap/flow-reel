const API_URL = import.meta.env.VITE_API_URL;
const PROJECT_URL = `${API_URL}/project`;

/**
 * Create a new project for a user
 */
export async function createProject(userId, projectName, projectId = null) {
  const formData = new FormData();
  formData.append("user_id", userId);
  formData.append("project_name", projectName);
  if (projectId) formData.append("project_id", projectId);

  const res = await fetch(`${PROJECT_URL}/`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Failed to create project");
  return await res.json();
}

/**
 * Add audio metadata to a project
 */
export async function addAudioToProject(userId, projectId, audioMeta) {
  const formData = new FormData();
  formData.append("file_name", audioMeta.file_name);
  formData.append("start", audioMeta.start);
  formData.append("end", audioMeta.end);
  formData.append("duration", audioMeta.duration);
  formData.append("beats", JSON.stringify(audioMeta.beats || []));
  if (audioMeta.file_id) formData.append("file_id", audioMeta.file_id);

  const res = await fetch(`${PROJECT_URL}/${userId}/${projectId}/add-audio`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Failed to add audio to project");
  return await res.json();
}

/**
 * Get all projects for a user
 */
export async function listUserProjects(userId) {
  const res = await fetch(`${PROJECT_URL}/${userId}`, { method: "GET" });
  if (!res.ok) throw new Error("Failed to fetch user projects");
  return await res.json();
}

/**
 * Get details for a single project
 */
export async function getProjectDetails(userId, projectId) {
  const res = await fetch(`${PROJECT_URL}/${userId}/${projectId}`, { method: "GET" });
  if (!res.ok) throw new Error("Failed to fetch project details");
  return await res.json();
}


/**
 * Delete a project
 */
export async function deleteProject(userId, projectId) {
  const res = await fetch(`${PROJECT_URL}/${userId}/${projectId}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Failed to delete project");
  return await res.json();
}