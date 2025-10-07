import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import EditorPage from "./pages/EditorPage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  const [isTooSmall, setIsTooSmall] = useState(false);

  useEffect(() => {
    const checkSize = () => {
      setIsTooSmall(window.innerWidth < 938 || window.innerHeight < 700);
    };

    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  return (
    <div className="relative min-w-[938px] min-h-[700px] w-full h-screen bg-gray-900 text-white overflow-auto">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path=""
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/editor/:projectId"
            element={
              <ProtectedRoute>
                <EditorPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>

      {/* Animated small screen overlay */}
      <AnimatePresence>
        {isTooSmall && (
          <motion.div
            key="small-screen-overlay"
            className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gray-800 p-6 rounded-2xl shadow-2xl text-center max-w-sm border border-gray-700"
              initial={{ y: 100, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 100, opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 120, damping: 12 }}
            >
              <h1 className="text-2xl font-bold mb-3 text-red-400">
                ⚠️ Screen Too Small
              </h1>
              <p className="text-gray-300 mb-2">Minimum required size:</p>
              <p className="text-blue-400 font-semibold mb-4">
                938 × 700 pixels
              </p>
              <p className="text-gray-400 text-sm">
                Resize your window or use a larger display for the best
                editing experience.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
