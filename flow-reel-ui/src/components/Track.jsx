import {
  Video,
  AudioLines,
  Type,
} from "lucide-react";


// --- Track Component ---
function Track({ type, children, waveform }) {
  const getIcon = () => {
    switch (type) {
      case "video":
        return <Video size={16} className="text-blue-400" />;
      case "audio":
        return <AudioLines size={16} className="text-green-400" />;
      case "text":
        return <Type size={16} className="text-pink-400" />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`bg-[#181818] relative border-b border-gray-800 h-[44px] flex items-center px-3`}
    >
      <div className="w-10 flex items-center justify-center bg-[#1c1c1c] border-r border-gray-700 rounded-l">
        {getIcon()}
      </div>
      <div className="flex-1 flex items-center gap-2 overflow-hidden">{children}</div>
    </div>
  );
}


export default Track;