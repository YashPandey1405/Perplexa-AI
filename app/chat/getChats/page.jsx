"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { countMessageTokens } from "@/utils/getTokenCount";
import Navbar from "@/components/Navbar";
import axios from "axios";

// The UseUser() Object Of The Clerk Model.......
import { useUser } from "@clerk/nextjs";

export default function Page() {
  const router = useRouter();

  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChat, setSelectedChat] = useState(null);

  // The Conversational ID & Clerk Object For Context Handling.....
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded || !user) return; // wait for Clerk user to load

    async function fetchChats() {
      try {
        const res = await axios.post(`/api/database/getUserChats`, {
          clerkId: user.id,
        });

        if (res.data?.chats) {
          setChats(res.data.chats);
          setSelectedChat(res.data.chats[0] || null);
        }
      } catch (error) {
        console.error("Error fetching chats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchChats();
  }, [isLoaded, user]);

  // UseEffect To Redirect User To /about Page When The User Isn't Logged In......
  useEffect(() => {
    // If Clerk finished loading AND user is missing → redirect
    if (isLoaded && !user) {
      router.push("/about");
    }
  }, [isLoaded, user, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40 text-gray-600">
        Loading chats...
      </div>
    );
  }

  return (
    <div className="flex h-[85vh] bg-[#0d0f12] text-white rounded-lg shadow-2xl border border-gray-800 m-4 overflow-hidden">
      <Navbar />
      {/* ================= LEFT SIDEBAR ================= */}
      <div className="w-72 border-r border-gray-800 bg-[#111317] overflow-y-auto">
        <h2 className="text-lg font-semibold p-4 border-b border-gray-800 bg-[#15171c]">
          Conversations
        </h2>

        {chats.length === 0 && (
          <p className="p-4 text-sm text-gray-400">No chats found.</p>
        )}

        <ul>
          {chats.map((chat) => (
            <li
              key={chat._id}
              onClick={() => setSelectedChat(chat)}
              className={`cursor-pointer px-4 py-3 border-b border-gray-800 transition-all
              ${
                selectedChat?._id === chat._id
                  ? "bg-[#1f2937] text-white font-medium"
                  : "hover:bg-[#1a1d24] text-gray-300"
              }
            `}
            >
              <p className="text-sm font-semibold truncate">
                {/* {chat.conversationId} */}
                {chat.chatHistory[0].content}
              </p>
              <p className="text-xs text-gray-500">
                Updated: {new Date(chat.updatedAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* ================= RIGHT PANEL ================= */}
      <div className="flex-1 p-5 overflow-auto bg-[#0d0f12]">
        {selectedChat ? (
          <>
            <div className="flex items-center justify-between mb-4">
              {/* LEFT SIDE — Chat + Preview */}
              <div className="flex items-center gap-2 text-gray-300">
                <span className="text-2xl font-bold text-indigo-400">
                  Chat —
                </span>

                <span className="truncate max-w-[400px] text-m text-gray-400">
                  {typeof selectedChat.chatHistory[0].content === "string"
                    ? selectedChat.chatHistory[0].content
                    : JSON.stringify(selectedChat.chatHistory[0].content)}
                </span>
              </div>

              {/* RIGHT SIDE — Count */}
              <span className="px-3 py-1 mr-3 rounded-full bg-indigo-600 text-white text-xs font-medium">
                {selectedChat.chatHistory.length}
              </span>
            </div>
            <ChatTable messages={selectedChat.chatHistory} />
          </>
        ) : (
          <div className="text-gray-400 text-center mt-10">
            Select a conversation from the left sidebar.
          </div>
        )}
      </div>
    </div>
  );
}

/* ===========================================================
   CHAT TABLE COMPONENT
=========================================================== */
function formatDateTimeShort(d) {
  const date = new Date(d);
  return date.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function ChatTable({ messages }) {
  const roleColors = {
    user: "bg-blue-900 text-blue-300 border border-blue-700",
    assistant: "bg-green-900 text-green-300 border border-green-700",
    system: "bg-yellow-900 text-yellow-300 border border-yellow-700",
    developer: "bg-gray-700 text-gray-200 border border-gray-600",
    tool: "bg-purple-900 text-purple-300 border border-purple-700",
    meta: "bg-red-900 text-red-300 border border-red-700",
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-800 bg-[#111317] shadow-lg">
      <table className="min-w-full text-sm">
        <thead className="bg-[#15171c] text-left border-b border-gray-800">
          <tr>
            <th className="p-3 text-gray-300">S No</th>
            <th className="p-3 text-gray-300">Role</th>
            <th className="p-3 text-gray-300">Message</th>
            <th className="p-3 text-gray-300">Time</th>
            <th className="p-3 text-gray-300">Tokens</th>
          </tr>
        </thead>

        <tbody>
          {messages.map((msg, index) => (
            <tr
              key={msg._id}
              className="border-t border-gray-800 hover:bg-[#1a1d24] transition duration-200"
            >
              {/* S No */}
              <td className="p-3 text-gray-400">{index + 1}</td>

              {/* Role */}
              <td className="p-3">
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    roleColors[msg.role] || "bg-gray-700 text-gray-200"
                  }`}
                >
                  {msg.role}
                </span>
              </td>

              {/* Message */}
              <td className="p-3 max-w-lg break-words whitespace-pre-wrap text-gray-200">
                {typeof msg.content === "string"
                  ? msg.content
                  : JSON.stringify(msg.content, null, 2)}
              </td>

              {/* Time */}
              <td className="p-3 text-gray-400">
                {formatDateTimeShort(msg.timestamp)}
                {/* {new Date(msg.timestamp).toLocaleString()} */}
              </td>

              {/* Tokens */}
              <td className="p-3 text-gray-600">
                {countMessageTokens(msg.role, msg.content)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
