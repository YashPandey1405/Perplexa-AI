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
  // ================= STATE VARIABLES =================
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

  useEffect(() => {
    alert(
      `✨ Your Text & Voice Agent is ready!\n\n` +
        `⚡ Image processing is currently in progress.\n\n` +
        `💡 Memory support via Mem0 & VectorDB coming soon! 🚀`
    );
  }, []);

  // ================= SCROLL TO BOTTOM =================
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ================= SEND MESSAGE =================
  const handleSend = async () => {
    if (!input.trim()) return; // Don't send empty messages
    if (isAgentActive) return; // Don't send when agent is active

    // Construct message
    let messageToSend = input;
    if (profileImageURL) {
      messageToSend = [
        { type: "text", text: input },
        { type: "image_url", image_url: { url: profileImageURL } },
      ];
    }

    const newMessages = [...messages, { role: "user", content: messageToSend }];
    setMessages(newMessages);
    setLoading(true);

    // Clear input & image preview
    setInput("");
    setProfileImage(null);

    console.log("Sending message to backend:", messageToSend);

    try {
      const res = await axios.post(
        "/api/response",
        { message: messageToSend },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("Received response:", res.data.output);
      setMessages([
        ...newMessages,
        { role: "assistant", content: res.data.output },
      ]);
    } catch (error) {
      console.error("API error:", error);
      toast.error("Sorry, something went wrong. Please try again.");
      setMessages([
        ...newMessages,
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

  // ================= ENTER KEY HANDLER =================
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !loading && !isAgentActive) {
      handleSend();
    }
  };

  // ================= AGENT CONTROL =================
  async function handleStartAgent() {
    if (isAgentActive) {
      console.log("Agent session already running");
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
          console.log("Agent sent message:", message.content);
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
  }

  async function handleCloseAgent() {
    if (!session) return;
    try {
      await session.close();
      console.log("Session closed successfully!");
      toast.success("Agent session closed.");
    } catch (err) {
      console.error("❌ Error closing session:", err);
      toast.error("Error closing agent session.");
    } finally {
      setSession(null);
      setIsAgentActive(false);
    }
  }

  // ================= IMAGE UPLOAD =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const file = e.target.files[0];
      if (!file) {
        console.warn("No file selected");
        return;
      }

      // Show preview
      const previewURL = URL.createObjectURL(file);
      setProfileImage(previewURL);

      const formData = new FormData();
      formData.append("file", file);

      console.log("Uploading file to backend...");
      const response = await axios.post("/api/upload", formData);
      console.log("Upload successful:", response.data);

      setProfileImageURL(response.data.url);
      toast.success("File uploaded successfully!");
      console.log("Image URL set:", profileImageURL);
    } catch (error) {
      console.error(
        "File upload failed:",
        error.response?.data || error.message
      );
      toast.error("File upload failed!");
    }
  };

  // ================= RENDER =================
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col font-sans antialiased">
      <Toaster position="top-center" reverseOrder={false} />

      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-10 bg-gray-950/70 backdrop-blur-lg border-b border-gray-800 px-8 py-4 flex justify-between items-center shadow-2xl">
        <Link href="/about">
          <h1 className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-teal-400 to-sky-500 bg-clip-text text-transparent flex items-center gap-2 cursor-pointer">
            <svg
              className="w-6 h-6 text-sky-400"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 16H9v-2h2v2zm-1-4h-1v-4h1v4zm4 4h-2v-2h2v2zm-1-4h-2v-4h2v4zm-3-5V7h2v2h-2zm-3-2v2h2V7H8zm4-2v-2h2v2h-2zM8 5v2h2V5H8zm-3 2v2h2V7H5zm12 5h-2v-2h2v2zm0 4h-2v-2h2v2zm-3-4h-2v-4h2v4z" />
            </svg>
            Perplexa-AI
          </h1>
        </Link>

        <div className="flex items-center gap-2">
          {isAgentActive ? (
            <button
              onClick={handleCloseAgent}
              className="flex items-center gap-1 rounded-full text-red-400 border border-red-400 px-3 py-1 text-sm transition-colors hover:bg-red-400 hover:text-white"
            >
              <X size={16} /> Close Agent
            </button>
          ) : (
            <button
              onClick={handleStartAgent}
              className="flex items-center gap-1 rounded-full text-green-400 border border-green-400 px-3 py-1 text-sm transition-colors hover:bg-green-400 hover:text-white"
            >
              <Mic size={16} /> Start Agent
            </button>
          )}
        </div>
      </header>

      {/* ================= CHAT AREA ================= */}
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
            {/* User/Assistant Icon */}
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-sky-500/10 flex items-center justify-center border border-sky-600/30">
              {msg.role === "assistant" ? (
                <Bot size={20} className="text-sky-400" />
              ) : (
                <User size={20} className="text-sky-400" />
              )}
            </div>

            {/* Message Bubble */}
            <div
              className={`max-w-[85%] md:max-w-[65%] p-4 rounded-3xl shadow-lg backdrop-blur-sm transition-all duration-300 flex flex-col ${
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
                      className="whitespace-pre-line text-sm md:text-base leading-relaxed mt-2"
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
                <p className="whitespace-pre-line text-sm md:text-base leading-relaxed mt-2">
                  {msg.content}
                </p>
              )}
            </div>
          </motion.div>
        ))}

        {/* Loading Skeleton */}
        {loading && (
          <div className="flex items-start gap-3 justify-start">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-sky-500/10 flex items-center justify-center border border-sky-600/30">
              <Bot size={20} className="text-sky-400" />
            </div>
            <div className="bg-gray-800/60 border border-gray-700/50 px-5 py-3 rounded-3xl rounded-bl-none text-gray-400 animate-pulse shadow-md">
              <div className="w-16 h-2 bg-gray-600 rounded"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* ================= INPUT AREA ================= */}
      <footer className="sticky bottom-0 z-10 bg-gray-950/70 backdrop-blur-lg border-t border-gray-800 p-4">
        <div className="flex gap-4 max-w-5xl mx-auto items-center">
          {/* Text input + buttons */}
          <div className="relative flex-1 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                isAgentActive
                  ? "Agent is active. Speak to the microphone."
                  : "Ask Yash AI-Assistant..."
              }
              className={`w-full bg-gray-800/50 border border-gray-700/60 rounded-full pr-28 pl-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all placeholder-gray-500 ${
                isAgentActive && "opacity-60 cursor-not-allowed"
              }`}
              disabled={loading || isAgentActive}
            />

            {/* Buttons */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {/* Image upload */}
              <label className="flex items-center justify-center px-3 py-2 bg-gray-700 hover:bg-gray-600 text-sm rounded-lg cursor-pointer transition">
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

              {/* Send button */}
              <button
                onClick={handleSend}
                disabled={
                  loading ||
                  (!input.trim() && !profileImageURL) ||
                  isAgentActive
                }
                className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-sky-600 hover:bg-sky-700 rounded-full font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg"
              >
                <Send size={18} className="text-white" />
              </button>
            </div>
          </div>

          {/* Small preview */}
          {profileImage && (
            <img
              src={profileImage}
              alt="Preview"
              className="w-14 h-14 object-cover rounded-lg border border-gray-600"
            />
          )}
        </div>
      </footer>
    </div>
  );
}
