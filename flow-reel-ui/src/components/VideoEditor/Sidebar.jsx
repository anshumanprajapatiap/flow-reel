import { useState, useRef } from "react";
import { Film, Grid3x3, Type, Music, Waves, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useVideoEditor } from "@/contexts/VideoEditorContext";
import { toast } from "sonner";

const tabs = [
  { id: "stocks", label: "Stocks", icon: Film },
  { id: "elements", label: "Elements", icon: Grid3x3 },
  { id: "text", label: "Text", icon: Type },
  { id: "music", label: "Music", icon: Music },
  { id: "soundfx", label: "Sound FX", icon: Waves },
];

export const Sidebar = () => {
  const [activeTab, setActiveTab] = useState("stocks");
  const fileInputRef = useRef(null);
  const { addClip, clips } = useVideoEditor();

  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith("video/")) {
        toast.error("Please upload video files only");
        continue;
      }
      try {
        await addClip(file);
        toast.success(`Added ${file.name}`);
      } catch (error) {
        toast.error(`Failed to add ${file.name}`);
      }
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-80 bg-[hsl(var(--sidebar-dark))] border-r border-border flex flex-col h-full">
      {/* Top Tabs */}
      <div className="flex items-center justify-around border-b border-border p-2 gap-1">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex flex-col items-center gap-1 h-auto py-2 px-3",
              activeTab === tab.id && "bg-primary text-primary-foreground"
            )}
          >
            <tab.icon className="w-4 h-4" />
            <span className="text-xs">{tab.label}</span>
          </Button>
        ))}
      </div>

      {/* Upload Section */}
      <div className="p-4 border-b border-border">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="video/*"
          multiple
          className="hidden"
        />
        <Button
          onClick={() => fileInputRef.current?.click()}
          className="w-full"
          size="sm"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload Videos
        </Button>
      </div>

      {/* Media Grid */}
      <div className="p-4 flex-1">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-foreground">My Videos</h3>
          <span className="text-xs text-muted-foreground">{clips.length} clips</span>
        </div>

        <ScrollArea className="h-full">
          <div className="grid grid-cols-2 gap-3">
            {clips.map((clip) => (
              <div
                key={clip.id}
                className="group relative cursor-pointer rounded-lg overflow-hidden bg-[hsl(var(--clip-bg))] hover:ring-2 hover:ring-primary transition-all"
              >
                <div className="aspect-video w-full overflow-hidden">
                  <img
                    src={clip.thumbnail}
                    alt={clip.file.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-2">
                  <p className="text-xs text-foreground truncate">{clip.file.name}</p>
                  <p className="text-xs text-muted-foreground">{clip.duration.toFixed(1)}s</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
