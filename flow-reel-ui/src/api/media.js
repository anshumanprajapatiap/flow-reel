const API_URL = import.meta.env.VITE_API_URL;

const MEDIA_URL = `${API_URL}/media`;


/**
 * ✅ Fetch media — supports:
 * - all media
 * - user-specific
 * - project-specific
 */
export async function fetchMedia({ userId, projectId } = {}) {
  try {
    let url = `${MEDIA_URL}`;
    const params = new URLSearchParams();

    if (userId) params.append("user_id", userId);
    if (projectId) params.append("project_id", projectId);

    if (params.toString()) url += `?${params.toString()}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch media: ${response.statusText}`);

    return await response.json();
  } catch (err) {
    console.error("❌ fetchMedia error:", err);
    throw err;
  }
}


/**
 * ✅ Upload media file
 * @param {File} file - The media file
 * @param {string} userId
 * @param {"audio"|"video"|"image"} type
 * @param {string} [projectId]
 */
export async function uploadMedia({ file, userId, type, projectId = null }) {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("user_id", userId);
    formData.append("type", type);
    if (projectId) formData.append("project_id", projectId);

    const response = await fetch(`${MEDIA_URL}`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error(`Upload failed: ${response.statusText}`);
    return await response.json();
  } catch (err) {
    console.error("❌ uploadMedia error:", err);
    throw err;
  }
}


/**
 * ✅ Delete a single media file
 * @param {number} mediaId
 */
export async function deleteMedia(mediaId) {
  try {
    const response = await fetch(`${MEDIA_URL}/${mediaId}`, { method: "DELETE" });
    if (!response.ok) throw new Error(`Failed to delete media ${mediaId}`);
    return await response.json();
  } catch (err) {
    console.error("❌ deleteMedia error:", err);
    throw err;
  }
}

/**
 * ✅ Cleanup all user media
 * @param {string} userId
 */
export async function cleanupUserMedia(userId) {
  try {
    const response = await fetch(`${MEDIA_URL}/user/${userId}/cleanup`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error(`Failed to cleanup media for user ${userId}`);
    return await response.json();
  } catch (err) {
    console.error("❌ cleanupUserMedia error:", err);
    throw err;
  }
}

/**
 * ✅ Get media file URL for playback
 * This returns a direct link usable in <video> / <audio> tags.
 */
export function getMediaUrl(userId, filePath) {
  const params = new URLSearchParams({ user_id: userId, path: filePath });
  return `${MEDIA_URL}?${params.toString()}`;
}
