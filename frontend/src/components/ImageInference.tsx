"use client";

import {
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  Loader2,
  Brain,
} from "lucide-react";
import { useState, useRef } from "react";

export default function ImageInference() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(selectedFile);
      setResult(null);
    }
  };

  const handleRunInference = async () => {
    if (!file) return;
    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8000/predict/CustomCNN", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Inference failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 h-full overflow-y-auto space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
      <div>
        <h2 className="text-3xl font-bold text-white">Model Inference</h2>
        <p className="text-gray-400 mt-1">
          Classify Fashion MNIST images using trained models
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="glass rounded-3xl border-2 border-dashed border-white/10 p-12 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-indigo-500/50 hover:bg-white/5 transition-all group"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="w-48 h-48 object-contain rounded-xl shadow-2xl"
              />
            ) : (
              <div className="p-6 rounded-full bg-white/5 group-hover:scale-110 transition-transform">
                <Upload className="w-10 h-10 text-indigo-400" />
              </div>
            )}
            <p className="text-gray-400 text-center font-medium">
              {file ? file.name : "Click or drag image to upload"}
            </p>
          </div>

          <button
            onClick={handleRunInference}
            disabled={!file || loading}
            className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-2xl shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-3 transition-all"
          >
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <Brain className="w-6 h-6" />
            )}
            {loading ? "Analyzing..." : "Run Inference"}
          </button>
        </div>

        <div className="glass rounded-3xl p-8 space-y-8">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-green-400" />
            Prediction Results
          </h3>

          {result ? (
            <div className="space-y-6 animate-in zoom-in-95 duration-500">
              <div className="flex justify-between items-end p-6 bg-white/5 rounded-2xl border border-white/5">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">
                    Predicted Class
                  </p>
                  <h4 className="text-4xl font-black text-white mt-1 uppercase italic tracking-tighter">
                    {result.class_name}
                  </h4>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">
                    Confidence
                  </p>
                  <p className="text-3xl font-mono text-indigo-400">
                    {(result.confidence * 100).toFixed(2)}%
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-gray-400">
                  Probability Distribution
                </p>
                <div className="space-y-3">
                  {/* Dummy distribution bars */}
                  {[result.class_name, "Other", "Other"].map((label, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs text-gray-500 font-mono">
                        <span>{label}</span>
                        <span>
                          {idx === 0
                            ? (result.confidence * 100).toFixed(1)
                            : (Math.random() * 20).toFixed(1)}
                          %
                        </span>
                      </div>
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${
                            idx === 0
                              ? "from-indigo-500 to-purple-500"
                              : "from-gray-700 to-gray-600"
                          }`}
                          style={{
                            width: `${
                              idx === 0
                                ? result.confidence * 100
                                : Math.random() * 20
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-20 opacity-30">
              <ImageIcon className="w-20 h-20 text-gray-600" />
              <p className="text-gray-500 font-medium">
                Upload an image to see results
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
