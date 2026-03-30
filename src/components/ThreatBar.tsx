"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface ThreatBarProps {
  value: number; // 0 to 100
}

export function ThreatBar({ value }: ThreatBarProps) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    // Small delay to ensure the mount animation shows
    const timeout = setTimeout(() => {
      setWidth(value);
    }, 100);
    return () => clearTimeout(timeout);
  }, [value]);

  const getColor = (v: number) => {
    if (v < 30) return "var(--neon-green)";
    if (v <= 60) return "var(--neon-amber)";
    return "var(--neon-red)";
  };

  return (
    <div
      className="w-full relative overflow-hidden"
      style={{ height: "3px", backgroundColor: "rgba(255,255,255,0.05)" }}
    >
      <motion.div
        className="absolute top-0 left-0 h-full"
        style={{ backgroundColor: getColor(value) }}
        initial={{ width: 0 }}
        animate={{ width: `${width}%` }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
    </div>
  );
}
