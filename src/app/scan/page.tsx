"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, ArrowRight, ShieldAlert, CheckCircle, Shield, AlertTriangle } from "lucide-react";
import { URLInput } from "@/components/URLInput";
import { ThreatBar } from "@/components/ThreatBar";
import { ThreatBadge, ThreatStatus } from "@/components/ThreatBadge";
import { ScanCard } from "@/components/ScanCard";

export default function ScanPage() {
  const [url, setUrl] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanStage, setScanStage] = useState(0); // 0-4
  const [result, setResult] = useState<any>(null);

  const STAGES = [
    "INITIATING CONNECTION",
    "DNS LOOKUP & WHOIS",
    "HEADER & PAYLOAD FETCH",
    "ML CLASSIFICATION ENGINE",
    "GENERATING REPORT"
  ];

  // Dummy recent scans
  const recentScans = [
    { url: "https://auth.google-verify.com/login", status: "threat" as ThreatStatus, score: 92 },
    { url: "https://amazon.com/gp/cart", status: "safe" as ThreatStatus, score: 2 },
    { url: "http://free-movies.tv/watch", status: "warning" as ThreatStatus, score: 58 },
  ];

  const handleScan = (submittedUrl: string) => {
    setUrl(submittedUrl);
    setIsScanning(true);
    setScanStage(0);
    setResult(null);

    // Simulate scan stages sequence
    let currentStage = 0;
    const interval = setInterval(() => {
      currentStage++;
      if (currentStage < STAGES.length) {
        setScanStage(currentStage);
      } else {
        clearInterval(interval);
        // Build dummy result based on URL string randomly (for UI)
        const isMalicious = submittedUrl.includes("login") || submittedUrl.includes("verify");
        const finalScore = isMalicious ? Math.floor(Math.random() * 20) + 80 : Math.floor(Math.random() * 15) + 1;
        
        setIsScanning(false);
        setResult({
          url: submittedUrl,
          score: finalScore,
          verdict: isMalicious ? "THREAT DETECTED" : "SAFE",
          status: isMalicious ? "threat" : "safe",
          features: [
            { name: "Domain Age", value: isMalicious ? "2 Days" : "5 Years", flag: isMalicious },
            { name: "SSL Certificate", value: isMalicious ? "Self-Signed" : "Valid (DigiCert)", flag: isMalicious },
            { name: "Redirect Chain", value: isMalicious ? "3 Hops" : "None", flag: false },
            { name: "Suspicious Keywords", value: isMalicious ? "Found ('login', 'verify')" : "Clean", flag: isMalicious },
            { name: "ML Confidence", value: "98.5%", flag: false },
          ]
        });
      }
    }, 800);
  };

  return (
  <div className="w-full min-h-[calc(100vh-64px)] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 pb-20">
    <div className="w-full flex-1 pt-12 pb-24 px-6 md:px-12">
      
      {/* Header */}
      <div className="mb-16 text-center mt-4">
        <h1 className="font-display font-bold text-4xl mb-6 tracking-[0.2em]">
          URL <span className="text-[var(--neon-cyan)]">ANALYZER</span>
        </h1>
        <p className="font-body text-[var(--text-muted)] max-w-3xl mx-auto leading-loose text-lg">
          Enter a web address below. Our engine will dissect the domain, fetch the payload, and run it through our machine learning classifiers in real-time.
        </p>
      </div>

      
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">
        
        {/* Main Scan Area */}
        <div className="flex-1 w-full">
          <URLInput onSubmit={handleScan} isLoading={isScanning} />

          {/* Scanning Progress */}
          <AnimatePresence mode="wait">
            {isScanning && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-12 border border-[rgba(0,212,255,0.3)] bg-[rgba(0,0,0,0.6)] p-8 md:p-12 relative overflow-hidden shadow-[0_0_30px_rgba(0,212,255,0.05)]"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[rgba(0,212,255,0.05)] to-transparent animate-scanline pointer-events-none" />
                
                <div className="flex items-center justify-between mb-10 pb-6 border-b border-[rgba(0,212,255,0.1)]">
                  <div className="font-mono text-[var(--neon-cyan)] text-base md:text-lg tracking-[0.2em] flex items-center gap-4">
                    <span className="animate-spin text-2xl drop-shadow-[0_0_8px_rgba(0,212,255,0.8)]">⟳</span>
                    ANALYSIS IN PROGRESS...
                  </div>
                  <div className="font-mono text-sm tracking-widest text-[var(--text-muted)] bg-[rgba(0,212,255,0.05)] px-4 py-1.5 border border-[rgba(0,212,255,0.2)]">
                    STAGE {scanStage + 1}/{STAGES.length}
                  </div>
                </div>

                <div className="space-y-6 md:space-y-8 relative z-10 px-2 md:px-6">
                  {STAGES.map((stage, idx) => {
                    const isActive = idx === scanStage;
                    const isPassed = idx < scanStage;
                    
                    return (
                      <div key={idx} className={`flex items-center gap-5 font-mono text-sm md:text-base tracking-[0.15em] transition-all duration-300 ${isActive ? "text-[var(--neon-cyan)] scale-105 origin-left" : isPassed ? "text-[var(--neon-green)]" : "text-[rgba(255,255,255,0.2)]"}`}>
                        <div className={`w-6 h-6 flex justify-center items-center rounded-sm ${isActive ? 'bg-[rgba(0,212,255,0.1)] border border-[rgba(0,212,255,0.3)]' : isPassed ? 'bg-[rgba(0,255,65,0.1)] border border-[rgba(0,255,65,0.3)]' : 'border border-[rgba(255,255,255,0.1)]'}`}>
                          {isPassed ? "✓" : isActive ? "▶" : "·"}
                        </div>
                        <span className={isActive ? "animate-pulse font-bold" : ""}>
                          {stage}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Scan Results */}
            {result && !isScanning && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-8 border border-[rgba(0,255,65,0.2)] bg-[rgba(0,0,0,0.75)] p-6 relative"
              >
                <div className="flex justify-between items-start border-b border-[rgba(0,255,65,0.2)] pb-6 mb-6">
                  <div>
                    <h2 className="font-mono text-[var(--text-muted)] text-sm tracking-widest mb-1">TARGET_URL</h2>
                    <div className="font-code text-white sm:text-lg break-all">{result.url}</div>
                  </div>
                  <ThreatBadge status={result.status} />
                </div>

                <div className="flex flex-col sm:flex-row gap-8 mb-8">
                  <div className="flex-1">
                    <h3 className="font-mono text-[var(--text-muted)] text-[10px] tracking-[2px] mb-3">THREAT_SCORE</h3>
                    <div className="flex items-end gap-3 mb-2">
                      <span className={`font-display font-bold text-5xl leading-none ${result.status === 'threat' ? 'text-[var(--neon-red)]' : 'text-[var(--neon-green)]'}`}>
                        {result.score}
                      </span>
                      <span className="font-display text-2xl text-[var(--text-muted)] mb-1">/ 100</span>
                    </div>
                    <ThreatBar value={result.score} />
                  </div>
                  
                  <div className="flex-1 border-l border-[rgba(0,255,65,0.1)] pl-0 sm:pl-8 pt-6 sm:pt-0">
                    <h3 className="font-mono text-[var(--text-muted)] text-[10px] tracking-[2px] mb-4">VERDICT</h3>
                    <div className="flex items-center gap-4">
                      {result.status === 'threat' ? (
                        <div className="w-12 h-12 rounded-full bg-[rgba(255,0,60,0.1)] border border-[var(--neon-red)] flex items-center justify-center">
                          <AlertTriangle className="text-[var(--neon-red)]" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-[rgba(0,255,65,0.1)] border border-[var(--neon-green)] flex items-center justify-center">
                          <CheckCircle className="text-[var(--neon-green)]" />
                        </div>
                      )}
                      <div>
                        <div className={`font-mono text-lg font-bold tracking-widest ${result.status === 'threat' ? 'text-[var(--neon-red)]' : 'text-[var(--neon-green)]'}`}>
                          {result.verdict}
                        </div>
                        <div className="font-body text-sm text-[var(--text-muted)] mt-1">
                          {result.status === 'threat' ? 'Site exhibits strong indicators of being a malicious phishing page.' : 'No malicious payloads or signatures detected.'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Feature Breakdown Table */}
                <div>
                  <h3 className="font-mono text-[var(--text-muted)] text-[10px] tracking-[2px] mb-4 flex items-center gap-2">
                    <Shield className="w-3 h-3" />
                    SECURITY_FEATURES
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                    {result.features.map((feat: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center py-2 border-b border-[rgba(255,255,255,0.05)]">
                        <span className="font-mono text-xs text-[var(--text-muted)]">{feat.name}</span>
                        <span className={`font-mono text-xs ${feat.flag ? 'text-[var(--neon-red)]' : 'text-[var(--neon-green)]'}`}>
                          {feat.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <svg className="absolute top-0 right-0 w-4 h-4" style={{ fill: "rgba(0,255,65,0.3)" }} viewBox="0 0 10 10">
                  <polygon points="0,0 10,0 10,10 8,10 8,2 0,2" />
                </svg>
                <svg className="absolute bottom-0 left-0 w-4 h-4" style={{ fill: "rgba(0,255,65,0.3)" }} viewBox="0 0 10 10">
                  <polygon points="0,0 2,0 2,8 10,8 10,10 0,10" />
                </svg>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-80 shrink-0 flex flex-col gap-6">
          <div className="font-mono text-[11px] uppercase tracking-[2px] text-[var(--text-muted)] mb-2 border-b border-[rgba(0,255,65,0.2)] pb-2 flex items-center justify-between">
            <span>Recent Scans</span>
            <span className="text-[9px] bg-[rgba(0,255,65,0.1)] px-2 py-0.5 text-[var(--neon-green)]">LOCAL</span>
          </div>
          
          <div className="flex flex-col gap-4">
            {recentScans.map((scan, i) => (
              <ScanCard 
                key={i}
                url={scan.url}
                status={scan.status}
                score={scan.score}
                details={[
                  { label: "SCORE", value: `${scan.score}/100` }
                ]}
              />
            ))}
          </div>
        </div>
      </div>
      </div>
    </div>
  
  );
}
