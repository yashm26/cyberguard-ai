"use client";

import { motion } from "framer-motion";

const THREATS = [
  { item: "malware-download.xyz", status: "THREAT DETECTED", icon: "⚠", color: "text-[var(--neon-red)]" },
  { item: "cloudflare.com", status: "CLEAN", icon: "✓", color: "text-[var(--neon-green)]" },
  { item: "support-paypal-login.net", status: "PHISHING", icon: "⚠", color: "text-[var(--neon-amber)]" },
  { item: "google.com", status: "SAFE", icon: "✓", color: "text-[var(--neon-green)]" },
  { item: "free-gift-card-generator.ru", status: "MALWARE", icon: "⚠", color: "text-[var(--neon-red)]" },
  { item: "aws.amazon.com", status: "CLEAN", icon: "✓", color: "text-[var(--neon-green)]" },
];

export function LiveTicker() {
  // Duplicate array slightly so scrolling is continuous without a hard break 
  const displayItems = [...THREATS, ...THREATS, ...THREATS];

  return (
    <div className="fixed bottom-0 left-0 right-0 h-8 bg-black border-t border-[rgba(0,255,65,0.2)] overflow-hidden z-40 flex items-center">
      {/* Glow on left/right edges */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-black to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-black to-transparent z-10" />
      
      <div className="absolute left-4 z-20 font-mono text-[9px] text-[var(--neon-cyan)] tracking-widest bg-black pr-3 flex items-center h-full border-r border-[rgba(0,212,255,0.3)]">
        <span className="w-1.5 h-1.5 bg-[var(--neon-cyan)] animate-pulse rounded-full mr-2" />
        LIVE FEED
      </div>

      <motion.div
        className="flex whitespace-nowrap pl-[120px]"
        animate={{ x: [0, -2000] }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 40,
        }}
      >
        {displayItems.map((threat, i) => (
          <div key={i} className="flex items-center text-[11px] font-mono tracking-wider mr-8">
            <span className={`${threat.color} mr-2`}>{threat.icon} {threat.status}:</span>
            <span className="text-[var(--text-muted)]">{threat.item}</span>
            <span className="text-[rgba(0,255,65,0.3)] mx-8">·</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
