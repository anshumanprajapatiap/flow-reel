import { useState, useEffect, useRef } from "react";
import {
  Film,
  Layers,
  Type,
  Music,
  AudioLines,
  ChevronDown,
  UploadCloud,
  Wand2,
} from "lucide-react";
import MediaFiles from "./MediaFiles";
import { Button } from "./ui/button";

export default function SidebarLeft({ userId, projectId }) {
  const [activeTab, setActiveTab] = useState("stocks");
  const [mediaList, setMediaList] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleDragStart = (e, media) => {
    e.dataTransfer.setData('application/json', JSON.stringify({
      id: media.id,
      type: media.type,
      src: media.url,
      name: media.name,
      duration: media.duration || 5,
    }));
  };

  // Refs for file inputs (so we can trigger them from buttons)
  const videoInputRef = useRef(null);
  const audioInputRef = useRef(null);

  // ✅ Fetch existing media
  useEffect(() => {
    if (!userId) return;

    const fetchMedia = async () => {
      try {
        const url = `http://localhost:8000/media?user_id=${userId}${
          projectId ? `&project_id=${projectId}` : ""
        }`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        setMediaList(data);
      } catch (err) {
        console.error("🔥 Error fetching media:", err);
      }
    };

    fetchMedia();
  }, [userId, projectId]);

  // ✅ Upload file
  const handleUpload = async (file, type) => {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("user_id", userId);
      formData.append("project_id", projectId || "");
      formData.append("type", type);

      const res = await fetch("http://localhost:8000/media/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setMediaList((prev) => [...prev, data]);
    } catch (err) {
      alert(`Failed to upload: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  // ✅ Delete single media item
  const deleteMedia = async (mediaId) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;

    try {
      const res = await fetch(`http://localhost:8000/media/${mediaId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(await res.text());
      await res.json();
      setMediaList((prev) => prev.filter((m) => m.id !== mediaId));
    } catch (err) {
      alert("Failed to delete: " + err.message);
    }
  };

  // ✅ Cleanup all media
  const cleanupUserMedia = async () => {
    if (!window.confirm("⚠️ Delete all your uploaded media?")) return;
    try {
      const res = await fetch(
        `http://localhost:8000/media/user/${userId}/cleanup`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error(await res.text());
      await res.json();
      setMediaList([]);
    } catch (err) {
      alert("Cleanup failed: " + err.message);
    }
  };

  // ✅ Handle file input selection
  const handleFileSelect = (e, type) => {
    const file = e.target.files[0];
    if (file) handleUpload(file, type);
    e.target.value = ""; // reset input
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

      {/* Header */}
      <div className="flex justify-between items-center px-3 py-2 bg-[#181818] border-b border-gray-800">
        <div className="font-medium text-sm">My Stock</div>
        <button className="flex items-center gap-1 text-gray-300 bg-gray-800 px-2 py-1 rounded hover:bg-gray-700 text-xs">
          All <ChevronDown size={12} />
        </button>
      </div>

      {/* Media Grid */}
      <MediaFiles
        mediaFiles={mediaList}
        uploading={uploading}
        onDelete={deleteMedia} // ✅ connect delete handler
      />

      {/* Footer Buttons */}
      <div className="p-3 border-t border-gray-800 bg-[#181818] flex items-center justify-between gap-3">
        {/* Upload Video */}
        <Button
          variant="ghost"
          className="flex flex-col items-center gap-1 text-xs text-gray-300 hover:bg-gray-700 transition w-16 h-18"
          onClick={() => videoInputRef.current.click()}
        >
          <UploadCloud size={18} />
          <span>Video</span>
        </Button>
        <input
          type="file"
          ref={videoInputRef}
          accept="video/*"
          className="hidden"
          onChange={(e) => handleFileSelect(e, "video")}
        />

        {/* Upload Audio */}
        <Button
          variant="ghost"
          className="flex flex-col items-center gap-1 text-xs text-gray-300 hover:bg-gray-700 transition w-16 h-18"
          onClick={() => audioInputRef.current.click()}
        >
          <Music size={18} />
          <span>Audio</span>
        </Button>
        <input
          type="file"
          ref={audioInputRef}
          accept="audio/*"
          className="hidden"
          onChange={(e) => handleFileSelect(e, "audio")}
        />

        {/* Cleanup All */}
        <Button
          variant="ghost"
          className="flex flex-col items-center gap-1 text-xs text-gray-300 hover:bg-gray-700 transition w-16 h-18"
          onClick={cleanupUserMedia}
        >
          <Wand2 size={18} />
          <span>Clean</span>
        </Button>
      </div>
    </div>
  );
}
