"use client";

import { useMLStore } from "@/lib/ml-store";
import { Activity, Cpu, Database, Gauge, Timer } from "lucide-react";
import { useEffect, useState } from "react";

export default function MLDashboard() {
  const { status, fetchStatus } = useMLStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(fetchStatus, 3000);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  if (!mounted) return null;

  const stats = [
    {
      label: "Pipeline Status",
      value: status.is_training ? "Training" : "Idle",
      icon: Activity,
      color: status.is_training ? "text-green-400" : "text-gray-400",
    },
    {
      label: "Memory Usage",
      value: "2.4 GB",
      icon: Database,
      color: "text-blue-400",
    },
    { label: "GPU Load", value: "45%", icon: Cpu, color: "text-purple-400" },
    {
      label: "Prediction Latency",
      value: "24ms",
      icon: Timer,
      color: "text-orange-400",
    },
  ];

  return (
    <div className="p-8 h-full overflow-y-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white">System Dashboard</h2>
          <p className="text-gray-400 mt-1">
            Real-time deep learning pipeline monitoring
          </p>
        </div>
        <div className="flex gap-4">{/* Action buttons could go here */}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="glass p-6 rounded-2xl space-y-4 hover:border-white/10 transition-all group"
          >
            <div className="flex justify-between items-start">
              <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <Gauge className="w-4 h-4 text-white/10 group-hover:text-white/20 transition-colors" />
            </div>
            <div>
              <p className="text-sm text-gray-400 font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold text-white mt-1">
                {stat.value}
              </h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass rounded-3xl p-8 min-h-[400px]">
          <h3 className="text-xl font-bold text-white mb-6">
            Model Performance
          </h3>
          <div className="flex items-center justify-center h-full border-2 border-dashed border-white/5 rounded-2xl">
            <p className="text-gray-500 italic">
              Training charts will appear here after the first run...
            </p>
          </div>
        </div>

        <div className="glass rounded-3xl p-8 flex flex-col">
          <h3 className="text-xl font-bold text-white mb-6">Execution Logs</h3>
          <div className="flex-1 bg-black/40 rounded-xl p-4 font-mono text-xs text-green-400/80 overflow-y-auto space-y-2 max-h-[300px]">
            {status.logs.length === 0 ? (
              <p className="text-gray-600">No logs available...</p>
            ) : (
              status.logs.map((log, i) => (
                <div key={i} className="border-l border-green-500/30 pl-3">
                  <span className="text-white/30 mr-2">
                    [{new Date().toLocaleTimeString()}]
                  </span>
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
