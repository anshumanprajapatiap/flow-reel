import { useState } from "react";
import {
  Film,
  Sparkles,
  Palette,
  Type,
  Bot,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function SidebarRight() {
  const [expanded, setExpanded] = useState(false);
  const [tab, setTab] = useState("transitions");

  const tabs = [
    { key: "transitions", icon: <Film size={18} />, label: "Transitions" },
    { key: "vfx", icon: <Sparkles size={18} />, label: "VFX" },
    { key: "color", icon: <Palette size={18} />, label: "Color" },
    { key: "text", icon: <Type size={18} />, label: "Text" },
    { key: "ai", icon: <Bot size={18} />, label: "AI" },
  ];

  return (
    <div className="bg-panel flex h-full">
      {/* Vertical Icon Bar */}
      <div className="w-12 bg-gray-900 border-l border-gray-700 flex flex-col items-center py-4 space-y-5">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => {
              setTab(t.key);
              setExpanded(true);
            }}
            className={`p-2 rounded-md transition ${
              tab === t.key ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-gray-700"
            }`}
            title={t.label}
          >
            {t.icon}
          </button>
        ))}
        <div className="mt-auto mb-2">
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2 rounded-md text-gray-400 hover:bg-gray-700"
            title={expanded ? "Collapse" : "Expand"}
          >
            {expanded ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>
      </div>

      {/* Expandable Content Area */}
      {expanded && (
        <div className="w-72 bg-gray-800 text-white p-4 border-l border-gray-700 flex flex-col transition-all duration-300">
          {tab === "transitions" && (
            <>
              <h2 className="text-lg font-semibold mb-3">🎬 Transitions</h2>
              <ul className="space-y-2">
                {["Crossfade", "Slide", "Zoom", "Glitch", "Flash", "Morph"].map(
                  (t) => (
                    <li
                      key={t}
                      className="bg-gray-700 p-2 rounded cursor-pointer hover:ring-2 hover:ring-blue-400 transition"
                    >
                      {t}
                    </li>
                  )
                )}
              </ul>
            </>
          )}

          {tab === "vfx" && (
            <>
              <h2 className="text-lg font-semibold mb-3">✨ VFX Effects</h2>
              <ul className="space-y-2">
                {["Blur", "Shake", "Slow Motion", "Glow", "Mirror"].map((fx) => (
                  <li
                    key={fx}
                    className="bg-gray-700 p-2 rounded cursor-pointer hover:ring-2 hover:ring-purple-400 transition"
                  >
                    {fx}
                  </li>
                ))}
              </ul>
            </>
          )}

          {tab === "color" && (
            <>
              <h2 className="text-lg font-semibold mb-3">🎨 Color Grading</h2>
              <div className="space-y-3">
                <label>Brightness</label>
                <input type="range" min="0" max="100" className="w-full" />
                <label>Contrast</label>
                <input type="range" min="0" max="100" className="w-full" />
                <label>Saturation</label>
                <input type="range" min="0" max="100" className="w-full" />
              </div>
            </>
          )}

          {tab === "text" && (
            <>
              <h2 className="text-lg font-semibold mb-3">📝 Text Layers</h2>
              <button className="bg-blue-600 w-full py-2 rounded hover:bg-blue-700 transition">
                + Add Text Layer
              </button>
            </>
          )}

          {tab === "ai" && (
            <>
              <h2 className="text-lg font-semibold mb-3">🤖 AI Tools</h2>
              <div className="space-y-2">
                <button className="bg-green-600 w-full py-2 rounded hover:bg-green-700 transition">
                  Auto Enhance
                </button>
                <button className="bg-purple-600 w-full py-2 rounded hover:bg-purple-700 transition">
                  Cinematic Color
                </button>
                <button className="bg-blue-600 w-full py-2 rounded hover:bg-blue-700 transition">
                  Smart Scene Cut
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
