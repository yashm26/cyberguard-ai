"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Shield, AlertTriangle, Link2 } from "lucide-react";
import { URLInput } from "@/components/URLInput";
import { ThreatBar } from "@/components/ThreatBar";
import { ThreatBadge } from "@/components/ThreatBadge";
import { detectURL, getUserId } from "@/lib/api";

export default function ScanPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanStage, setScanStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [submittedUrl, setSubmittedUrl] = useState<string>("");
  const [userId] = useState(() => getUserId());

  const STAGES = [
    "INITIATING CONNECTION",
    "DNS LOOKUP & WHOIS",
    "HEADER & PAYLOAD FETCH",
    "ML CLASSIFICATION ENGINE",
    "GENERATING REPORT",
  ];

  const SCAN_FEATURES = ["HTTP/HTTPS", "PHISHING", "HEURISTICS", "ML MODEL", "WHOIS"];

  const handleScan = async (url: string) => {
    setIsScanning(true);
    setScanStage(0);
    setProgress(0);
    setResult(null);
    setError(null);
    setSubmittedUrl(url);

    let currentStage = 0;
    const stageInterval = setInterval(() => {
      currentStage++;
      if (currentStage < STAGES.length) setScanStage(currentStage);
      else clearInterval(stageInterval);
    }, 800);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return 90;
        return prev + Math.random() * 25;
      });
    }, 200);

    try {
      const detectionResult = await detectURL(url, undefined, userId);

      if (detectionResult.success && detectionResult.data) {
        const data = detectionResult.data;
        const confidence = data.confidence ?? 0;
        const finalScore = Math.round(confidence * 100);
        const isThreat: boolean = !!data.is_phishing;

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
          url,
          score: finalScore,
          verdict: isThreat ? "THREAT DETECTED" : "SAFE",
          status: isThreat ? "threat" : "safe",
          features: flatFeatures,
        });

        setProgress(100);
      } else {
        setError(detectionResult.error ?? "Scan failed. Please try again.");
      }
    } catch (err: any) {
      setError(
        err?.message ??
          "Failed to connect to detection service. Ensure backend is running on port 5000."
      );
    } finally {
      clearInterval(stageInterval);
      clearInterval(progressInterval);
      setIsScanning(false);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-64px)] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 pb-20">
      <div className="w-full max-w-4xl mx-auto pt-12 pb-24 px-6">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="mb-16 text-center mt-4">
          <h1 className="font-display font-bold text-4xl mb-6 tracking-[0.2em]">
            URL <span className="text-[var(--neon-cyan)]">ANALYZER</span>
          </h1>
          <p className="font-body text-[var(--text-muted)] max-w-3xl mx-auto leading-loose text-lg">
            Enter a web address below. Our engine will dissect the domain, fetch the payload, and
            run it through our machine learning classifiers in real-time.
          </p>
        </div>

        {/* ── Feature pills ───────────────────────────────────────────────── */}
        <div className="flex gap-4 justify-center mb-8 flex-wrap">
          {SCAN_FEATURES.map((feat) => (
            <div
              key={feat}
              className="font-mono text-[10px] uppercase px-3 py-1 bg-[rgba(0,212,255,0.05)] text-[var(--neon-cyan)] border border-[rgba(0,212,255,0.2)]"
            >
              {feat}
            </div>
          ))}
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
              className="mt-4 p-4 border border-[var(--neon-red)] bg-[rgba(255,0,60,0.1)] text-[var(--neon-red)] font-mono text-sm"
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
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-12 p-10 md:p-14 bg-[rgba(0,0,0,0.9)] border border-[rgba(0,212,255,0.4)] shadow-[0_0_40px_rgba(0,212,255,0.08)]"
            >
              <div className="flex justify-between font-mono text-sm md:text-base tracking-[0.2em] mb-8">
                <span className="text-[var(--neon-cyan)] flex items-center gap-3">
                  <span className="animate-pulse">▶</span> ANALYZING: {submittedUrl}
                </span>
                <span className="text-white font-bold">{Math.round(progress)}%</span>
              </div>

              <div className="w-full h-3 bg-[rgba(255,255,255,0.05)] relative overflow-hidden rounded-sm border border-[rgba(0,212,255,0.1)]">
                <motion.div
                  className="absolute top-0 left-0 h-full bg-[var(--neon-cyan)] shadow-[0_0_15px_rgba(0,212,255,0.8)] transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="mt-8 font-mono text-xs md:text-sm tracking-widest text-[var(--text-muted)] uppercase flex flex-col gap-4">
                {STAGES.map((stage, idx) => {
                  const isActive = idx === scanStage;
                  const isPassed = idx < scanStage;
                  if (!isPassed && !isActive) return null;
                  return (
                    <span
                      key={idx}
                      className={`flex items-center gap-4 ${
                        isActive
                          ? "text-[var(--neon-cyan)]"
                          : "text-[var(--neon-green)]"
                      }`}
                    >
                      <span className={`w-6 text-center ${isActive ? "animate-pulse text-xl" : ""}`}>
                        {isPassed ? "✓" : "⟳"}
                      </span>
                      <span className="text-white">{stage}...</span>
                      <span>{isPassed ? "[OK]" : "[RUNNING]"}</span>
                    </span>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ── Results ───────────────────────────────────────────────────── */}
          {result && !isScanning && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-12 p-8 border ${
                result.status === "threat"
                  ? "border-[var(--neon-red)] bg-[rgba(255,0,60,0.05)]"
                  : "border-[var(--neon-green)] bg-[rgba(0,255,65,0.05)]"
              }`}
            >
              {/* URL + badge */}
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="font-mono text-[var(--text-muted)] text-[10px] tracking-[2px] mb-1">
                    TARGET_URL
                  </h2>
                  <div className="font-mono text-xl text-white break-all flex items-center gap-3">
                    <Link2
                      className={
                        result.status === "threat"
                          ? "text-[var(--neon-red)] shrink-0"
                          : "text-[var(--neon-green)] shrink-0"
                      }
                    />
                    {result.url}
                  </div>
                </div>
                <ThreatBadge status={result.status} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left — Score + Verdict */}
                <div className="space-y-6">
                  {/* Score */}
                  <div>
                    <p className="font-mono text-[var(--text-muted)] text-[10px] tracking-[2px] mb-2">
                      THREAT_SCORE
                    </p>
                    <div className="flex items-end gap-2 mb-3">
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
                  <div className="pt-6 border-t border-[rgba(255,255,255,0.1)]">
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
                          className={`font-display font-bold text-3xl tracking-widest ${
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

                {/* Right — Feature breakdown */}
                <div>
                  <p className="font-mono text-[var(--text-muted)] text-[10px] tracking-widest mb-2 flex items-center gap-2">
                    <Shield className="w-3 h-3" /> SECURITY_FEATURES
                  </p>
                  <div className="flex flex-col gap-2">
                    {result.features.map((feat: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center font-mono text-[11px] bg-black p-2 border border-[rgba(255,255,255,0.05)]"
                      >
                        <span className="text-[var(--text-muted)]">{feat.name}</span>
                        <span
                          className={
                            feat.flag
                              ? "text-[var(--neon-red)]"
                              : "text-[var(--neon-green)]"
                          }
                        >
                          {feat.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
