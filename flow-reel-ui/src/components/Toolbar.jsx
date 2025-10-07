import {
  Scissors,
  Star,
  Trash2,
  Crop,
  Copy,
  Volume2
} from "lucide-react";
import Tool from "./Tool";

// --- Toolbar Component ---
function Toolbar() {
  return (
    <div className="flex items-center justify-center gap-8 py-2 bg-[#1a1a1a] border-t border-gray-800 text-gray-300 text-xs">
      <Tool icon={<Scissors size={16} />} label="Trim" />
      <Tool icon={<Star size={16} />} label="FX" />
      <Tool icon={<Copy size={16} />} label="Duplicate" />
      <Tool icon={<Crop size={16} />} label="Crop" />
      <Tool icon={<Trash2 size={16} />} label="Delete" />
      <Tool icon={<Volume2 size={16} />} label="Audio" />
    </div>
  );
}

export default Toolbar