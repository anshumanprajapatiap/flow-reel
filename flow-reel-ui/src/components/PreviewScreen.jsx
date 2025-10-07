import { useState, useEffect } from "react";
import { Maximize2, Minimize2, Play, Pause } from "lucide-react";

export default function PreviewScreen({ videoRef, isPlaying, setIsPlaying }) {
  const [aspect, setAspect] = useState("9:16");
  const [fullscreen, setFullscreen] = useState(false);

  // local playing state is driven by parent isPlaying; keep local for overlay UI
  useEffect(() => {
    // keep DOM in sync
    const video = videoRef?.current;
    if (!video) return;
    if (isPlaying) video.play().catch(() => {});
    else video.pause();
  }, [isPlaying, videoRef]);

  const handlePlayPause = () => {
    setIsPlaying((p) => !p);
  };

  const toggleFullscreen = () => {
    const el = videoRef?.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.();
      setFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setFullscreen(false);
    }
  };

  const aspectStyles = {
    "9:16": "aspect-[9/16] h-[78%]",
    "1:1": "aspect-square h-[68%]",
    "16:9": "aspect-video h-[68%]",
    "3:2": "aspect-[3/2] h-[68%]",
  };


  return (
     <div className="flex-1 flex flex-col items-center justify-center bg-gray border-b border-gray-800 relative">
      <div className={`relative max-w-3xl ${aspectStyles[aspect]} rounded-lg overflow-hidden bg-black`}>
        <video
          ref={videoRef}
          className="w-full h-full object-contain bg-black"
          src="/sample-preview.mp4"
          // clicks handled by overlay button
        />

        {/* Center play overlay */}
        <button
          onClick={handlePlayPause}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/40 p-4 rounded-full hover:bg-black/30 transition"
        >
          {isPlaying ? <Pause size={36} /> : <Play size={36} />}
        </button>
      </div>

      {/* Bottom controls */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 w-[60%] justify-between bg-gray-900/80 text-white px-4 py-2 rounded-lg backdrop-blur-md">
        <div className="text-xs text-gray-300">
          <b>0.00s</b> / 27.6s
        </div>

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

        <button onClick={toggleFullscreen} className="hover:text-blue-400 transition">
          {fullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>
      </div>
    </div>
  );
}
