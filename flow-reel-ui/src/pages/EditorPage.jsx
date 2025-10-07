import { useState } from "react";
import { useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import TopBar from "../components/TopBar";
import SidebarLeft from "../components/SidebarLeft";
import SidebarRight from "../components/SidebarRight";
import PreviewScreen from "../components/PreviewScreen";
import Timeline from "../components/Timeline";
import AudioBeatPanel from "../components/AudioBeatPanel";
import BeatAdder from "../components/BeatAdder";

export default function EditorPage() {
  const { projectId } = useParams();

  const user = JSON.parse(localStorage.getItem("flowreel_user"));
  const userId = user?.id;

  const [selectedAudio, setSelectedAudio] = useState(null);
  const [isBeatAdderOpen, setIsBeatAdderOpen] = useState(false);

  const handleAudioClick = (audioFile) => {
    setSelectedAudio(audioFile);
    setIsBeatAdderOpen(true);
  };

  const handleApplyBeats = (beats) => {
    console.log("✅ Beats saved:", beats);
    setIsBeatAdderOpen(false);
  };

  const handleCancelBeats = () => {
    setIsBeatAdderOpen(false);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white overflow-hidden">
      {/* Top navigation bar */}
      <TopBar />

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        <SidebarLeft userId={userId} projectId={projectId} />

        {/* Main editor section */}
        <div className="flex flex-col flex-1 overflow-hidden relative">
          <PreviewScreen />
          <AudioBeatPanel />
          <Timeline onAudioClick={handleAudioClick} />
        </div>

        <SidebarRight />
      </div>

      {/* BEAT ADDER MODAL (animated overlay) */}
      <AnimatePresence>
        {isBeatAdderOpen && (
          <motion.div
            key="beat-adder-overlay"
            className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 w-[80%] h-[80%] max-w-5xl overflow-hidden flex flex-col"
              initial={{ y: 80, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 80, opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 120, damping: 12 }}
            >
              <BeatAdder
                file={selectedAudio}
                onApply={handleApplyBeats}
                onCancel={handleCancelBeats}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
