import { useState, useRef } from "react";
import {
  ZoomIn,
  ZoomOut,
  Scissors,
  Star,
  Trash2,
  Crop,
  Copy,
  Volume2,
  Layers,
  Video,
  AudioLines,
  Type,
} from "lucide-react";

export default function Timeline({ onAudioClick }) {
  const [zoom, setZoom] = useState(1);
  const scrollRef = useRef(null);

  const clips = [
    { id: 1, label: "Clip 1", duration: 2.5, thumbnail: "/thumb1.jpg" },
    { id: 2, label: "Clip 2", duration: 1.8, thumbnail: "/thumb2.jpg" },
    { id: 3, label: "Clip 3", duration: 2.7, thumbnail: "/thumb3.jpg" },
    { id: 4, label: "Clip 4", duration: 1.5, thumbnail: "/thumb4.jpg" },
  ];

  const handleZoom = (delta) => {
    setZoom((z) => Math.min(Math.max(z + delta, 0.5), 2));
  };

  const handleAudioTrackClick = (index) => {
    const fakeAudio = {
      id: index,
      name: `Audio Track ${index + 1}`,
      url: `/audio/track${index + 1}.mp3`,
    };
    if (onAudioClick) onAudioClick(fakeAudio);
  };

  return (
    <div className="bg-timeline flex flex-col bg-[#121212] border-t border-gray-800 text-white h-[40vh]">
      {/* Top control bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#1a1a1a] border-b border-gray-800">
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <Layers size={18} /> <span>Timeline</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => handleZoom(-0.1)} className="hover:text-blue-400">
            <ZoomOut size={18} />
          </button>
          <button onClick={() => handleZoom(0.1)} className="hover:text-blue-400">
            <ZoomIn size={18} />
          </button>
        </div>
      </div>

      {/* Ruler */}
      <div className="flex items-center text-[10px] text-gray-400 px-4 py-1 bg-[#181818]">
        {Array.from({ length: 60 }).map((_, i) => (
          <div key={i} className="w-[40px] flex-shrink-0 text-center">
            {i % 5 === 0 ? `${i}s` : ""}
          </div>
        ))}
      </div>

      {/* Scrollable timeline */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-x-auto overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900"
      >
        <div
          className="min-w-[1600px] relative"
          style={{ transform: `scaleX(${zoom})`, transformOrigin: "left center" }}
        >
          {/* Video Tracks */}
          <Track type="video">
            {clips.map((c) => (
              <Clip key={c.id} clip={c} />
            ))}
          </Track>
          <Track type="video">
            {clips.map((c) => (
              <Clip key={c.id} clip={{ ...c, label: "Overlay" }} />
            ))}
          </Track>

          {/* Audio Tracks */}
          <Track
            type="audio"
            waveform
            onClick={() => handleAudioTrackClick(0)}
          />
          <Track
            type="audio"
            waveform
            onClick={() => handleAudioTrackClick(1)}
          />

          {/* Text Track */}
          <Track type="text">
            <div className="bg-yellow-600 text-xs px-2 py-1 rounded">Title Text</div>
          </Track>
          <Track type="text">
            <div className="bg-pink-600 text-xs px-2 py-1 rounded">Subtitles</div>
          </Track>
        </div>
      </div>

      {/* Bottom toolbar */}
      <Toolbar />
    </div>
  );
}

// --- Track Component ---
function Track({ type, children, waveform, onClick }) {
  const getIcon = () => {
    switch (type) {
      case "video":
        return <Video size={16} className="text-blue-400" />;
      case "audio":
        return <AudioLines size={16} className="text-green-400" />;
      case "text":
        return <Type size={16} className="text-pink-400" />;
      default:
        return null;
    }
  };

  return (
    <div
      onClick={onClick}
      className={`bg-panel relative border-b border-gray-800 h-[44px] flex items-center px-3 transition ${
        waveform ? "cursor-pointer hover:bg-[#1f1f1f]" : ""
      }`}
    >
      <div className="w-10 flex items-center justify-center bg-[#1c1c1c] border-r border-gray-700 rounded-l">
        {getIcon()}
      </div>
      <div className="flex-1 flex items-center gap-2 overflow-hidden">
        {waveform ? (
          <div className="flex-1 h-[30px] bg-gradient-to-t from-gray-800 to-gray-700 rounded relative overflow-hidden">
            {/* fake waveform */}
            <div className="absolute inset-0 flex items-end gap-[1px] px-1">
              {Array.from({ length: 120 }).map((_, i) => (
                <div
                  key={i}
                  className="w-[2px] bg-green-500/40 rounded"
                  style={{ height: `${Math.random() * 100}%` }}
                ></div>
              ))}
            </div>
            <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xs opacity-0 hover:opacity-100 transition">
              🎵 Click to Edit Beats
            </div>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}

// --- Clip Component ---
function Clip({ clip }) {
  return (
    <div
      className="relative flex-shrink-0 bg-gray-700 hover:bg-gray-600 rounded-md overflow-hidden cursor-pointer shadow-md"
      style={{ width: `${clip.duration * 120}px`, height: "30px" }}
    >
      <img src={clip.thumbnail} alt="" className="w-full h-full object-cover opacity-70" />
      <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-[9px] px-1 py-[1px] flex justify-between">
        <span>{clip.label}</span>
        <span>{clip.duration.toFixed(2)}s</span>
      </div>
    </div>
  );
}

// --- Toolbar Component ---
function Toolbar() {
  return (
    <div className="flex items-center justify-center gap-8 py-2 bg-[#1a1a1a] border-t border-gray-800 text-gray-300 text-xs">
      <Tool icon={<Scissors size={16} />} label="Trim" />
      <Tool icon={<Star size={16} />} label="FX" />
      <Tool icon={<Copy size={16} />} label="Duplicate" />
      <Tool icon={<Crop size={16} />} label="Crop" />
      <Tool icon={<Trash2 size={16} />} label="Delete" />
      <Tool icon={<Volume2 size={16} />} label="Audio" />
    </div>
  );
}

function Tool({ icon, label }) {
  return (
    <button className="flex flex-col items-center hover:text-blue-400 transition">
      {icon}
      <span className="text-[10px] mt-1">{label}</span>
    </button>
  );
}
