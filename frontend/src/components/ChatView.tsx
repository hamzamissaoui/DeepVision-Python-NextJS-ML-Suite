"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Trash2, Bot, User, Loader2 } from "lucide-react";
import { useChatStore } from "@/lib/store";

export default function ChatView() {
  const [input, setInput] = useState("");
  const { messages, isLoading, addMessage, clearMessages, setLoading } =
    useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setLoading(true);

    addMessage({ role: "user", content: userMessage });

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            ...messages.map((m) => ({ role: m.role, content: m.content })),
            { role: "user", content: userMessage },
          ],
        }),
      });

      if (!response.ok) throw new Error("Failed to fetch");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          assistantMessage += chunk;
        }
      }

      addMessage({ role: "assistant", content: assistantMessage });
    } catch (error) {
      console.error("Error:", error);
      addMessage({
        role: "assistant",
        content: "Sorry, there was an error processing your request.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-top-4 duration-700">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10 px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-500 p-2.5 rounded-xl shadow-lg">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">AI Assistant</h1>
              <p className="text-sm text-gray-400">
                Knowledgeable in DeepVision Suite
              </p>
            </div>
          </div>

          {messages.length > 0 && (
            <button
              onClick={clearMessages}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 
                       text-red-400 rounded-lg transition-all border border-red-500/20"
            >
              <Trash2 className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Clear Session
              </span>
            </button>
          )}
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {messages.length === 0 ? (
            <div className="text-center py-20 animate-in zoom-in-95 duration-1000">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full"></div>
                <div
                  className="relative bg-gradient-to-br from-indigo-500 to-purple-500 w-24 h-24 rounded-3xl 
                            flex items-center justify-center mx-auto mb-8 shadow-2xl"
                >
                  <Bot className="w-12 h-12 text-white" />
                </div>
              </div>
              <h2 className="text-4xl font-black text-white mb-4 tracking-tight">
                How can I help you?
              </h2>
              <p className="text-gray-400 text-lg max-w-md mx-auto leading-relaxed">
                Ask me about model architectures, training hyperparameters, or
                deployment diagnostics.
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-6 ${
                  message.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg
                    ${
                      message.role === "assistant"
                        ? "bg-gradient-to-br from-indigo-500 to-purple-500"
                        : "bg-white/10 border border-white/10"
                    }`}
                >
                  {message.role === "assistant" ? (
                    <Bot className="w-5 h-5 text-white" />
                  ) : (
                    <User className="w-5 h-5 text-gray-300" />
                  )}
                </div>

                <div
                  className={`max-w-[80%] px-6 py-4 rounded-2xl shadow-xl ${
                    message.role === "user"
                      ? "bg-indigo-600/90 text-white rounded-tr-none"
                      : "glass text-gray-100 rounded-tl-none border border-white/10"
                  }`}
                >
                  <p className="whitespace-pre-wrap leading-relaxed text-[15px]">
                    {message.content}
                  </p>
                  <span className="text-[10px] opacity-40 mt-3 block font-mono">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))
          )}

          {isLoading && (
            <div className="flex gap-6">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-500 w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="glass px-6 py-4 rounded-2xl rounded-tl-none border border-white/10">
                <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input */}
      <footer className="bg-black/20 backdrop-blur-sm border-t border-white/10 px-8 py-8 transition-all">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto group">
          <div className="relative flex items-end gap-4 bg-white/5 border border-white/10 p-2 rounded-2xl focus-within:border-indigo-500/50 transition-all">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything..."
              rows={1}
              className="flex-1 px-4 py-3 bg-transparent text-white 
                       placeholder-gray-500 rounded-xl resize-none focus:outline-none"
              disabled={isLoading}
            />

            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="bg-indigo-600 hover:bg-indigo-500 p-3 rounded-xl 
                       transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-20 
                       disabled:cursor-not-allowed group-hover:scale-105 active:scale-95"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 text-white animate-spin" />
              ) : (
                <Send className="w-5 h-5 text-white" />
              )}
            </button>
          </div>

          <p className="text-[10px] text-gray-600 uppercase tracking-widest text-center mt-3 font-bold">
            GPT-3.5 Intelligence Engine • Session{" "}
            {new Date().toLocaleDateString()}
          </p>
        </form>
      </footer>
    </div>
  );
}
