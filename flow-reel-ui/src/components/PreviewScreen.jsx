import { useState, useRef } from "react";
import { Maximize2, Minimize2, Play, Pause } from "lucide-react";

export default function PreviewScreen() {
  const [aspect, setAspect] = useState("9:16");
  const [playing, setPlaying] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const videoRef = useRef(null);

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;
    if (playing) video.pause();
    else video.play();
    setPlaying(!playing);
  };

  const toggleFullscreen = () => {
    if (!fullscreen) videoRef.current.requestFullscreen();
    else document.exitFullscreen();
    setFullscreen(!fullscreen);
  };

  const aspectStyles = {
    "9:16": "aspect-[9/16] h-[80%]",
    "1:1": "aspect-square h-[70%]",
    "16:9": "aspect-video h-[70%]",
    "3:2": "aspect-[3/2] h-[70%]",
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-black border-b border-gray-800 relative">
      {/* Video Container */}
      <div className={`relative ${aspectStyles[aspect]} bg-black rounded-lg overflow-hidden shadow-lg`}>
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          src="/sample-preview.mp4"
          onClick={handlePlayPause}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        />

        {/* Overlay Play Button */}
        {!playing && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer"
            onClick={handlePlayPause}
          >
            <Play size={48} className="text-white opacity-80 hover:opacity-100" />
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-4 flex items-center justify-between w-[60%] bg-gray-900/80 text-white px-4 py-2 rounded-lg backdrop-blur-md">
        {/* Left: Time Info */}
        <div className="text-xs text-gray-300">
          <b>0.18s</b> / 27.6s
        </div>

        {/* Center: Aspect Ratio Selector */}
        <select
          value={aspect}
          onChange={(e) => setAspect(e.target.value)}
          className="bg-gray-800 text-gray-200 text-xs rounded px-2 py-1 focus:outline-none"
        >
          <option value="9:16">9:16</option>
          <option value="16:9">16:9</option>
          <option value="3:2">3:2</option>
          <option value="1:1">1:1</option>
        </select>

        {/* Right: Fullscreen Button */}
        <button
          onClick={toggleFullscreen}
          className="hover:text-blue-400 transition"
        >
          {fullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>
      </div>
    </div>
  );
}
