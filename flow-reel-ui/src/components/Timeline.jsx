import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import WaveSurfer from "wavesurfer.js";
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
  Play,
  Pause,
  Type,
  Layers,
} from "lucide-react";
import { useTimeline } from "../context/TimelineContext";
import { cn } from "../utils/cn";

export default function Timeline() {
  const {
    tracks,
    currentTime,
    duration,
    isPlaying,
    selectedClipId,
    addClip,
    removeClip,
    updateClip,
    setCurrentTime,
    setDuration,
    setPlaying,
    selectClip,
  } = useTimeline();

  const [zoom, setZoom] = useState(1);
  const [beats, setBeats] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
  
  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);
  const timelineRef = useRef(null);

  // Get the active audio clip URL from audio tracks
  const activeAudioUrl = React.useMemo(() => {
    for (const track of tracks) {
      if (track.type === 'audio' && track.clips.length > 0) {
        const activeClip = track.clips.find(clip => clip.id === selectedClipId);
        if (activeClip) {
          return activeClip.src;
        }
        // If no selected clip, return the first audio clip's URL
        return track.clips[0].src;
      }
    }
    return null;
  }, [tracks, selectedClipId]);

  // Initialize WaveSurfer
  useEffect(() => {
    if (!waveformRef.current) return;

    wavesurfer.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: '#4a5568',
      progressColor: '#6366f1',
      cursorColor: '#ef4444',
      height: 80,
      normalize: true,
      responsive: true,
      interact: true,
    });

    // Only load audio if we have an active audio URL
    if (activeAudioUrl) {
      wavesurfer.current.load(activeAudioUrl);
    }

    wavesurfer.current.on('ready', () => {
      setDuration(wavesurfer.current.getDuration());
    });

    wavesurfer.current.on('audioprocess', (time) => {
      setCurrentTime(time);
    });

    wavesurfer.current.on('seek', (progress) => {
      setCurrentTime(progress * wavesurfer.current.getDuration());
    });

    return () => {
      wavesurfer.current.destroy();
    };
  }, [activeAudioUrl, setDuration, setCurrentTime]);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (timelineRef.current) {
      const timelineRect = timelineRef.current.getBoundingClientRect();
      const relativeX = e.clientX - timelineRect.left;
      const time = (relativeX / timelineRect.width) * duration * zoom;
      // Update ghost preview position
    }
  };

  const handleDrop = (e, trackId) => {
    e.preventDefault();
    if (!draggedItem) return;

    const timelineRect = timelineRef.current.getBoundingClientRect();
    const relativeX = e.clientX - timelineRect.left;
    const dropTime = (relativeX / timelineRect.width) * duration * zoom;

    const newClip = {
      id: Date.now().toString(),
      type: draggedItem.type,
      src: draggedItem.src,
      start: Math.max(0, dropTime),
      duration: draggedItem.duration || 5, // Default duration if not provided
      name: draggedItem.name || 'New Clip',
    };

    addClip(trackId, newClip);
    setDraggedItem(null);
  };

  const clips = [
    { id: 1, track: "video", name: "Intro Clip", start: 0, duration: 4 },
    { id: 2, track: "video", name: "Main Scene", start: 5, duration: 6 },
    { id: 3, track: "audio", name: "BGM", start: 0, duration: 10 },
    { id: 4, track: "voice", name: "Narration", start: 3, duration: 5 },
  ];

  const handleSelectClip = (id) => {
    selectClip(id);
  };

  const handlePlayPause = () => {
    if (!wavesurfer.current) return;
    wavesurfer.current.playPause();
    setIsPlaying(!isPlaying);
  };

  const handleAction = (action) => {
    console.log(`Action triggered: ${action} on clip ${selectedClipId}`);
    switch (action) {
      case 'beat':
        if (wavesurfer.current) {
          const currentTime = wavesurfer.current.getCurrentTime();
          setBeats([...beats, currentTime].sort((a, b) => a - b));
        }
        break;
      default:
        break;
    }
  };

  const handleZoom = (dir) => {
    setZoom((z) => Math.max(0.5, Math.min(3, z + dir * 0.25)));
  };

  return (
    <div className="flex flex-col h-screen bg-[#0f0f0f] text-gray-200">
      {/* Timeline Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-800 bg-[#1a1a1a]">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold">🎬 Timeline Editor</h2>
          <button
            onClick={handlePlayPause}
            className="p-2 rounded-full bg-blue-600 hover:bg-blue-700"
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <div className="text-sm font-mono">
            {Math.floor(currentTime / 60)}:
            {Math.floor(currentTime % 60).toString().padStart(2, '0')} /
            {Math.floor(duration / 60)}:
            {Math.floor(duration % 60).toString().padStart(2, '0')}
          </div>
        </div>
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

      {/* Waveform */}
      <div className="px-6 py-4 border-b border-gray-800 bg-[#1a1a1a]">
        {activeAudioUrl ? (
          <>
            <div ref={waveformRef} className="w-full"></div>
            {/* Beat Markers */}
            <div className="relative h-4 mt-2">
              {beats.map((time, index) => (
                <div
                  key={index}
                  className="absolute w-0.5 h-full bg-red-500"
                  style={{
                    left: `${(time / duration) * 100}%`,
                  }}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="w-full h-20 flex items-center justify-center text-gray-500">
            No audio track selected. Drag an audio file to the timeline.
          </div>
        )}
      </div>

      {/* Timeline Tracks */}
      <div 
        ref={timelineRef}
        className="flex-1 overflow-y-auto overflow-x-auto p-4 space-y-3"
        onDragOver={handleDragOver}
      >
        {tracks.map((track) => (
          <div key={track.id}>
            <div className="text-[11px] uppercase mb-1 text-gray-400 font-medium tracking-wide flex items-center gap-2">
              {track.type === 'video' && <Film size={14} />}
              {track.type === 'audio' && <Music size={14} />}
              {track.type === 'text' && <Type size={14} />}
              {track.type === 'vfx' && <Layers size={14} />}
              {track.name}
            </div>
            <div 
              className="relative h-10 bg-gray-900 rounded-md flex items-center px-2 overflow-hidden"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, track.id)}
            >
              {/* Track grid */}
              <div className="absolute inset-0 grid grid-cols-20">
                {[...Array(20)].map((_, i) => (
                  <div key={i} className="border-r border-gray-800" />
                ))}
              </div>

              {/* Clips */}
              <div className="relative flex w-full h-full">
                {track.clips.map((clip) => (
                  <motion.div
                    key={clip.id}
                    onClick={() => selectClip(clip.id)}
                    className={cn(
                      "absolute top-1/2 -translate-y-1/2 text-[10px] font-medium cursor-pointer rounded border",
                      {
                        "bg-blue-600 border-blue-400": selectedClipId === clip.id,
                        "bg-gray-700 border-gray-600 hover:bg-gray-600": selectedClipId !== clip.id,
                        "bg-purple-700": clip.type === 'video',
                        "bg-green-700": clip.type === 'audio',
                        "bg-yellow-700": clip.type === 'text',
                        "bg-red-700": clip.type === 'vfx',
                      }
                    )}
                    style={{
                      left: `${clip.start * 40 * zoom}px`,
                      width: `${clip.duration * 40 * zoom}px`,
                    }}
                    whileHover={{ scale: 1.02 }}
                    draggable={true}
                    onDragStart={(e) => {
                      e.dataTransfer.setData('text/plain', clip.id);
                      selectClip(clip.id);
                    }}
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
        {selectedClipId && (
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
