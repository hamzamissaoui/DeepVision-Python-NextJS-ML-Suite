"use client";

import { useMLStore } from "@/lib/ml-store";
import {
  Play,
  Square,
  Settings2,
  BarChart3,
  Binary,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";

export default function TrainingView() {
  const { status, fetchStatus } = useMLStore();
  const [smokeTest, setSmokeTest] = useState(true);

  const handleStartTraining = async () => {
    try {
      await fetch(`http://localhost:8000/train?smoke_test=${smokeTest}`, {
        method: "POST",
      });
      fetchStatus();
    } catch (error) {
      console.error("Start training failed:", error);
    }
  };

  const models = [
    { name: "Custom CNN", status: "Active", accuracy: "0.92" },
    { name: "ResNet50 Transfer", status: "Enabled", accuracy: "0.94" },
    { name: "Vision Transformer", status: "Enabled", accuracy: "0.91" },
  ];

  return (
    <div className="p-8 h-full overflow-y-auto space-y-8 animate-in fade-in slide-in-from-left-4 duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white">Pipeline Training</h2>
          <p className="text-gray-400 mt-1">
            Configure and execute deep learning training jobs
          </p>
        </div>
        <div className="flex gap-4">
          {status.is_training ? (
            <button className="flex items-center gap-2 px-6 py-3 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition-all font-bold">
              <Square className="w-5 h-5 fill-current" />
              Stop Job
            </button>
          ) : (
            <button
              onClick={handleStartTraining}
              className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-all font-bold shadow-lg shadow-indigo-500/20"
            >
              <Play className="w-5 h-5 fill-current" />
              Start Training
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          <div className="glass rounded-3xl p-8 space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Settings2 className="w-6 h-6 text-indigo-400" />
              Runtime Configuration
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="text-sm font-medium text-gray-400">
                  Execution Mode
                </label>
                <div className="flex bg-black/40 p-1.5 rounded-2xl gap-2">
                  <button
                    onClick={() => setSmokeTest(true)}
                    className={`flex-1 py-3 rounded-xl transition-all font-bold text-sm ${
                      smokeTest
                        ? "bg-indigo-600 text-white shadow-lg"
                        : "text-gray-500 hover:text-gray-300"
                    }`}
                  >
                    Smoke Test
                  </button>
                  <button
                    onClick={() => setSmokeTest(false)}
                    className={`flex-1 py-3 rounded-xl transition-all font-bold text-sm ${
                      !smokeTest
                        ? "bg-indigo-600 text-white shadow-lg"
                        : "text-gray-500 hover:text-gray-300"
                    }`}
                  >
                    Full Release
                  </button>
                </div>
                <p className="text-[10px] text-gray-500 px-2 uppercase tracking-widest leading-relaxed">
                  {smokeTest
                    ? "Executes a quick 1-epoch run with subset of data for validation."
                    : "Full training run using current Config.py parameters."}
                </p>
              </div>

              <div className="space-y-4 opacity-50 cursor-not-allowed">
                <label className="text-sm font-medium text-gray-400">
                  Optimization
                </label>
                <div className="flex bg-black/40 p-3 rounded-2xl items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Binary className="w-5 h-5 text-indigo-400" />
                    <span className="text-sm text-gray-300">
                      Mixed Precision FP16
                    </span>
                  </div>
                  <div className="w-10 h-6 bg-indigo-600 rounded-full flex items-center px-1">
                    <div className="w-4 h-4 bg-white rounded-full ml-auto"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="glass rounded-3xl p-8 space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-purple-400" />
              Multi-Model Ensemble Info
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {models.map((m, i) => (
                <div
                  key={i}
                  className="bg-white/5 border border-white/5 p-5 rounded-2xl space-y-3"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500 uppercase font-black">
                      {m.status}
                    </span>
                    <ShieldCheck className="w-4 h-4 text-green-500" />
                  </div>
                  <p className="text-sm font-bold text-white">{m.name}</p>
                  <div className="flex items-end gap-2 text-indigo-400">
                    <span className="text-2xl font-mono leading-none">
                      {m.accuracy}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-gray-500 mb-1">
                      Acc
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="glass rounded-3xl p-8 flex flex-col gap-6">
          <h3 className="text-xl font-bold text-white">Resource Allocation</h3>
          <div className="space-y-6 flex-1">
            {[
              {
                label: "Tensor Cores",
                value: 80,
                color: "from-indigo-500 to-indigo-600",
              },
              {
                label: "Batch Workers",
                value: 65,
                color: "from-purple-500 to-purple-600",
              },
              {
                label: "Data Pipeline",
                value: 95,
                color: "from-blue-500 to-blue-600",
              },
            ].map((r, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-400">
                  <span>{r.label}</span>
                  <span>{r.value}%</span>
                </div>
                <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${r.color} rounded-full`}
                    style={{ width: `${r.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-auto p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
            <p className="text-xs text-indigo-300 leading-relaxed italic">
              Note: System automatically optimizes thread counts and memory
              growth during startup.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
