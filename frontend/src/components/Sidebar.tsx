import {
  LayoutDashboard,
  BrainCircuit,
  MessageSquare,
  Settings,
  Activity,
} from "lucide-react";

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

export default function Sidebar({ activeView, setActiveView }: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "prediction", label: "Inference", icon: BrainCircuit },
    { id: "training", label: "Training", icon: Activity },
    { id: "chat", label: "AI Assistant", icon: MessageSquare },
  ];

  return (
    <div className="w-64 h-full glass-dark border-r border-white/10 flex flex-col p-6 gap-8">
      <div className="flex items-center gap-3 px-2">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-500 p-2 rounded-xl shadow-lg shadow-indigo-500/20">
          <BrainCircuit className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
          DeepVision
        </h1>
      </div>

      <nav className="flex-1 flex flex-col gap-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group
              ${
                activeView === item.id
                  ? "bg-white/10 text-white shadow-lg shadow-black/20"
                  : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
              }`}
          >
            <item.icon
              className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110
              ${activeView === item.id ? "text-indigo-400" : "text-gray-500"}`}
            />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-white/5">
        <button className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-gray-200 w-full transition-colors">
          <Settings className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </button>
      </div>
    </div>
  );
}
