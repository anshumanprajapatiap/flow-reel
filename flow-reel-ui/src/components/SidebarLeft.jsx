import { useState, useEffect } from "react";
import {
  Film,
  Layers,
  Type,
  Music,
  AudioLines,
  ChevronDown,
  Folder,
  UploadCloud,
} from "lucide-react";

export default function SidebarLeft({ userId, projectId }) {
  const [activeTab, setActiveTab] = useState("stocks");
  const [activeFolder, setActiveFolder] = useState("My Stock");
  const [mediaList, setMediaList] = useState([]);
  const [uploading, setUploading] = useState(false);

  // ✅ Fetch existing media for user/project
  useEffect(() => {
    if (!userId) return;
    fetch(
      `http://localhost:8000/media?user_id=${userId}${
        projectId ? `&project_id=${projectId}` : ""
      }`
    )
      .then((res) => res.json())
      .then((data) => setMediaList(data))
      .catch((err) => console.error("Error fetching media:", err));
  }, [userId, projectId]);

  // ✅ Handle uploads
  const handleUpload = async (file, type) => {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("user_id", userId);
      formData.append("project_id", projectId || "");
      formData.append("media_type", type);

      const res = await fetch("http://localhost:8000/media/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setMediaList((prev) => [...prev, data]);
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  // ✅ File selection handler (reset input value after upload)
  const handleFileSelect = (e, type) => {
    const file = e.target.files[0];
    if (file) handleUpload(file, type);
    e.target.value = ""; // reset input for next upload
  };

  return (
    <div className="bg-[#1a1a1a] text-white flex flex-col border-r border-gray-800 w-72 select-none">
      {/* Tabs */}
      <div className="flex justify-around border-b border-gray-800 py-2 bg-[#202020]">
        {[
          { key: "stocks", icon: <Film size={16} />, label: "Stocks" },
          { key: "elements", icon: <Layers size={16} />, label: "Elements" },
          { key: "text", icon: <Type size={16} />, label: "Text" },
          { key: "music", icon: <Music size={16} />, label: "Music" },
          { key: "soundfx", icon: <AudioLines size={16} />, label: "Sound FX" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex flex-col items-center text-xs ${
              activeTab === tab.key
                ? "text-blue-400"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            {tab.icon}
            <span className="mt-1">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Folder Section */}
      <div className="p-3 border-b border-gray-800">
        <h3 className="text-sm font-semibold text-gray-300 mb-2">Library</h3>
        <button
          className={`flex items-center gap-2 px-2 py-1 rounded ${
            activeFolder === "My Stock"
              ? "bg-blue-600 text-white"
              : "text-gray-400 hover:text-white"
          }`}
          onClick={() => setActiveFolder("My Stock")}
        >
          <Folder size={14} /> My Stock
        </button>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center px-3 py-2 bg-[#181818] border-b border-gray-800">
        <div className="font-medium text-sm">My Stock</div>
        <button className="flex items-center gap-1 text-gray-300 bg-gray-800 px-2 py-1 rounded hover:bg-gray-700 text-xs">
          All <ChevronDown size={12} />
        </button>
      </div>

      {/* Media Grid */}
      <div className="flex-1 overflow-y-auto p-3 grid grid-cols-2 gap-3 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
        {mediaList.length === 0 && !uploading && (
          <div className="text-center text-gray-500 text-sm col-span-2">
            No media yet
          </div>
        )}

        {uploading && (
          <div className="col-span-2 text-center text-blue-400 text-sm animate-pulse">
            Uploading...
          </div>
        )}

        {mediaList.map((m) => (
          <div
            key={m.id}
            className="relative rounded overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-500 transition"
          >
            {m.media_type === "audio" ? (
              <div className="flex flex-col items-center justify-center bg-gray-800 h-28 text-gray-300">
                <AudioLines size={22} />
                <p className="text-[10px] mt-1 truncate w-full text-center px-1">
                  {m.file_name}
                </p>
              </div>
            ) : (
              <video
                src={`http://localhost:8000/${m.file_path}`}
                className="w-full h-28 object-cover opacity-90"
                muted
              />
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-[10px] px-1 py-0.5 truncate">
              {m.file_name}
            </div>
          </div>
        ))}
      </div>

      {/* Upload Buttons */}
      <div className="p-3 border-t border-gray-800 flex flex-col gap-2 bg-[#181818]">
        <label className="w-full bg-blue-600 py-1.5 rounded text-sm text-center hover:bg-blue-700 cursor-pointer flex items-center justify-center gap-1 transition">
          <UploadCloud size={14} /> Upload Video
          <input
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(e) => handleFileSelect(e, "video")}
          />
        </label>

        <label className="w-full bg-green-600 py-1.5 rounded text-sm text-center hover:bg-green-700 cursor-pointer flex items-center justify-center gap-1 transition">
          <UploadCloud size={14} /> Upload Audio
          <input
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={(e) => handleFileSelect(e, "audio")}
          />
        </label>
      </div>
    </div>
  );
}
