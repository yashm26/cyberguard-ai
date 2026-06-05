"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useRef } from "react";
import { ScanCard } from "@/components/ScanCard";
import { GlitchText, useGlitchEffect } from "@/components/GlitchText";

const SCAN_CARDS = [
  {
    url: "hxxps://login-verify-secure-paypa1.tk",
    status: "threat" as const,
    score: 94,
    details: [
      { label: "DOMAIN AGE", value: "3 DAYS" },
      { label: "SSL", value: "NONE" },
      { label: "CONFIDENCE", value: "94.2%" },
    ],
    delay: 0.1,
  },
  {
    url: "https://quarterly_report_2024.pdf",
    status: "safe" as const,
    score: 8,
    details: [
      { label: "TYPE", value: "PDF DOC" },
      { label: "SSL", value: "VALID" },
      { label: "CONFIDENCE", value: "8.1%" },
    ],
    delay: 0.2,
  },
  {
    url: "https://corporate-login.example.com",
    status: "scanning" as const,
    score: 45,
    details: [
      { label: "STATUS", value: "ANALYZING..." },
      { label: "ETA", value: "0.4s" },
    ],
    delay: 0.3,
  },
];

const STATS = [
  { value: "2.4M+", label: "URLS SCANNED" },
  { value: "98.7%", label: "ACCURACY" },
  { value: "0.3s", label: "RESPONSE TIME" },
];

export default function Home() {
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);

  // Fast glitch reveals — 100ms / 300ms / 600ms delays, 10ms speed
  useGlitchEffect(eyebrowRef, "// AI-POWERED THREAT DETECTION", 100, 10);
  useGlitchEffect(headlineRef, "DEFEND AGAINST PHISHING & MALWARE", 300, 10);
  useGlitchEffect(
    bodyRef,
    "Real-time phishing detection and malware analysis powered by machine learning. Scan URLs and files instantly to neutralize digital threats before they breach your perimeter.",
    600,
    10
  );

  return (
    <div className="w-full min-h-[calc(100vh-64px)] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 pb-20">
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 items-center">

        {/* ─── LEFT: Copy ─────────────────────────────────────────── */}
        <div className="flex flex-col items-start w-full">

          {/* Eyebrow tag */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3 py-1 mb-5"
            style={{
              background: "rgba(0,212,255,0.08)",
              border: "1px solid rgba(0,212,255,0.35)",
            }}
          >
            <span
              className="pulse-dot"
              style={{
                width: 6, height: 6, borderRadius: "50%",
                background: "var(--neon-cyan)", display: "inline-block",
              }}
            />
            <span
              ref={eyebrowRef}
              style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: 10,
                letterSpacing: "2px",
                color: "var(--neon-cyan)",
              }}
            >
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            ref={headlineRef}
            style={{
              fontFamily: "'Orbitron', sans-serif",
              fontWeight: 900,
              fontSize: "clamp(26px, 4vw, 48px)",
              lineHeight: 1.25,
              color: "var(--neon-green)",
              textShadow: "0 0 24px rgba(0,255,65,0.25)",
              marginBottom: 24,
              letterSpacing: "2px",
              width: "100%",
            }}
          >
            DEFEND AGAINST PHISHING &amp; MALWARE
          </motion.h1>

          {/* Body */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            ref={bodyRef}
            style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: "clamp(15px, 1.8vw, 18px)",
              lineHeight: 1.85,
              color: "rgba(0,255,65,0.7)",
              maxWidth: 650,
              marginBottom: 40,
              letterSpacing: "0.5px",
            }}
          >
            Real-time phishing detection and malware analysis powered by machine learning. Scan URLs and files instantly to neutralize digital threats before they breach your perimeter.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="flex flex-wrap items-center gap-3 mb-10"
          >
            <Link
              href="/scan"
              className="btn-primary"
              style={{ fontSize: 11, padding: "12px 28px" }}
            >
              [ SCAN URL NOW ]
            </Link>
            <Link
              href="/upload"
              className="btn-secondary"
              style={{ fontSize: 11, padding: "12px 28px" }}
            >
              [ UPLOAD FILE ]
            </Link>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex flex-wrap gap-6 sm:gap-10"
          >
            {STATS.map((stat, i) => (
              <div key={i} className="flex flex-col">
                <span
                  style={{
                    fontFamily: "'Orbitron', sans-serif",
                    fontWeight: 700,
                    fontSize: "clamp(18px, 2vw, 22px)",
                    color: i === 1 ? "var(--neon-cyan)" : "var(--neon-green)",
                    lineHeight: 1,
                  }}
                >
                  <GlitchText text={stat.value} delay={700 + i * 80} speed={10} />
                </span>
                <span
                  style={{
                    fontFamily: "'Share Tech Mono', monospace",
                    fontSize: 9,
                    letterSpacing: "1.5px",
                    color: "var(--text-muted)",
                    marginTop: 4,
                    textTransform: "uppercase",
                  }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ─── RIGHT: Live Scan Cards ──────────────────────────────── */}
        <div className="flex flex-col gap-3 w-full">
          {SCAN_CARDS.map((card, i) => (
            <ScanCard key={i} {...card} />
          ))}

          {/* Stats grid below cards */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-3 mt-1"
            style={{
              background: "rgba(0,255,65,0.04)",
              border: "1px solid var(--border-default)",
            }}
          >
            {STATS.map((stat, i) => (
              <div
                key={i}
                className="flex flex-col items-center py-4"
                style={{
                  borderRight: i < 2 ? "1px solid var(--border-default)" : "none",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Orbitron', sans-serif",
                    fontWeight: 700,
                    fontSize: "clamp(14px, 1.5vw, 18px)",
                    color: i === 1 ? "var(--neon-cyan)" : "var(--neon-green)",
                  }}
                >
                  {stat.value}
                </span>
                <span
                  style={{
                    fontFamily: "'Share Tech Mono', monospace",
                    fontSize: 8,
                    letterSpacing: "1px",
                    color: "var(--text-muted)",
                    marginTop: 4,
                    textTransform: "uppercase",
                  }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>

      </div>
    </div>
  );
}
