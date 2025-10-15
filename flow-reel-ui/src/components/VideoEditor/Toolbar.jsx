import { 
  Scissors, 
  Split, 
  Trash2, 
  Type,
  Sliders,
  Gauge,
  Undo2,
  Redo2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useVideoEditor } from "@/contexts/VideoEditorContext";
import { toast } from "sonner";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

const tools = [
  { id: "trim", label: "Trim", icon: Scissors },
  { id: "split", label: "Split", icon: Split },
  { id: "delete", label: "Delete", icon: Trash2 },
  { id: "speed", label: "Speed", icon: Gauge },
  { id: "text", label: "Text", icon: Type },
  { id: "fx", label: "Effects", icon: Sliders },
];

export const Toolbar = () => {
  const { 
    clips,
    selectedClipId, 
    splitClip, 
    removeClip, 
    currentTime, 
    addTextOverlay, 
    filters, 
    updateFilters,
    updateClipTrim,
    updateClipSpeed,
    undo,
    redo,
    canUndo,
    canRedo
  } = useVideoEditor();
  const [showTextDialog, setShowTextDialog] = useState(false);
  const [showFxDialog, setShowFxDialog] = useState(false);
  const [showTrimDialog, setShowTrimDialog] = useState(false);
  const [showSpeedDialog, setShowSpeedDialog] = useState(false);
  const [textInput, setTextInput] = useState("");
  
  const selectedClip = clips.find(c => c.id === selectedClipId);
  const [trimStart, setTrimStart] = useState(selectedClip?.trimStart || 0);
  const [trimEnd, setTrimEnd] = useState(selectedClip?.trimEnd || 0);
  const [speed, setSpeed] = useState(selectedClip?.speed || 1);

  const handleToolClick = (toolId) => {
    switch (toolId) {
      case "trim":
        if (selectedClipId && selectedClip) {
          setTrimStart(selectedClip.trimStart);
          setTrimEnd(selectedClip.trimEnd);
          setShowTrimDialog(true);
        } else {
          toast.error("Please select a clip first");
        }
        break;
      case "split":
        if (selectedClipId) {
          splitClip(selectedClipId, currentTime);
          toast.success("Clip split successfully");
        } else {
          toast.error("Please select a clip first");
        }
        break;
      case "delete":
        if (selectedClipId) {
          removeClip(selectedClipId);
          toast.success("Clip deleted");
        } else {
          toast.error("Please select a clip first");
        }
        break;
      case "speed":
        if (selectedClipId && selectedClip) {
          setSpeed(selectedClip.speed);
          setShowSpeedDialog(true);
        } else {
          toast.error("Please select a clip first");
        }
        break;
      case "text":
        setShowTextDialog(true);
        break;
      case "fx":
        setShowFxDialog(true);
        break;
    }
  };

  const handleApplyTrim = () => {
    if (selectedClipId) {
      updateClipTrim(selectedClipId, trimStart, trimEnd);
      toast.success("Trim applied");
      setShowTrimDialog(false);
    }
  };

  const handleApplySpeed = () => {
    if (selectedClipId) {
      updateClipSpeed(selectedClipId, speed);
      toast.success("Speed adjusted");
      setShowSpeedDialog(false);
    }
  };

  const handleAddText = () => {
    if (textInput.trim()) {
      addTextOverlay({
        id: `text-${Date.now()}`,
        text: textInput,
        startTime: currentTime,
        endTime: currentTime + 5,
        x: 50,
        y: 50,
        fontSize: 32,
        color: "#ffffff",
      });
      toast.success("Text added");
      setTextInput("");
      setShowTextDialog(false);
    }
  };

  return (
    <>
      <div className="h-20 bg-[hsl(var(--toolbar-bg))] border-t border-border flex items-center justify-between px-6 overflow-x-auto">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={undo}
            disabled={!canUndo}
            title="Undo"
          >
            <Undo2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={redo}
            disabled={!canRedo}
            title="Redo"
          >
            <Redo2 className="w-4 h-4" />
          </Button>
          <Separator orientation="vertical" className="h-10 mx-2" />
        </div>
        
        <div className="flex items-center gap-1">
          {tools.map((tool, index) => (
            <div key={tool.id} className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                className="flex flex-col items-center gap-1 h-auto py-2 px-3 hover:bg-muted group"
                onClick={() => handleToolClick(tool.id)}
              >
                <tool.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                  {tool.label}
                </span>
              </Button>
              {index < tools.length - 1 && index % 4 === 3 && (
                <Separator orientation="vertical" className="h-10 mx-2" />
              )}
            </div>
          ))}
        </div>
        
        <div className="w-20" /> {/* Spacer for balance */}
      </div>

      {/* Trim Dialog */}
      <Dialog open={showTrimDialog} onOpenChange={setShowTrimDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Trim Clip</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Start Time: {trimStart.toFixed(2)}s</Label>
              <Slider
                value={[trimStart]}
                onValueChange={(v) => setTrimStart(v[0])}
                min={0}
                max={selectedClip?.duration || 10}
                step={0.1}
              />
            </div>
            <div>
              <Label>End Time: {trimEnd.toFixed(2)}s</Label>
              <Slider
                value={[trimEnd]}
                onValueChange={(v) => setTrimEnd(v[0])}
                min={0}
                max={selectedClip?.duration || 10}
                step={0.1}
              />
            </div>
            <Button onClick={handleApplyTrim} className="w-full">
              Apply Trim
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Speed Dialog */}
      <Dialog open={showSpeedDialog} onOpenChange={setShowSpeedDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust Speed</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Speed: {speed}x</Label>
              <Slider
                value={[speed]}
                onValueChange={(v) => setSpeed(v[0])}
                min={0.25}
                max={4}
                step={0.25}
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>0.25x (Slow)</span>
                <span>1x (Normal)</span>
                <span>4x (Fast)</span>
              </div>
            </div>
            <Button onClick={handleApplySpeed} className="w-full">
              Apply Speed
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Text Dialog */}
      <Dialog open={showTextDialog} onOpenChange={setShowTextDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Text Overlay</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Text</Label>
              <Input
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Enter text..."
              />
            </div>
            <Button onClick={handleAddText} className="w-full">
              Add Text
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Effects Dialog */}
      <Dialog open={showFxDialog} onOpenChange={setShowFxDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Video Effects</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Brightness: {filters.brightness}%</Label>
              <Slider
                value={[filters.brightness]}
                onValueChange={(v) => updateFilters({ brightness: v[0] })}
                min={0}
                max={200}
                step={1}
              />
            </div>
            <div>
              <Label>Contrast: {filters.contrast}%</Label>
              <Slider
                value={[filters.contrast]}
                onValueChange={(v) => updateFilters({ contrast: v[0] })}
                min={0}
                max={200}
                step={1}
              />
            </div>
            <div>
              <Label>Saturation: {filters.saturate}%</Label>
              <Slider
                value={[filters.saturate]}
                onValueChange={(v) => updateFilters({ saturate: v[0] })}
                min={0}
                max={200}
                step={1}
              />
            </div>
            <div>
              <Label>Grayscale: {filters.grayscale}%</Label>
              <Slider
                value={[filters.grayscale]}
                onValueChange={(v) => updateFilters({ grayscale: v[0] })}
                min={0}
                max={100}
                step={1}
              />
            </div>
            <div>
              <Label>Blur: {filters.blur}px</Label>
              <Slider
                value={[filters.blur]}
                onValueChange={(v) => updateFilters({ blur: v[0] })}
                min={0}
                max={10}
                step={0.1}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
