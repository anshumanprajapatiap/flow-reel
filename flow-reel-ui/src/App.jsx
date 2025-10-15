import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import EditorPage from "./pages/EditorPage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";

import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

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
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          {/* <Toaster>
            <Sonner>
              
            </Sonner>
          </Toaster> */}
          <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  {/* <Route path="/" element={<LoginPage />} /> */}

                  <Route
                    path="/dashboard"
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

                  <Route path="*" element={<NotFound />} />
                </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
      
    </div>
  );
}
