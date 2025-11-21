"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import axios from "axios";
import { motion } from "framer-motion";
import { RealtimeSession } from "@openai/agents/realtime";
import { agent } from "./Agent";
import { Send, Bot, User, Mic, X } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

export default function Home() {
  /* =========================================================
   *                     STATE VARIABLES
   * =======================================================*/
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState(
    "Who is Yash Pandey Beyond Coding Skills?"
  );
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState(null);
  const [isAgentActive, setIsAgentActive] = useState(false);

  const [profileImage, setProfileImage] = useState(null);
  const [profileImageURL, setProfileImageURL] = useState("");

  const messagesEndRef = useRef(null);

  /* =========================================================
   *                     ON MOUNT
   * =======================================================*/
  useEffect(() => {
    alert(
      `✨ Your Text & Voice Agent is ready!\n\n` +
        `⚡ Image processing is currently in progress.\n\n` +
        `💡 Memory support via Mem0 & VectorDB coming soon! 🚀`
    );
  }, []);

  /* =========================================================
   *                     SCROLL TO BOTTOM
   * =======================================================*/
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /* =========================================================
   *                     SEND MESSAGE
   * =======================================================*/
  const handleSend = async () => {
    if (!input.trim() || isAgentActive) return;

    let messageToSend = input;

    if (profileImageURL) {
      messageToSend = [
        { type: "text", text: input },
        { type: "image_url", image_url: { url: profileImageURL } },
      ];
    }

    setMessages((prev) => [...prev, { role: "user", content: messageToSend }]);
    setLoading(true);
    setInput("");
    setProfileImage(null);

    try {
      const response = await fetch("/api/response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageToSend }),
      });

      if (!response.body) throw new Error("Streaming not supported");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let assistantText = "";

      // Create empty assistant bubble
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunkText = decoder.decode(value);
        const lines = chunkText.split("\n").filter(Boolean);

        for (const line of lines) {
          const data = JSON.parse(line);

          if (!data.isCompleted) {
            assistantText += data.value;

            setMessages((prev) => {
              const updated = [...prev];
              updated[updated.length - 1] = {
                role: "assistant",
                content: assistantText,
              };
              return updated;
            });
          }
        }
      }
    } catch (error) {
      toast.error("Sorry, something went wrong. Please try again.");

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I'm having trouble connecting. Please try again.",
        },
      ]);
    } finally {
      setProfileImageURL("");
      setLoading(false);
    }
  };

  /* =========================================================
   *                     KEYBOARD HANDLER
   * =======================================================*/
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !loading && !isAgentActive) {
      handleSend();
    }
  };

  /* =========================================================
   *                     AGENT CONTROLS
   * =======================================================*/
  const handleStartAgent = async () => {
    if (isAgentActive) {
      toast.error("An agent session is already active.");
      return;
    }

    setLoading(true);
    toast.loading("Connecting to agent...", { id: "agent-toast" });

    try {
      const response = await axios.get("/api/agent");
      const tempKey = response.data.tempApiKey;

      const newSession = new RealtimeSession(agent);
      await newSession.connect({ apiKey: tempKey });

      newSession.on("message", (message) => {
        if (message.role === "assistant") {
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: message.content },
          ]);
        }
      });

      setSession(newSession);
      setIsAgentActive(true);
      toast.success("Agent connected! You can start talking.", {
        id: "agent-toast",
      });
    } catch (e) {
      console.error("❌ Connection failed:", e);
      toast.error("Failed to connect to agent.", { id: "agent-toast" });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseAgent = async () => {
    if (!session) return;

    try {
      await session.close();
      toast.success("Agent session closed.");
    } catch (err) {
      toast.error("Error closing agent session.");
    } finally {
      setSession(null);
      setIsAgentActive(false);
    }
  };

  /* =========================================================
   *                     IMAGE UPLOAD
   * =======================================================*/
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const file = e.target.files[0];
      if (!file) return;

      const previewURL = URL.createObjectURL(file);
      setProfileImage(previewURL);

      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post("/api/upload", formData);
      setProfileImageURL(response.data.url);

      toast.success("File uploaded successfully!");
    } catch (error) {
      toast.error("File upload failed!");
    }
  };

  /* =========================================================
   *                     RENDER UI
   * =======================================================*/
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col font-sans antialiased">
      <Toaster position="top-center" />

      {/* =====================================================
       *                     CHAT AREA
       * ===================================================*/}
      <main className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        {messages.map((msg, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`flex items-start gap-3 ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {/* Icon */}
            <div className="w-8 h-8 rounded-full bg-sky-500/10 border border-sky-600/30 flex items-center justify-center">
              {msg.role === "assistant" ? (
                <Bot size={20} className="text-sky-400" />
              ) : (
                <User size={20} className="text-sky-400" />
              )}
            </div>

            {/* Bubble */}
            <div
              className={`max-w-[85%] md:max-w-[65%] p-4 rounded-3xl shadow-lg backdrop-blur-sm ${
                msg.role === "user"
                  ? "bg-sky-600/60 text-white rounded-br-none"
                  : "bg-gray-800/60 border border-gray-700/50 text-gray-200 rounded-bl-none"
              }`}
            >
              {Array.isArray(msg.content) ? (
                msg.content.map((c, i) =>
                  c.type === "text" ? (
                    <p
                      key={i}
                      className="text-sm md:text-base leading-relaxed mt-2"
                    >
                      {c.text}
                    </p>
                  ) : (
                    <img
                      key={i}
                      src={c.image_url.url}
                      alt="Uploaded"
                      className="mb-2 max-w-[200px] max-h-[200px] rounded-lg border border-gray-600 object-contain self-center"
                    />
                  )
                )
              ) : (
                <p className="text-sm md:text-base leading-relaxed mt-2">
                  {msg.content}
                </p>
              )}
            </div>
          </motion.div>
        ))}

        {/* Loading bubble */}
        {loading && (
          <div className="flex items-start gap-3 justify-start">
            <div className="w-8 h-8 rounded-full bg-sky-500/10 border border-sky-600/30 flex items-center justify-center">
              <Bot size={20} className="text-sky-400" />
            </div>
            <div className="bg-gray-800/60 border border-gray-700/50 px-5 py-3 rounded-3xl rounded-bl-none text-gray-400 animate-pulse shadow-md">
              <div className="w-16 h-2 bg-gray-600 rounded" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* =====================================================
       *                     INPUT FOOTER
       * ===================================================*/}
      <footer className="sticky bottom-0 bg-gray-950/80 backdrop-blur-xl border-t border-gray-800 px-3 sm:px-6 py-3">
        <div className="flex items-end gap-3 max-w-5xl mx-auto">
          <div className="flex-1 relative">
            {/* INPUT */}
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                isAgentActive
                  ? "Agent is active. Speak to the microphone..."
                  : "Ask Yash AI-Assistant..."
              }
              disabled={loading || isAgentActive}
              className={`w-full bg-gray-900/60 border border-gray-700/60 
                rounded-full py-3 pl-5 pr-40 sm:pr-[180px]
                text-sm sm:text-base placeholder-gray-500
                focus:outline-none focus:ring-2 focus:ring-sky-500 
                transition-all shadow-[0_0_10px_rgba(255,255,255,0.05)]
                ${isAgentActive && "opacity-60 cursor-not-allowed"}`}
            />

            {/* UPLOAD + SEND */}
            <div className="absolute right-28 sm:right-[90px] top-1/2 -translate-y-1/2 flex items-center gap-2">
              <label className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-gray-700/80 hover:bg-gray-600 rounded-full cursor-pointer transition">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-sky-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zM4 5h12v2H4V5zm0 4h12v6H4V9z" />
                </svg>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleSubmit}
                />
              </label>

              <button
                onClick={handleSend}
                disabled={
                  loading ||
                  (!input.trim() && !profileImageURL) ||
                  isAgentActive
                }
                className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-sky-600 hover:bg-sky-700 rounded-full shadow-lg disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <Send size={17} className="text-white" />
              </button>
            </div>

            {/* VOICE / STOP */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              {isAgentActive ? (
                <button
                  onClick={handleCloseAgent}
                  className="flex items-center gap-1 px-2.5 py-1 text-[11px] sm:text-xs rounded-full bg-red-500/20 border border-red-400 text-red-300 hover:bg-red-500 hover:text-white transition"
                >
                  <X size={12} /> Stop
                </button>
              ) : (
                <button
                  onClick={handleStartAgent}
                  className="flex items-center gap-1 px-2.5 py-1 text-[11px] sm:text-xs rounded-full bg-green-500/20 border border-green-400 text-green-300 hover:bg-green-500 hover:text-white transition"
                >
                  <Mic size={12} /> Voice
                </button>
              )}
            </div>
          </div>

          {/* IMAGE PREVIEW */}
          {profileImage && (
            <img
              src={profileImage}
              alt="Preview"
              className="hidden sm:block w-12 h-12 sm:w-14 sm:h-14 object-cover rounded-lg border border-gray-600"
            />
          )}
        </div>
      </footer>
    </div>
  );
}
