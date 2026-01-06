"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import MLDashboard from "@/components/MLDashboard";
import ImageInference from "@/components/ImageInference";
import TrainingView from "@/components/TrainingView";
import ChatView from "@/components/ChatView";

export default function DeepVisionApp() {
  const [activeView, setActiveView] = useState("dashboard");

  const renderView = () => {
    switch (activeView) {
      case "dashboard":
        return <MLDashboard />;
      case "prediction":
        return <ImageInference />;
      case "training":
        return <TrainingView />;
      case "chat":
        return <ChatView />;
      default:
        return <MLDashboard />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden animate-gradient">
      {/* Dynamic Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 blur-[120px] rounded-full"></div>
      </div>

      <Sidebar activeView={activeView} setActiveView={setActiveView} />

      <main className="flex-1 relative z-10 overflow-hidden">
        {renderView()}
      </main>
    </div>
  );
}
