"use client";

import { motion } from "framer-motion";
import { ThreatBadge, ThreatStatus } from "./ThreatBadge";
import { ThreatBar } from "./ThreatBar";

interface ScanCardProps {
  url: string;
  status: ThreatStatus;
  score: number;
  details: {
    label: string;
    value: string;
  }[];
  delay?: number;
}

export function ScanCard({ url, status, score, details, delay = 0 }: ScanCardProps) {
  const getAccentColor = () => {
    switch (status) {
      case "threat": return "var(--neon-red)";
      case "safe": return "var(--neon-green)";
      case "scanning": return "var(--neon-cyan)";
      case "warning": return "var(--neon-amber)";
    }
  };

  const getGradient = () => {
    if (status === "scanning") {
      return `linear-gradient(to bottom, var(--neon-cyan), var(--neon-green))`;
    }
    return getAccentColor();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay }}
      className="relative flex flex-col p-4 w-full overflow-hidden"
      style={{
        background: "rgba(0,0,0,0.75)",
        border: "1px solid rgba(0,255,65,0.18)",
        borderLeft: `3px solid`,
        borderImage: `${getGradient()} 1`, // applying the gradient to border
        borderImageSlice: 1,
      }}
    >
      {/* Fallback border left if border-image isn't supported smoothly */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-[3px]"
        style={{ background: getGradient() }}
      />
      
      {/* Scanline Animation for active state */}
      {status === "scanning" && (
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[rgba(0,212,255,0.1)] to-transparent h-full w-full animate-scanline pointer-events-none" />
      )}

      {/* SVG Corner brackets */}
      <svg className="absolute top-0 right-0 w-3 h-3" style={{ fill: "rgba(0,255,65,0.3)" }} viewBox="0 0 10 10">
        <polygon points="0,0 10,0 10,10 9,10 9,1 0,1" />
      </svg>
      <svg className="absolute bottom-0 left-0 w-3 h-3" style={{ fill: "rgba(0,255,65,0.3)" }} viewBox="0 0 10 10">
        <polygon points="0,0 1,0 1,9 10,9 10,10 0,10" />
      </svg>

      <div className="flex justify-between items-start mb-3 z-10">
        <div className="font-code text-sm text-[var(--neon-green)] opacity-90 truncate mr-4">
          {url}
        </div>
        <ThreatBadge status={status} />
      </div>

      <div className="mb-4 z-10">
        <ThreatBar value={score} />
      </div>

      <div className="flex justify-between w-full text-[10px] uppercase font-mono tracking-wider text-[var(--text-muted)] mt-auto z-10">
        {details.map((d, i) => (
          <div key={i} className="flex gap-1.5">
            <span>{d.label}:</span>
            <span className="text-white">{d.value}</span>
            {i < details.length - 1 && <span className="mx-1.5 opacity-30">|</span>}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
