"use client";

import { useState } from "react";
import Link from "next/link";
import { Code2 } from "lucide-react";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
  ClerkLoaded,
} from "@clerk/nextjs";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="w-full bg-[#0f0f17] text-white fixed top-0 left-0 z-50 border-b border-gray-800">
      <div className="max-w-8xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* LEFT - LOGO */}
        <Link href="/about">
          <h1 className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-teal-400 to-sky-500 bg-clip-text text-transparent flex items-center gap-2 cursor-pointer">
            <svg
              className="w-6 h-6 text-sky-400"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2a10 10 0 110 20 10 10 0 010-20zm1 5h-2v6l5 3 .8-1.6-3.8-2.2V7z" />
            </svg>
            Perplexa-AI
          </h1>
        </Link>

        {/* DESKTOP RIGHT SECTION */}
        <div className="hidden md:flex items-center gap-4">
          <ClerkLoaded>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="px-4 py-1.5 rounded-md bg-gray-700 hover:bg-gray-600 transition">
                  Sign In
                </button>
              </SignInButton>

              <SignUpButton mode="modal">
                <button className="px-4 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 transition">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>

            <SignedIn>
              <div className="flex items-center gap-3">
                {/* Perplexa AI Button */}
                <Link
                  href="/chat"
                  className="flex items-center gap-2 rounded-xl border border-sky-400/70 px-4 py-2 text-sm font-medium text-sky-500
                 transition-all duration-200 hover:bg-sky-500 hover:text-white hover:shadow-md active:scale-[0.97]"
                >
                  <Code2 size={16} />
                  <span>Perplexa AI</span>
                </Link>

                {/* My Chats Button */}
                <Link
                  href="/chat/getChats"
                  className="flex items-center gap-2 rounded-xl border border-sky-400/70 px-4 py-2 text-sm font-medium text-sky-500
                 transition-all duration-200 hover:bg-sky-500 hover:text-white hover:shadow-md active:scale-[0.97]"
                >
                  <Code2 size={16} />
                  <span>My Chats</span>
                </Link>

                <UserButton afterSignOutUrl="/about" />
              </div>
            </SignedIn>
          </ClerkLoaded>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          className="md:hidden text-white text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      {/* MOBILE DROPDOWN */}
      {menuOpen && (
        <div className="md:hidden bg-[#0f0f17] border-t border-gray-800 px-4 pb-4 space-y-4">
          <Link href="/" onClick={() => setMenuOpen(false)}>
            Home
          </Link>
          <Link href="/dashboard" onClick={() => setMenuOpen(false)}>
            Dashboard
          </Link>
          <Link href="/about" onClick={() => setMenuOpen(false)}>
            About
          </Link>

          <Link
            href="/chat"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-1 rounded-md text-sky-400 border border-sky-400 px-4 py-2 text-sm transition hover:bg-sky-400 hover:text-white"
          >
            <Code2 size={16} /> Perplexa AI
          </Link>

          <ClerkLoaded>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="w-full px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600 transition">
                  Sign In
                </button>
              </SignInButton>

              <SignUpButton mode="modal">
                <button className="w-full px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 transition">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>

            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </ClerkLoaded>
        </div>
      )}
    </nav>
  );
}
