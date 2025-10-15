import { useState } from "react";
import { useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import TopBar from "../components/TopBar";
import SidebarLeft from "../components/SidebarLeft";
import SidebarRight from "../components/SidebarRight";
import PreviewScreen from "../components/PreviewScreen";
import Timeline from "../components/Timeline";
import { TimelineProvider } from '../contexts/TimelineContext';

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


        {/* Optional Beat Adder Modal */}
        <AnimatePresence>
          {isBeatAdderOpen && (
            <motion.div
              className="fixed inset-0 bg-black/60 flex justify-center items-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="bg-gray-800 p-4 rounded-lg w-96">
                <h3 className="text-lg font-semibold mb-2">
                  Beat Settings for {beatModalClip?.name}
                </h3>
                <button
                  onClick={closeBeatModal}
                  className="mt-4 px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded"
                >
                  Close
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>


      </div>
    </TimelineProvider>
  );
}
