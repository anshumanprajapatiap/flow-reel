import { Sidebar } from "@/components/VideoEditor/Sidebar";
import { Preview } from "@/components/VideoEditor/Preview";
import { Timeline } from "@/components/VideoEditor/Timeline";
import { Toolbar } from "@/components/VideoEditor/Toolbar";
import { VideoEditorProvider } from "@/contexts/VideoEditorContext";
import { Toaster } from "@/components/ui/sonner";

const Index = () => {
  return (
    <VideoEditorProvider>
      <div className="h-screen w-full flex flex-col overflow-hidden bg-background">
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Preview />
            <Timeline />
            <Toolbar />
          </div>
        </div>
      </div>
      <Toaster />
    </VideoEditorProvider>
  );
};

export default Index;
