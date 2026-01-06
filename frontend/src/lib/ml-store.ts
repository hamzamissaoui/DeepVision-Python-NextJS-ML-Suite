import { create } from "zustand";

interface MLStatus {
  is_training: boolean;
  last_run: string | null;
  current_epoch: number;
  total_epochs: number;
  logs: string[];
}

interface MLStore {
  status: MLStatus;
  metrics: any;
  setStatus: (status: MLStatus) => void;
  setMetrics: (metrics: any) => void;
  fetchStatus: () => Promise<void>;
}

export const useMLStore = create<MLStore>((set) => ({
  status: {
    is_training: false,
    last_run: null,
    current_epoch: 0,
    total_epochs: 0,
    logs: [],
  },
  metrics: null,
  setStatus: (s: MLStatus) => set({ status: s }),
  setMetrics: (metrics: any) => set({ metrics: metrics }),
  fetchStatus: async () => {
    try {
      const response = await fetch("http://localhost:8000/status");
      const data = await response.json();
      set({ status: data });
    } catch (error) {
      console.error("Failed to fetch ML status:", error);
    }
  },
}));
