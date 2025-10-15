import { Maximize2, Save, Share2, ZoomIn, ZoomOut, RotateCw, FlipHorizontal2, FlipVertical2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVideoEditor } from "@/contexts/VideoEditorContext";
import { useEffect } from "react";
import { toast } from "sonner";

export const Preview = () => {
  const { 
    clips, 
    currentTime, 
    isPlaying, 
    videoRef, 
    filters, 
    textOverlays, 
    exportVideo, 
    getTotalDuration,
    zoom,
    setZoom,
    selectedClipId,
    updateClipRotation,
    updateClipFlip
  } = useVideoEditor();
  
  const selectedClip = clips.find(c => c.id === selectedClipId);

  useEffect(() => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  }, [isPlaying]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleExport = () => {
    toast.success("Exporting video...");
    exportVideo();
  };

  const handleRotate = () => {
    if (selectedClipId && selectedClip) {
      const currentRotation = selectedClip.rotation || 0;
      updateClipRotation(selectedClipId, (currentRotation + 90) % 360);
    }
  };

  const handleFlipH = () => {
    if (selectedClipId && selectedClip) {
      updateClipFlip(selectedClipId, !selectedClip.flipH, selectedClip.flipV);
    }
  };

  const handleFlipV = () => {
    if (selectedClipId && selectedClip) {
      updateClipFlip(selectedClipId, selectedClip.flipH, !selectedClip.flipV);
    }
  };

  const currentClip = clips.find(
    (clip) => currentTime >= clip.startTime && currentTime < clip.endTime
  );

  const getTransformStyle = (clip) => {
    if (!clip) return {};
    return {
      filter: `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturate}%) grayscale(${filters.grayscale}%) blur(${filters.blur}px)`,
      transform: `scale(${zoom / 100}) rotate(${clip.rotation || 0}deg) scaleX(${clip.flipH ? -1 : 1}) scaleY(${clip.flipV ? -1 : 1})`,
      transition: "transform 0.3s ease"
    };
  };

  return (
    <div className="flex-1 bg-[hsl(var(--preview-bg))] flex flex-col">
      {/* Top Bar */}
      <div className="h-14 border-b border-border flex items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{clips.length} clips</span>
          
          <div className="flex items-center gap-1 ml-4 border-l border-border pl-4">
            <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => setZoom(Math.max(50, zoom - 10))}>
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-xs text-muted-foreground w-12 text-center">{zoom}%</span>
            <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => setZoom(Math.min(200, zoom + 10))}>
              <ZoomIn className="w-4 h-4" />
            </Button>
          </div>
          
          {selectedClipId && (
            <div className="flex items-center gap-1 ml-4 border-l border-border pl-4">
              <Button variant="ghost" size="icon" className="w-8 h-8" onClick={handleRotate} title="Rotate">
                <RotateCw className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="w-8 h-8" onClick={handleFlipH} title="Flip Horizontal">
                <FlipHorizontal2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="w-8 h-8" onClick={handleFlipV} title="Flip Vertical">
                <FlipVertical2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-8 h-8"
            onClick={() => toast.info("Auto-save enabled")}
          >
            <Save className="w-4 h-4" />
          </Button>
          <Button 
            className="bg-primary hover:bg-primary/90"
            onClick={handleExport}
            disabled={clips.length === 0}
          >
            <Share2 className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Video Preview Area */}
      <div className="flex-1 flex items-center justify-center p-8 relative">
        <div className="relative w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
          {currentClip ? (
            <video
              ref={videoRef}
              src={currentClip.url}
              className="w-full h-full object-contain"
              style={getTransformStyle(currentClip)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/50">
              Upload a video to start editing
            </div>
          )}

          {/* Text Overlays */}
          {textOverlays
            .filter((t) => currentTime >= t.startTime && currentTime <= t.endTime)
            .map((overlay) => (
              <div
                key={overlay.id}
                className="absolute pointer-events-none"
                style={{
                  left: `${overlay.x}%`,
                  top: `${overlay.y}%`,
                  fontSize: `${overlay.fontSize}px`,
                  color: overlay.color,
                }}
              >
                {overlay.text}
              </div>
            ))}
          
          {/* Playback Time */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full text-sm text-white">
            {formatTime(currentTime)} / {formatTime(getTotalDuration())}
          </div>

          {/* Aspect Ratio Indicator */}
          <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm px-3 py-1 rounded text-xs text-white flex items-center gap-2">
            <span>16:9</span>
            <Maximize2 className="w-3 h-3" />
          </div>
        </div>
      </div>
    </div>
  );
};
