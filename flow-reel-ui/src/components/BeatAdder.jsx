import { useState, useRef, useEffect } from "react";
import { Play, Pause, RotateCcw, Zap, Hand } from "lucide-react";
import { Button } from "./ui/button";
import WaveSurfer from "wavesurfer.js";

export default function BeatAdder({ file, onApply, onCancel }) {
  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [mode, setMode] = useState("auto");
  const [progress, setProgress] = useState(0);
  const [autoBeats, setAutoBeats] = useState([]);
  const [manualBeats, setManualBeats] = useState([]);
  const [intensity, setIntensity] = useState(0.5);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (waveformRef.current && file) {
      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "#4b5563",
        progressColor: "#6366f1",
        cursorColor: "#ef4444",
        height: 100,
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

  const handleAutoDetect = async () => {
    setLoading(true);
    setProgress(0);
    setAutoBeats([]);

    const totalSteps = 100;
    for (let i = 0; i <= totalSteps; i++) {
      await new Promise((r) => setTimeout(r, 15));
      setProgress(i);
    }

    const duration = wavesurfer.current?.getDuration() || 60;
    const beatCount = Math.floor(duration * intensity * 2);
    const newBeats = Array.from({ length: beatCount }, () =>
      Number((Math.random() * duration).toFixed(2))
    ).sort((a, b) => a - b);

    setAutoBeats(newBeats);
    setLoading(false);
  };

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
    <div className="flex flex-col gap-4 p-4 bg-gray-900 rounded-xl shadow-lg w-full max-w-3xl mx-auto text-white">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold truncate">
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
          <label className="text-sm text-gray-400">Beat Intensity</label>
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
        className="relative border border-gray-700 rounded-md cursor-pointer"
      >
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
