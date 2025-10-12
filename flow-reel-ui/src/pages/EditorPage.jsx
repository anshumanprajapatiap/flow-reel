import { useState } from "react";
import { useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import TopBar from "../components/TopBar";
import SidebarLeft from "../components/SidebarLeft";
import SidebarRight from "../components/SidebarRight";
import PreviewScreen from "../components/PreviewScreen";
import Timeline from "../components/Timeline";
import BeatAdder from "../components/BeatAdder";
import { TimelineProvider } from '../context/TimelineContext';

export default function EditorPage() {
  const { projectId } = useParams();

  // ✅ Fetch user from localStorage
  const user = JSON.parse(localStorage.getItem("flowreel_user"));
  const userId = user?.id;

  // ✅ Beat Adder Modal
  const [beatModalClip, setBeatModalClip] = useState(null);
  const [isBeatAdderOpen, setIsBeatAdderOpen] = useState(false);

  const openBeatModal = (clip) => {
    setBeatModalClip(clip);
    setIsBeatAdderOpen(true);
  };

  const closeBeatModal = () => {
    setBeatModalClip(null);
    setIsBeatAdderOpen(false);
  };

  return (
    <TimelineProvider>
      <div className="flex flex-col h-screen bg-gray-900 text-white overflow-hidden">
        <TopBar />

        {/* Main container */}
        <div className="flex flex-col flex-1">
          {/* TOP SECTION (60% height of viewport) */}
          <div className="flex w-full" style={{ height: "60vh" }}>
            <SidebarLeft userId={userId} projectId={projectId} />

            <div className="flex-1 flex flex-col items-stretch overflow-hidden">
              <PreviewScreen />
            </div>

            <SidebarRight />
          </div>

          {/* BOTTOM SECTION (40% height of viewport) */}
          <div
            className="w-full border-t border-gray-800 bg-[#0f0f0f]"
            style={{ height: "40vh" }}
          >
            <Timeline onOpenBeatPanel={openBeatModal} />
          </div>
        </div>

        {/* BeatAdder Modal */}
        <AnimatePresence>
          {isBeatAdderOpen && (
            <motion.div
              className="absolute inset-0 bg-black/70 z-50 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ y: 40, opacity: 0, scale: 0.98 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 40, opacity: 0, scale: 0.98 }}
                className="w-[80%] h-[80%] bg-gray-800 rounded-2xl border border-gray-700 shadow-2xl overflow-hidden"
              >
                <BeatAdder
                  file={beatModalClip}
                  onApply={(beats) => {
                    console.log("Beats saved:", beats);
                    closeBeatModal();
                  }}
                  onCancel={closeBeatModal}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </TimelineProvider>
  );
}
