// const API_URL = import.meta.env.VITE_API_URL;
const API_URL = "http://localhost:8000";


export async function uploadAudio(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("project_id", "wedding_project_001");
  const res = await fetch(`${API_URL}/audio/upload`, {
    method: "POST",
    body: formData,
  });
  const data = await res.json();
  console.log("Upload response:", data);
  return data;
}

export async function getBeats(fileId, mode = "auto") {
  const res = await fetch(`${API_URL}/audio/${fileId}/beats?mode=${mode}`);
  return res.json();
}

export async function saveManualBeats(fileId, beats) {
  const res = await fetch(`${API_URL}/audio/${fileId}/beats/manual`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(beats),
  });
  return res.json();
}
