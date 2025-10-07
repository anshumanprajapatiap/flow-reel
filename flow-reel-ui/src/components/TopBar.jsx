import { Undo2, Redo2, Save, Play, Pause, Upload, Cpu, ZoomIn, ZoomOut, Video, ChevronDown, User } from "lucide-react";

export default function TopBar() {

  const handleLogout = () => {
    localStorage.removeItem("flowreel_user");
    window.location.href = "/login";
  };

  return (
    <div className="bg-panel flex justify-between items-center px-4 py-2 bg-[#1a1a1a]/95 backdrop-blur-md text-white border-b border-gray-800 shadow-sm">
      {/* Left: App logo + Project info */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Video size={20} className="text-blue-400" />
          <h1 className="text-lg font-semibold tracking-wide">FlowReel</h1>
        </div>

        <button className="flex items-center gap-1 px-3 py-1 bg-red-600 rounded hover:bg-red-700 text-sm">
          <User size={16} /> Logout
        </button>

        <button className="flex items-center gap-1 px-2 py-1 bg-gray-800 rounded text-sm text-gray-300 hover:bg-gray-700 transition">
          Cinematic Reel <ChevronDown size={14} />
        </button>
      </div>

      {/* Center: Quick controls */}
      <div className="flex items-center gap-4">
        <button className="hover:text-blue-400 flex items-center gap-1">
          <Play size={18} /> <span className="hidden sm:block text-xs">Play</span>
        </button>
        <button className="hover:text-blue-400 flex items-center gap-1">
          <Pause size={18} /> <span className="hidden sm:block text-xs">Pause</span>
        </button>
        <div className="h-5 w-px bg-gray-700"></div>
        <button className="hover:text-blue-400 flex items-center gap-1">
          <ZoomOut size={18} /> <span className="hidden sm:block text-xs">Zoom</span>
        </button>
        <button className="hover:text-blue-400 flex items-center gap-1">
          <ZoomIn size={18} />
        </button>
        <div className="h-5 w-px bg-gray-700"></div>
        <button className="hover:text-green-400 flex items-center gap-1">
          <Cpu size={18} /> <span className="hidden sm:block text-xs">AI Enhance</span>
        </button>
      </div>

      {/* Right: File actions */}
      <div className="flex items-center gap-3">
        <button className="flex items-center gap-1 px-3 py-1 bg-gray-800 rounded hover:bg-gray-700 text-sm">
          <Undo2 size={16} /> Undo
        </button>
        <button className="flex items-center gap-1 px-3 py-1 bg-gray-800 rounded hover:bg-gray-700 text-sm">
          <Redo2 size={16} /> Redo
        </button>
        <button className="flex items-center gap-1 px-3 py-1 bg-blue-600 rounded hover:bg-blue-700 text-sm">
          <Save size={16} /> Save
        </button>
        <button className="flex items-center gap-1 px-3 py-1 bg-green-600 rounded hover:bg-green-700 text-sm">
          <Upload size={16} /> Export
        </button>

        
      </div>
    </div>
  );
}
