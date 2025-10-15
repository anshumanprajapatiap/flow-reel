import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useVideoEditor } from "@/contexts/VideoEditorContext";
import { useEffect, useState } from "react";

export const Timeline = () => {
  const {
    clips,
    currentTime,
    isPlaying,
    volume,
    selectedClipId,
    setCurrentTime,
    setIsPlaying,
    setVolume,
    setSelectedClipId,
    videoRef,
    getTotalDuration,
    reorderClips,
  } = useVideoEditor();

  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  useEffect(() => {
    if (!videoRef.current) return;

    const handleTimeUpdate = () => {
      setCurrentTime(videoRef.current?.currentTime || 0);
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    videoRef.current.addEventListener("timeupdate", handleTimeUpdate);
    videoRef.current.addEventListener("ended", handleEnded);

    return () => {
      videoRef.current?.removeEventListener("timeupdate", handleTimeUpdate);
      videoRef.current?.removeEventListener("ended", handleEnded);
    };
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume / 100;
    }
  }, [volume]);

  const handleVolumeChange = (value) => {
    setVolume(value[0]);
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * getTotalDuration();
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      reorderClips(draggedIndex, dropIndex);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="h-64 bg-[hsl(var(--timeline-bg))] border-t border-border flex flex-col">
      {/* Playback Controls */}
      <div className="h-16 border-b border-border flex items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="w-8 h-8">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
          </Button>
          <Button variant="ghost" size="icon" className="w-8 h-8">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
            </svg>
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon">
            <SkipBack className="w-5 h-5" />
          </Button>
          <Button
            size="icon"
            className="w-12 h-12 rounded-full bg-primary hover:bg-primary/90"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" />
            )}
          </Button>
          <Button variant="ghost" size="icon">
            <SkipForward className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex items-center gap-3">
          {volume === 0 ? (
            <VolumeX className="w-4 h-4 text-muted-foreground" />
          ) : (
            <Volume2 className="w-4 h-4 text-muted-foreground" />
          )}
          <Slider
            value={[volume]}
            onValueChange={handleVolumeChange}
            max={100}
            step={1}
            className="w-24"
          />
        </div>
      </div>

      {/* Timeline Track */}
      <div className="flex-1 p-4 overflow-x-auto">
        <div className="relative h-full min-w-full">
          {/* Audio Waveform */}
          <div className="mb-3 h-12 bg-[hsl(var(--toolbar-bg))] rounded-lg overflow-hidden relative">
            <div className="absolute inset-0 flex items-center px-2">
              <svg className="w-full h-8" preserveAspectRatio="none" viewBox="0 0 1000 40">
                <path
                  d="M0,20 Q10,10 20,20 T40,20 T60,20 T80,20 T100,20 T120,20 T140,20 T160,20 T180,20 T200,20 T220,20 T240,20 T260,20 T280,20 T300,20 T320,20 T340,20 T360,20 T380,20 T400,20 T420,20 T440,20 T460,20 T480,20 T500,20 T520,20 T540,20 T560,20 T580,20 T600,20 T620,20 T640,20 T660,20 T680,20 T700,20 T720,20 T740,20 T760,20 T780,20 T800,20 T820,20 T840,20 T860,20 T880,20 T900,20 T920,20 T940,20 T960,20 T980,20 T1000,20"
                  fill="none"
                  stroke="hsl(var(--waveform))"
                  strokeWidth="2"
                  opacity="0.6"
                />
              </svg>
            </div>
            <div className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
              A.R. Rahman - Hosanna Best Video
            </div>
          </div>

          {/* Video Clips Track */}
          <div 
            className="h-20 bg-[hsl(var(--toolbar-bg))] rounded-lg p-2 flex gap-1 overflow-x-auto cursor-pointer relative"
            onClick={handleSeek}
          >
            {clips.map((clip, index) => (
              <div
                key={clip.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                className={`relative h-full rounded overflow-hidden border-2 flex-shrink-0 group transition-all cursor-move ${
                  selectedClipId === clip.id ? "border-primary" : "border-primary/50 hover:border-primary"
                } ${dragOverIndex === index ? "scale-105 border-primary" : ""}`}
                style={{ width: `${clip.duration * 40}px` }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedClipId(clip.id);
                }}
              >
                <div className="absolute top-1 left-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <GripVertical className="w-4 h-4 text-white drop-shadow" />
                </div>
                <img
                  src={clip.thumbnail}
                  alt={clip.file.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-1 right-1 text-xs text-white bg-black/70 px-1 rounded">
                  {clip.duration.toFixed(1)}s
                </div>
                {clip.speed !== 1 && (
                  <div className="absolute top-1 right-1 text-xs text-white bg-primary px-1 rounded">
                    {clip.speed}x
                  </div>
                )}
              </div>
            ))}
            
            {/* Playhead */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-red-500 pointer-events-none z-10"
              style={{ left: `${(currentTime / getTotalDuration()) * 100}%` }}
            >
              <div className="w-3 h-3 bg-red-500 rounded-full absolute -top-1 left-1/2 -translate-x-1/2" />
            </div>
          </div>

          {/* Time Markers */}
          <div className="mt-2 flex justify-between text-xs text-muted-foreground px-2">
            <span>0s</span>
            <span>2s</span>
            <span>4s</span>
            <span>6s</span>
            <span>8s</span>
            <span>10s</span>
          </div>
        </div>
      </div>
    </div>
  );
};
