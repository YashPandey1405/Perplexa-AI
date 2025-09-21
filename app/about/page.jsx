"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import batchLectures from "@/Learning-Curve.js";
import { Github, Linkedin, Code2, Heart } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col font-sans antialiased">
      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-10 bg-gray-950/70 backdrop-blur-lg border-b border-gray-800 px-8 py-4 flex justify-between items-center shadow-2xl">
        <h1 className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-teal-400 to-sky-500 bg-clip-text text-transparent flex items-center gap-2">
          Gen-AI Journey
        </h1>
        <div className="flex items-center gap-4">
          <Link
            href="/chat"
            className="flex items-center gap-1 rounded-full text-sky-400 border border-sky-400 px-4 py-2 text-sm transition-colors hover:bg-sky-400 hover:text-white"
          >
            <Code2 size={16} /> Perplexa-AI Project
          </Link>
        </div>
      </header>

      {/* ================= INTRO SECTION ================= */}
      <section className="px-8 py-16 max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-shrink-0"
        >
          <Image
            src="https://res.cloudinary.com/dah7l8utl/image/upload/v1758434713/IMG_20250719_212736_n6jbuo.jpg"
            alt="Yash Pandey"
            width={220}
            height={220}
            className="rounded-3xl border-2 border-sky-400 shadow-lg object-cover"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-4"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-sky-400">
            Hi, I am Yash Pandey
          </h2>
          <p className="text-gray-300 leading-relaxed text-sm md:text-base">
            Full-stack MERN developer and data scientist with expertise in
            JavaScript, TypeScript, Python, and Java. Proficient in Next.js,
            React, Node.js, Express.js, Material-UI, and advanced backend
            systems (JWT, WebSockets, Redis, CI/CD). Strong in AI, ML, and Deep
            Learning with 700+ DSA problems solved and hackathon experience.
            Recently focused on Generative AI, OpenAI SDKs, LangGraph, and
            advanced agent architectures. Skilled in AWS, Docker, and real-time
            collaboration systems.
          </p>
          <div className="flex gap-4 mt-4">
            <Link href="https://github.com/YashPandey1405" target="_blank">
              <Github className="w-6 h-6 text-gray-400 hover:text-sky-400" />
            </Link>
            <Link
              href="https://www.linkedin.com/in/yashpandey29/"
              target="_blank"
            >
              <Linkedin className="w-6 h-6 text-gray-400 hover:text-sky-400" />
            </Link>
            <Link href="https://leetcode.com/u/pandeyyash041/" target="_blank">
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/1/19/LeetCode_logo_black.png"
                alt="LeetCode"
                width={26}
                height={26}
                className="opacity-70 hover:opacity-100"
              />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ================= CERTIFICATES ================= */}
      <section className="px-8 py-16 bg-gray-900 border-y border-gray-800">
        <h2 className="text-2xl font-bold text-sky-400 text-center mb-10">
          Achievements & Certificates
        </h2>

        {/* Certificate Full Row */}
        <div className="max-w-4xl mx-auto mb-12">
          <Image
            src="/GenAI_Certificate.jpg"
            alt="GenAI Certificate"
            width={1000}
            height={600}
            className="w-full rounded-2xl shadow-xl border border-gray-700"
          />
        </div>

        {/* Graduation Test */}
        <h3 className="text-xl font-semibold text-sky-300 text-center mb-6">
          Got 100/100 In Graduation Test Of GenAI With JS Batch
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-10">
          <Image
            src="/Result-1.png"
            alt="Graduation Test 1"
            width={600}
            height={400}
            className="rounded-xl shadow-lg border border-gray-700"
          />
          <Image
            src="/Result-2.png"
            alt="Graduation Test 2"
            width={600}
            height={400}
            className="rounded-xl shadow-lg border border-gray-700"
          />
        </div>

        {/* Notes Button */}
        <div className="text-center mt-6">
          <Link
            href="https://www.notion.so/Gen-AI-Dev-Notes-By-Yash-Pandey-25e61dc098e680cba43cd87e419a280c"
            target="_blank"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-400 to-sky-500 text-gray-900 font-semibold rounded-full shadow-lg hover:scale-105 transition-transform duration-300"
          >
            📘 Get My Notes
          </Link>
        </div>
      </section>

      {/* ================= BATCH LECTURES ================= */}
      <section className="px-8 py-16 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-sky-400 text-center mb-12">
          GenAI With JS Batch Journey
        </h2>
        <div className="space-y-10">
          {batchLectures.map((video, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 shadow-xl hover:border-sky-500/50 transition"
            >
              <h3 className="text-lg font-semibold text-sky-300 mb-2">
                {video.videoNo}. {video.videoTitle}
              </h3>
              <ul className="list-disc list-inside text-gray-300 text-sm space-y-1 mb-4">
                {video.learnings.map((learn, i) => (
                  <li key={i}>{learn}</li>
                ))}
              </ul>
              <div className="flex justify-between text-xs text-gray-400">
                <span>📅 {video.date}</span>
                {video.github && (
                  <Link
                    href={video.github}
                    target="_blank"
                    className="text-sky-400 hover:text-sky-300"
                  >
                    🔗 GitHub Repo
                  </Link>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="px-6 py-6 bg-gray-950 border-t border-gray-800 text-center text-gray-400">
        Made With <Heart size={16} className="inline text-red-500 mx-1" /> By
        Yash Pandey
      </footer>
    </div>
  );
}
