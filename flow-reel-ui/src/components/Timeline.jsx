import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Scissors,
  Trash2,
  Crop,
  RotateCcw,
  Music,
  Film,
  Zap,
  Download,
  Copy,
  Lock,
  Key,
  Plus,
} from "lucide-react";

export default function Timeline() {
  const [selectedClip, setSelectedClip] = useState(null);
  const [zoom, setZoom] = useState(1);

  // add more tracks to test vertical scroll
  const tracks = [
    { id: "video", name: "Video Track", type: "video" },
    { id: "audio", name: "Audio Track", type: "audio" },
    { id: "fx", name: "Effects Track", type: "fx" },
    { id: "voice", name: "Voice Track", type: "audio" },
    { id: "overlay", name: "Overlay", type: "video" },
    { id: "caption", name: "Captions", type: "text" },
  ];

  const clips = [
    { id: 1, track: "video", name: "Intro Clip", start: 0, duration: 4 },
    { id: 2, track: "video", name: "Main Scene", start: 5, duration: 6 },
    { id: 3, track: "audio", name: "BGM", start: 0, duration: 10 },
    { id: 4, track: "voice", name: "Narration", start: 3, duration: 5 },
  ];

  const handleSelectClip = (id) => {
    setSelectedClip(selectedClip === id ? null : id);
  };

  const handleAction = (action) => {
    console.log(`Action triggered: ${action} on clip ${selectedClip}`);
  };

  const handleZoom = (dir) => {
    setZoom((z) => Math.max(0.5, Math.min(3, z + dir * 0.25)));
  };

  return (
    <div className="flex flex-col h-screen bg-[#0f0f0f] text-gray-200">
      {/* Timeline Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-800 bg-[#1a1a1a]">
        <h2 className="text-lg font-semibold">🎬 Timeline Editor</h2>
        <div className="flex gap-2">
          <button onClick={() => handleZoom(-1)} className="px-2 py-1 rounded bg-gray-800 hover:bg-gray-700">
            -
          </button>
          <span className="text-sm">{zoom.toFixed(2)}x</span>
          <button onClick={() => handleZoom(1)} className="px-2 py-1 rounded bg-gray-800 hover:bg-gray-700">
            +
          </button>
        </div>
      </div>

      {/* Timeline Tracks */}
      <div className="flex-1 overflow-y-auto overflow-x-auto p-4 space-y-3">
        {tracks.map((track) => (
          <div key={track.id}>
            <div className="text-[11px] uppercase mb-1 text-gray-400 font-medium tracking-wide">
              {track.name}
            </div>
            <div className="relative h-10 bg-gray-900 rounded-md flex items-center px-2 overflow-hidden">
              {/* Track grid */}
              <div className="absolute inset-0 grid grid-cols-20">
                {[...Array(20)].map((_, i) => (
                  <div key={i} className="border-r border-gray-800" />
                ))}
              </div>

              {/* Clips */}
              <div className="relative flex w-full h-full">
                {clips
                  .filter((clip) => clip.track === track.id)
                  .map((clip) => (
                    <motion.div
                      key={clip.id}
                      onClick={() => handleSelectClip(clip.id)}
                      className={`absolute top-1/2 -translate-y-1/2 text-[10px] font-medium cursor-pointer rounded border ${
                        selectedClip === clip.id
                          ? "bg-blue-600 border-blue-400"
                          : "bg-gray-700 border-gray-600 hover:bg-gray-600"
                      }`}
                      style={{
                        left: `${clip.start * 40 * zoom}px`,
                        width: `${clip.duration * 40 * zoom}px`,
                      }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="px-2 py-1 truncate">{clip.name}</div>
                    </motion.div>
                  ))}

                {/* Add clip button */}
                <div className="absolute right-2">
                  <button className="bg-gray-800 hover:bg-gray-700 p-1 rounded-full">
                    <Plus size={12} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Clip Toolbar */}
      <AnimatePresence>
        {selectedClip && (
          <motion.div
            className="fixed bottom-24 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-[#1c1c1c] border border-gray-800 px-6 py-2 rounded-full shadow-lg backdrop-blur-md"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
          >
            <button onClick={() => handleAction("keyframe")}><Key size={18} /></button>
            <button onClick={() => handleAction("beat")}><Zap size={18} /></button>
            <button onClick={() => handleAction("lock")}><Lock size={18} /></button>
            <button onClick={() => handleAction("duplicate")}><Copy size={18} /></button>
            <button onClick={() => handleAction("delete")}><Trash2 size={18} /></button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Persistent Bottom Toolbar */}
      <div className="fixed bottom-0 w-full border-t border-gray-800 bg-[#1a1a1a] py-3 flex justify-around text-sm text-gray-300">
        <ToolbarButton icon={<Scissors size={18} />} label="Trim" onClick={() => handleAction("trim")} />
        <ToolbarButton icon={<Film size={18} />} label="Split" onClick={() => handleAction("split")} />
        <ToolbarButton icon={<Trash2 size={18} />} label="Delete" onClick={() => handleAction("delete")} />
        <ToolbarButton icon={<Crop size={18} />} label="Crop" onClick={() => handleAction("crop")} />
        <ToolbarButton icon={<RotateCcw size={18} />} label="Rotate" onClick={() => handleAction("rotate")} />
        <ToolbarButton icon={<Music size={18} />} label="Audio" onClick={() => handleAction("audio")} />
        <ToolbarButton icon={<Zap size={18} />} label="Speed" onClick={() => handleAction("speed")} />
        <ToolbarButton icon={<Zap size={18} />} label="FX" onClick={() => handleAction("fx")} />
        <ToolbarButton icon={<Download size={18} />} label="Export" onClick={() => handleAction("export")} />
      </div>
    </div>
  );
}

function ToolbarButton({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center hover:text-blue-400 transition"
    >
      {icon}
      <span className="text-[10px] mt-1">{label}</span>
    </button>
  );
}
