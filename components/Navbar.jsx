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
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 16H9v-2h2v2zm-1-4h-1v-4h1v4zm4 4h-2v-2h2v2zm-1-4h-2v-4h2v4zm-3-5V7h2v2h-2zm-3-2v2h2V7H8zm4-2v-2h2v2h-2zM8 5v2h2V5H8zm-3 2v2h2V7H5zm12 5h-2v-2h2v2zm0 4h-2v-2h2v2zm-3-4h-2v-4h2v4z" />
            </svg>
            Perplexa-AI
          </h1>
        </Link>

        {/* DESKTOP RIGHT SECTION */}
        <div className="hidden md:flex items-center gap-4">
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
            <Link
              href="/chat"
              className="flex items-center gap-1 rounded-full text-sky-400 border border-sky-400 px-4 py-2 text-sm transition hover:bg-sky-400 hover:text-white"
            >
              <Code2 size={16} /> Perplexa AI
            </Link>
            <UserButton afterSignOutUrl="/about" />
          </SignedIn>
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
        </div>
      )}
    </nav>
  );
}
