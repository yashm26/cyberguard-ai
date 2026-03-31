"use client";

import { motion } from "framer-motion";
import { Server, Database, ShieldCheck, Activity } from "lucide-react";

export default function AboutPage() {
  const steps = [
    {
      num: "01",
      title: "PAYLOAD CAPTURE",
      desc: "User submits suspected URL or file via encrypted channel. The request is sanitized and tokenized before transmission."
    },
    {
      num: "02",
      title: "ISOLATED DETONATION",
      desc: "The Flask backend runs active components in a secure sandbox, pulling metadata, executing YARA rules, and tracking behavioral footprints."
    },
    {
      num: "03",
      title: "ML CLASSIFICATION",
      desc: "Extracted features are fed into a Random Forest and Deep Neural Network ensemble to determine malicious probability with 99.2% accuracy."
    }
  ];

  return (
    <div className="w-full min-h-[calc(100vh-64px)] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 pb-20">
    <div className="w-full max-w-5xl mx-auto pt-12 pb-24 px-6">
      
      <div className="mb-16">
        <h1 className="font-display font-bold text-3xl tracking-wider text-white mb-2">
          SYSTEM <span className="text-[var(--neon-green)]">ARCHITECTURE</span>
        </h1>
        <p className="font-mono text-[10px] text-[var(--neon-cyan)] tracking-[2px] mb-8">
          MACHINE LEARNING THREAT INTELLIGENCE
        </p>
        <p className="font-body text-[var(--text-muted)] max-w-2xl leading-relaxed">
          CyberGuard AI uses an advanced multi-layered approach to threat detection, combining traditional signature-based identification (YARA) with cutting-edge machine learning heuristics to catch zero-day attacks before they compromise your network.
        </p>
      </div>

      <div className="mb-20">
        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-[rgba(0,255,65,0.2)]">
          <Activity className="text-[var(--neon-green)] w-5 h-5" />
          <h2 className="font-mono text-xs uppercase tracking-widest text-white">Execution Flow</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Connector Line */}
          <div className="hidden md:block absolute top-[28px] left-[50px] right-[50px] h-[1px] bg-[rgba(0,255,65,0.2)]" />
          
          {steps.map((step, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              className="relative p-6 bg-[rgba(0,0,0,0.8)] border border-[rgba(0,255,65,0.15)] flex flex-col items-start hover:border-[rgba(0,255,65,0.4)] hover:bg-[rgba(0,255,65,0.05)] transition-colors group"
            >
              <div className="w-10 h-10 bg-black border border-[var(--neon-green)] flex items-center justify-center font-display font-bold text-[var(--neon-green)] mb-6 z-10 shadow-[0_0_15px_rgba(0,255,65,0.2)] group-hover:shadow-[0_0_20px_rgba(0,255,65,0.5)] transition-shadow">
                {step.num}
              </div>
              <h3 className="font-mono text-xs text-white tracking-widest mb-3">{step.title}</h3>
              <p className="font-body text-sm text-[var(--text-muted)] leading-relaxed">{step.desc}</p>
              
              <svg className="absolute top-0 right-0 w-3 h-3" style={{ fill: "rgba(0,255,65,0.3)" }} viewBox="0 0 10 10">
                <polygon points="0,0 10,0 10,10 9,10 9,1 0,1" />
              </svg>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[rgba(0,212,255,0.3)]">
            <Database className="text-[var(--neon-cyan)] w-5 h-5" />
            <h2 className="font-mono text-xs uppercase tracking-widest text-[#00D4FF]">Model Telemetry</h2>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-end border-b border-[rgba(255,255,255,0.05)] pb-2">
               <span className="font-mono text-[10px] text-[var(--text-muted)] tracking-widest">ALGORITHM</span>
               <span className="font-code text-xs text-white">Random Forest (Scikit-Learn)</span>
            </div>
            <div className="flex justify-between items-end border-b border-[rgba(255,255,255,0.05)] pb-2">
               <span className="font-mono text-[10px] text-[var(--text-muted)] tracking-widest">TRAINING DATASET</span>
               <span className="font-code text-xs text-white">12M+ Verified Malicious URLs</span>
            </div>
            <div className="flex justify-between items-end border-b border-[rgba(255,255,255,0.05)] pb-2">
               <span className="font-mono text-[10px] text-[var(--text-muted)] tracking-widest">FALSE POSITIVE RATE</span>
               <span className="font-code text-xs text-white">0.08% target deviation</span>
            </div>
            <div className="flex justify-between items-end border-b border-[rgba(255,255,255,0.05)] pb-2">
               <span className="font-mono text-[10px] text-[var(--text-muted)] tracking-widest">INFERENCE TIME</span>
               <span className="font-code text-xs text-[var(--neon-green)]">&lt; 140ms</span>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[rgba(0,212,255,0.3)]">
            <Server className="text-[var(--neon-cyan)] w-5 h-5" />
            <h2 className="font-mono text-xs uppercase tracking-widest text-[#00D4FF]">Technology Stack</h2>
          </div>
          <div className="bg-[rgba(0,0,0,0.8)] border border-[rgba(0,212,255,0.3)] p-6 flex flex-wrap gap-3">
             <span className="px-3 py-1 bg-[rgba(0,212,255,0.1)] border border-[rgba(0,212,255,0.4)] font-mono text-[10px] text-[var(--neon-cyan)] uppercase">Next.js 14 App Router</span>
             <span className="px-3 py-1 bg-[rgba(0,212,255,0.1)] border border-[rgba(0,212,255,0.4)] font-mono text-[10px] text-[var(--neon-cyan)] uppercase">React 18</span>
             <span className="px-3 py-1 bg-[rgba(0,212,255,0.1)] border border-[rgba(0,212,255,0.4)] font-mono text-[10px] text-[var(--neon-cyan)] uppercase">Tailwind CSS v4</span>
             <span className="px-3 py-1 bg-[rgba(0,212,255,0.1)] border border-[rgba(0,212,255,0.4)] font-mono text-[10px] text-[var(--neon-cyan)] uppercase">Framer Motion</span>
             <span className="px-3 py-1 bg-[rgba(0,255,65,0.1)] border border-[rgba(0,255,65,0.4)] font-mono text-[10px] text-[var(--neon-green)] uppercase">Python 3.12</span>
             <span className="px-3 py-1 bg-[rgba(0,255,65,0.1)] border border-[rgba(0,255,65,0.4)] font-mono text-[10px] text-[var(--neon-green)] uppercase">Flask REST API</span>
             <span className="px-3 py-1 bg-[rgba(0,255,65,0.1)] border border-[rgba(0,255,65,0.4)] font-mono text-[10px] text-[var(--neon-green)] uppercase">Scikit-Learn / Pandas</span>
             <span className="px-3 py-1 bg-[rgba(0,255,65,0.1)] border border-[rgba(0,255,65,0.4)] font-mono text-[10px] text-[var(--neon-green)] uppercase">YARA Engine</span>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
