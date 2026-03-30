"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { ScanCard } from "@/components/ScanCard";

export default function Home() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <div className="w-full min-h-[calc(100vh-64px)] flex items-center pt-8 md:pt-16 pb-20 px-6">
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">
        
        {/* LEFT COLUMN: Hero content */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col items-start z-10"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center px-3 py-1 bg-[rgba(0,212,255,0.1)] border border-[rgba(0,212,255,0.4)] mb-6">
            <span className="w-2 h-2 bg-[var(--neon-cyan)] animate-pulse rounded-full mr-2" />
            <span className="font-mono text-[9px] uppercase tracking-[1px] text-[var(--neon-cyan)]">
              [ THREAT DETECTION ONLINE ]
            </span>
          </motion.div>

          <motion.h1 variants={itemVariants} className="font-display font-black text-5xl md:text-[52px] text-white leading-[1.1] mb-6 tracking-wide drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
            CYBER<br />
            GUARD <span className="text-[var(--neon-green)] drop-shadow-[0_0_12px_rgba(0,255,65,0.4)]">AI</span>
          </motion.h1>

          <motion.p variants={itemVariants} className="text-[15px] font-body text-[var(--text-muted)] max-w-[480px] leading-[1.7] mb-10">
            Real-time phishing detection and malware analysis powered by machine learning. Scan URLs and files instantly to neutralize digital threats before they breach your perimeter.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4 mb-16">
            <Link 
              href="/scan"
              className="group relative flex items-center justify-center h-[46px] px-8 bg-black text-[var(--neon-green)] font-mono text-[13px] tracking-[2px] uppercase transition-all overflow-hidden"
              style={{ clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))" }}
            >
              <div className="absolute inset-0 bg-[var(--neon-green)] group-hover:opacity-100 opacity-10 transition-opacity" />
              <div className="absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r from-transparent via-white to-transparent opacity-50" />
              <span className="relative z-10 group-hover:text-black font-bold transition-colors">[ SCAN URL ]</span>
            </Link>

            <Link 
              href="/upload"
              className="flex items-center justify-center h-[46px] px-8 bg-transparent text-[var(--neon-green)] border border-[rgba(0,255,65,0.4)] hover:border-[var(--neon-green)] hover:bg-[rgba(0,255,65,0.05)] font-mono text-[13px] tracking-[2px] uppercase transition-all shadow-[0_0_10px_rgba(0,255,65,0)] hover:shadow-[0_0_15px_rgba(0,255,65,0.2)]"
            >
              [ UPLOAD FILE ]
            </Link>
          </motion.div>

          {/* Stat bar */}
          <motion.div variants={itemVariants} className="flex items-center flex-wrap gap-4 text-[9px] font-mono tracking-widest text-[var(--text-muted)]">
            <div className="flex flex-col">
              <span className="text-white font-bold text-xs">10,847</span>
              <span>THREATS BLOCKED</span>
            </div>
            <div className="w-[1px] h-6 bg-[rgba(0,255,65,0.2)] mx-2" />
            <div className="flex flex-col">
              <span className="text-[var(--neon-cyan)] font-bold text-xs">99.2%</span>
              <span>ACCURACY</span>
            </div>
            <div className="w-[1px] h-6 bg-[rgba(0,255,65,0.2)] mx-2" />
            <div className="flex flex-col">
              <span className="text-[var(--neon-green)] font-bold text-xs">&lt; 2s</span>
              <span>RESPONSE TIME</span>
            </div>
          </motion.div>
        </motion.div>

        {/* RIGHT COLUMN: Live Scan Result Cards */}
        <div className="flex flex-col gap-4 z-10 pl-0 lg:pl-[10%]">
          <ScanCard 
            url="hxxps://paypal-verify-secure[.]ru/login"
            status="threat"
            score={87}
            details={[
              { label: "DOMAIN AGE", value: "3 DAYS" },
              { label: "SSL", value: "INVALID" },
              { label: "SCORE", value: "87/100" }
            ]}
            delay={0.6}
          />
          <ScanCard 
            url="https://github.com/microsoft/vscode"
            status="safe"
            score={4}
            details={[
              { label: "DOMAIN AGE", value: "11 YEARS" },
              { label: "SSL", value: "VALID" },
              { label: "SCORE", value: "04/100" }
            ]}
            delay={0.8}
          />
          <ScanCard 
            url="https://dropbox.com/s/share/document..."
            status="scanning"
            score={45} // Partially filled
            details={[
              { label: "STATUS", value: "ANALYZING..." },
              { label: "ETA", value: "0.8s" }
            ]}
            delay={1.0}
          />
        </div>

      </div>
    </div>
  );
}
