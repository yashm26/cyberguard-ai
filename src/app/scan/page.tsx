"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Shield, AlertTriangle } from "lucide-react";
import { URLInput } from "@/components/URLInput";
import { ThreatBar } from "@/components/ThreatBar";
import { ThreatBadge } from "@/components/ThreatBadge";
import { detectURL, getUserId } from "@/lib/api";

export default function ScanPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanStage, setScanStage] = useState(0);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [userId] = useState(() => getUserId());

  const STAGES = [
    "INITIATING CONNECTION",
    "DNS LOOKUP & WHOIS",
    "HEADER & PAYLOAD FETCH",
    "ML CLASSIFICATION ENGINE",
    "GENERATING REPORT",
  ];

  const handleScan = async (submittedUrl: string) => {
    setIsScanning(true);
    setScanStage(0);
    setResult(null);
    setError(null);

    let currentStage = 0;
    const interval = setInterval(() => {
      currentStage++;
      if (currentStage < STAGES.length) setScanStage(currentStage);
      else clearInterval(interval);
    }, 800);

    try {
      const detectionResult = await detectURL(submittedUrl, undefined, userId);

      if (detectionResult.success && detectionResult.data) {
        const data = detectionResult.data;
        const confidence = data.confidence ?? 0;
        const finalScore = Math.round(confidence * 100);
        const isThreat: boolean = !!data.is_phishing;

        // Flatten nested detail objects into readable strings
        const flatFeatures: { name: string; value: string; flag: boolean }[] = [
          {
            name: "ML Classification",
            value: `${finalScore}% — ${(data.risk_level ?? "n/a").toUpperCase()}`,
            flag: isThreat,
          },
          {
            name: "Phishing Status",
            value: isThreat ? "FLAGGED" : "CLEAN",
            flag: isThreat,
          },
          {
            name: "Confidence Level",
            value: `${(confidence * 100).toFixed(1)}%`,
            flag: false,
          },
        ];

        const d = data.details ?? {};

        if (d.lib_check) {
          flatFeatures.push({
            name: "Phishing Library",
            value: d.lib_check.available
              ? `${d.lib_check.is_phishing ? "FLAGGED" : "CLEAN"} (${Math.round(d.lib_check.confidence * 100)}%)`
              : "Unavailable",
            flag: !!d.lib_check.is_phishing,
          });
        }

        if (d.api_summary) {
          flatFeatures.push({
            name: "External API Check",
            value: d.api_summary.available
              ? `${d.api_summary.is_threat ? "THREAT" : "CLEAN"} (${Math.round(d.api_summary.confidence * 100)}%)`
              : "Unavailable (offline)",
            flag: !!d.api_summary.is_threat,
          });
        }

        if (d.ml_check) {
          flatFeatures.push({
            name: "ML Model",
            value: d.ml_check.available
              ? `${d.ml_check.is_phishing ? "FLAGGED" : "CLEAN"} (${Math.round(d.ml_check.confidence * 100)}%)`
              : "Unavailable",
            flag: !!d.ml_check.is_phishing,
          });
        }

        setResult({
          url: submittedUrl,
          score: finalScore,
          verdict: isThreat ? "THREAT DETECTED" : "SAFE",
          status: isThreat ? "threat" : "safe",
          features: flatFeatures,
        });
      } else {
        setError(detectionResult.error ?? "Scan failed. Please try again.");
      }
    } catch (err: any) {
      setError(
        err?.message ??
          "Failed to connect to detection service. Ensure backend is running on port 5000."
      );
    } finally {
      clearInterval(interval);
      setIsScanning(false);
    }
  };

  return (
    /* Full-height column, centred horizontally */
    <div className="w-full min-h-[calc(100vh-80px)] flex flex-col items-center justify-start py-10 px-4 sm:px-6 lg:px-8">
      {/* Constrained content column */}
      <div className="w-full max-w-3xl mx-auto">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="mb-10 text-center">
          <h1 className="font-display font-bold text-3xl sm:text-4xl mb-4 tracking-[0.2em]">
            URL <span className="text-[var(--neon-cyan)]">ANALYZER</span>
          </h1>
          <p className="font-body text-[var(--text-muted)] max-w-xl mx-auto leading-relaxed text-sm sm:text-base">
            Enter a web address below. Our engine will dissect the domain, fetch
            the payload, and run it through our machine learning classifiers in
            real-time.
          </p>
        </div>

        {/* ── URL Input ───────────────────────────────────────────────────── */}
        <URLInput onSubmit={handleScan} isLoading={isScanning} />

        {/* ── Error ───────────────────────────────────────────────────────── */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-4 border border-[var(--neon-red)] bg-[rgba(255,0,60,0.1)] text-[var(--neon-red)] font-mono text-sm rounded"
            >
              ⚠ {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Scanning progress ────────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {isScanning && (
            <motion.div
              key="progress"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="mt-8 border border-[rgba(0,212,255,0.3)] bg-[rgba(0,0,0,0.6)] p-6 sm:p-8 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[rgba(0,212,255,0.04)] to-transparent animate-scanline pointer-events-none" />

              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[rgba(0,212,255,0.1)]">
                <span className="font-mono text-[var(--neon-cyan)] text-sm tracking-widest flex items-center gap-3">
                  <span className="animate-spin text-xl">⟳</span>
                  ANALYSIS IN PROGRESS…
                </span>
                <span className="font-mono text-xs text-[var(--text-muted)] border border-[rgba(0,212,255,0.2)] px-3 py-1">
                  STAGE {scanStage + 1}/{STAGES.length}
                </span>
              </div>

              <div className="space-y-4">
                {STAGES.map((stage, idx) => {
                  const isActive = idx === scanStage;
                  const isPassed = idx < scanStage;
                  return (
                    <div
                      key={idx}
                      className={`flex items-center gap-4 font-mono text-xs sm:text-sm tracking-widest transition-all duration-300 ${
                        isActive
                          ? "text-[var(--neon-cyan)] scale-105 origin-left"
                          : isPassed
                          ? "text-[var(--neon-green)]"
                          : "text-[rgba(255,255,255,0.2)]"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 flex items-center justify-center text-xs rounded-sm border ${
                          isActive
                            ? "border-[rgba(0,212,255,0.5)] bg-[rgba(0,212,255,0.1)]"
                            : isPassed
                            ? "border-[rgba(0,255,65,0.5)] bg-[rgba(0,255,65,0.1)]"
                            : "border-[rgba(255,255,255,0.1)]"
                        }`}
                      >
                        {isPassed ? "✓" : isActive ? "▶" : "·"}
                      </div>
                      <span className={isActive ? "animate-pulse font-bold" : ""}>{stage}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ── Results ───────────────────────────────────────────────────── */}
          {result && !isScanning && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 border border-[rgba(0,255,65,0.25)] bg-[rgba(0,0,0,0.75)] p-5 sm:p-6 relative"
            >
              {/* URL + badge */}
              <div className="flex flex-wrap justify-between items-start gap-4 pb-5 mb-5 border-b border-[rgba(0,255,65,0.15)]">
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-[var(--text-muted)] text-[10px] tracking-widest mb-1">
                    TARGET_URL
                  </p>
                  <p className="font-mono text-white text-sm sm:text-base break-all">
                    {result.url}
                  </p>
                </div>
                <ThreatBadge status={result.status} />
              </div>

              {/* Score + Verdict */}
              <div className="flex flex-col sm:flex-row gap-6 mb-6">
                {/* Score */}
                <div className="flex-1">
                  <p className="font-mono text-[var(--text-muted)] text-[10px] tracking-[2px] mb-2">
                    THREAT_SCORE
                  </p>
                  <div className="flex items-end gap-2 mb-2">
                    <span
                      className={`font-display font-bold text-5xl leading-none ${
                        result.status === "threat"
                          ? "text-[var(--neon-red)]"
                          : "text-[var(--neon-green)]"
                      }`}
                    >
                      {result.score}
                    </span>
                    <span className="font-display text-xl text-[var(--text-muted)] mb-1">
                      / 100
                    </span>
                  </div>
                  <ThreatBar value={result.score} />
                </div>

                {/* Verdict */}
                <div className="flex-1 sm:border-l sm:border-[rgba(0,255,65,0.1)] sm:pl-6">
                  <p className="font-mono text-[var(--text-muted)] text-[10px] tracking-[2px] mb-3">
                    VERDICT
                  </p>
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        result.status === "threat"
                          ? "bg-[rgba(255,0,60,0.1)] border border-[var(--neon-red)]"
                          : "bg-[rgba(0,255,65,0.1)] border border-[var(--neon-green)]"
                      }`}
                    >
                      {result.status === "threat" ? (
                        <AlertTriangle className="w-4 h-4 text-[var(--neon-red)]" />
                      ) : (
                        <CheckCircle className="w-4 h-4 text-[var(--neon-green)]" />
                      )}
                    </div>
                    <div>
                      <p
                        className={`font-mono text-base font-bold tracking-widest ${
                          result.status === "threat"
                            ? "text-[var(--neon-red)]"
                            : "text-[var(--neon-green)]"
                        }`}
                      >
                        {result.verdict}
                      </p>
                      <p className="font-body text-xs text-[var(--text-muted)] mt-1 leading-relaxed">
                        {result.status === "threat"
                          ? "Site exhibits strong indicators of a malicious phishing page."
                          : "No malicious payloads or signatures detected."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature breakdown */}
              <div>
                <p className="font-mono text-[var(--text-muted)] text-[10px] tracking-[2px] mb-3 flex items-center gap-2">
                  <Shield className="w-3 h-3" />
                  SECURITY_FEATURES
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                  {result.features.map((feat: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center py-2 border-b border-[rgba(255,255,255,0.05)]"
                    >
                      <span className="font-mono text-xs text-[var(--text-muted)]">
                        {feat.name}
                      </span>
                      <span
                        className={`font-mono text-xs ${
                          feat.flag
                            ? "text-[var(--neon-red)]"
                            : "text-[var(--neon-green)]"
                        }`}
                      >
                        {feat.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Corner accents */}
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
    </div>
  );
}
