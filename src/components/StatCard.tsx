"use client";

import { motion, useAnimation, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface StatCardProps {
  label: string;
  value: number | string;
  color: string;
  isPercentage?: boolean;
  prefix?: string;
  suffix?: string;
}

export function StatCard({
  label,
  value,
  color,
  isPercentage = false,
  prefix = "",
  suffix = "",
}: StatCardProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView && typeof value === "number") {
      let start = 0;
      const duration = 1500; // 1.5s
      const increment = (value / duration) * 16; // rough 60fps increment

      const timer = setInterval(() => {
        start += increment;
        if (start >= value) {
          setDisplayValue(value);
          clearInterval(timer);
        } else {
          setDisplayValue(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(timer);
    } else if (typeof value === "string") {
      // no animation for pure string values initially, just render
      setDisplayValue(value as any);
    }
  }, [isInView, value]);

  const formattingOptions =
    typeof value === "number" && !isPercentage
      ? { minimumFractionDigits: 0, maximumFractionDigits: 1 }
      : undefined;

  const formattedDisplay =
    typeof displayValue === "number" && !isPercentage
      ? displayValue.toLocaleString("en-US", formattingOptions)
      : displayValue;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4 }}
      className="flex flex-col p-4 relative overflow-hidden"
      style={{
        background: "rgba(0,0,0,0.8)",
        border: "1px solid rgba(0,255,65,0.15)",
      }}
    >
      <div
        className="text-[9px] uppercase tracking-[1px] mb-2 font-mono"
        style={{ color: "var(--text-muted)" }}
      >
        {label}
      </div>
      <div
        className="text-[28px] font-bold font-display leading-none"
        style={{ color }}
      >
        {prefix}
        {formattedDisplay}
        {isPercentage ? "%" : ""}
        {suffix}
      </div>
      {/* Decorative Corner Bracket */}
      <svg
        className="absolute top-0 left-0 w-2 h-2"
        style={{ fill: "rgba(0,255,65,0.3)" }}
        viewBox="0 0 10 10"
      >
        <polygon points="0,0 10,0 10,1 1,1 1,10 0,10" />
      </svg>
      <svg
        className="absolute bottom-0 right-0 w-2 h-2"
        style={{ fill: "rgba(0,255,65,0.3)" }}
        viewBox="0 0 10 10"
      >
        <polygon points="0,9 9,9 9,0 10,0 10,10 0,10" />
      </svg>
    </motion.div>
  );
}
