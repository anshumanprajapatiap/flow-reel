import { useState, useRef, useEffect } from "react";
import { Play, Pause, RotateCcw, Zap, Hand } from "lucide-react";
import { Button } from "./ui/button";
import WaveSurfer from "wavesurfer.js";

export default function BeatAdder({ file, onApply, onCancel }) {
  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [mode, setMode] = useState("auto"); // "auto" | "manual"
  const [progress, setProgress] = useState(0);
  const [autoBeats, setAutoBeats] = useState([]);
  const [manualBeats, setManualBeats] = useState([]);
  const [intensity, setIntensity] = useState(0.5);
  const [loading, setLoading] = useState(false);

  // 🎵 Initialize Waveform
  useEffect(() => {
    if (waveformRef.current && file) {
      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "#ddd",
        progressColor: "#4f46e5",
        cursorColor: "#ef4444",
        height: 90,
        responsive: true,
      });

      const fileUrl = URL.createObjectURL(file);
      wavesurfer.current.load(fileUrl);

      return () => {
        wavesurfer.current.destroy();
        URL.revokeObjectURL(fileUrl);
      };
    }
  }, [file]);

  // ⚡ Simulated Auto Beat Detection
  const handleAutoDetect = async () => {
    setLoading(true);
    setProgress(0);
    setAutoBeats([]);

    const totalSteps = 100;
    for (let i = 0; i <= totalSteps; i++) {
      await new Promise((res) => setTimeout(res, 20));
      setProgress(i);
    }

    // Mock beats based on intensity
    const duration = wavesurfer.current?.getDuration() || 60;
    const beatCount = Math.floor(duration * intensity * 2);
    const newBeats = Array.from({ length: beatCount }, () =>
      Number((Math.random() * duration).toFixed(2))
    ).sort((a, b) => a - b);

    setAutoBeats(newBeats);
    setLoading(false);
  };

  // ✋ Manual Beat Placement
  const handleWaveClick = (e) => {
    if (mode !== "manual" || !wavesurfer.current) return;
    const duration = wavesurfer.current.getDuration();
    const rect = waveformRef.current.getBoundingClientRect();
    const clickPos = (e.clientX - rect.left) / rect.width;
    const time = duration * clickPos;
    setManualBeats((prev) => [...prev, Number(time.toFixed(2))].sort((a, b) => a - b));
  };

  const handlePlayPause = () => {
    wavesurfer.current?.playPause();
    setIsPlaying((prev) => !prev);
  };

  const handleReset = () => {
    setManualBeats([]);
    setAutoBeats([]);
    setProgress(0);
  };

  const handleApply = () => {
    const beats = mode === "auto" ? autoBeats : manualBeats;
    onApply?.(beats);
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-white rounded-2xl shadow-md w-full max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800 truncate">
          {file?.name || "No file selected"}
        </h2>
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={handlePlayPause}>
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </Button>
          <Button size="sm" variant="outline" onClick={handleReset}>
            <RotateCcw size={18} />
          </Button>
        </div>
      </div>

      {/* Mode Selector */}
      <div className="flex justify-center gap-4">
        <Button
          variant={mode === "auto" ? "default" : "outline"}
          onClick={() => setMode("auto")}
          className="flex items-center gap-2"
        >
          <Zap size={16} /> Auto Beats
        </Button>
        <Button
          variant={mode === "manual" ? "default" : "outline"}
          onClick={() => setMode("manual")}
          className="flex items-center gap-2"
        >
          <Hand size={16} /> Manual Beats
        </Button>
      </div>

      {/* Auto Mode */}
      {mode === "auto" && (
        <div className="flex flex-col items-center gap-4">
          <label className="text-sm text-gray-600">Beat Intensity</label>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.1"
            value={intensity}
            onChange={(e) => setIntensity(Number(e.target.value))}
            className="w-2/3 accent-indigo-500"
          />
          <Button disabled={loading} onClick={handleAutoDetect}>
            {loading ? `Detecting Beats... ${progress}%` : "Auto Detect Beats"}
          </Button>
        </div>
      )}

      {/* Waveform */}
      <div
        ref={waveformRef}
        onClick={handleWaveClick}
        className="relative border rounded-md cursor-pointer"
      >
        {/* Red beat markers */}
        {(mode === "auto" ? autoBeats : manualBeats).map((t, i) => (
          <div
            key={i}
            className="absolute top-0 bottom-0 w-[2px] bg-red-500 opacity-70"
            style={{
              left: `${(t / (wavesurfer.current?.getDuration() || 1)) * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="flex justify-between mt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleApply} disabled={!autoBeats.length && !manualBeats.length}>
          Apply
        </Button>
      </div>
    </div>
  );
}
