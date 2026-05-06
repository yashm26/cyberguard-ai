"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, FileType, CheckCircle, AlertTriangle, Hash, Cpu, ShieldAlert } from "lucide-react";
import { ThreatBadge } from "@/components/ThreatBadge";
import { detectFile, getUserId } from "@/lib/api";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [userId] = useState(() => getUserId());

  const FILE_TYPES = [".exe", ".pdf", ".docx", ".zip", ".js"];

  const performScan = async (uploadedFile: File) => {
    setIsScanning(true);
    setProgress(0);
    setResult(null);
    setError(null);

    // Simulate progress while waiting for API
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return 90;
        return prev + Math.random() * 30;
      });
    }, 200);

    try {
      const detectionResult = await detectFile(uploadedFile, userId);

      if (detectionResult.success && detectionResult.data) {
        const data = detectionResult.data;
        // Bug fix: file scan results return `is_malware`, not `is_phishing`.
        // `is_phishing` was always undefined → always falsy → always CLEAN.
        const isMalicious = data.is_malware ?? data.is_phishing ?? false;
        const confidence = data.confidence;
        const details = data.details || {};

        // Build real behavioral flags from backend detail sub-checks
        const buildFlags = (): string[] => {
          if (!isMalicious) return ["Standard File Format", "Clean Signature"];
          const flags: string[] = [];
          if (details.zip_check?.suspicious_files?.length > 0)
            flags.push(`Malicious payload inside archive: ${details.zip_check.suspicious_files.join(", ")}`);
          if (details.ml_check?.is_malware)
            flags.push(`ML Classifier: malware (conf ${((details.ml_check.confidence ?? 0) * 100).toFixed(0)}%)`);
          if (details.rule_check?.label)
            flags.push(`Heuristic: ${details.rule_check.label.replace(/_/g, " ")}`);
          if (details.vt_check?.is_malware)
            flags.push(`VirusTotal: flagged (conf ${((details.vt_check.confidence ?? 0) * 100).toFixed(0)}%)`);
          return flags.length > 0 ? flags : ["Suspicious Behavior Detected"];
        };

        // Build YARA-style matches from VT stats if available
        const buildYara = (): string[] => {
          if (!isMalicious) return ["No Threats Detected"];
          const vtDetail = details.vt_check?.detail;
          if (vtDetail && typeof vtDetail === "object" && vtDetail.malicious > 0)
            return [`${vtDetail.malicious} engine(s) flagged as malicious`];
          if (details.zip_check?.double_ext_files?.length > 0)
            return ["Double-extension masquerade detected"];
          return ["Behavioral Detection Triggered"];
        };

        setResult({
          filename: uploadedFile.name,
          // Bug fix: sha256_hash is at top level, not inside details
          hash: data.sha256_hash || data.details?.sha256 || "File analyzed",
          verdict: isMalicious ? "INFECTED" : "CLEAN",
          status: isMalicious ? "threat" : "safe",
          score: Math.round(confidence * 100),
          confidence: confidence,
          riskLevel: data.risk_level,
          timestamp: data.timestamp,
          details: details,
          yaraMatches: buildYara(),
          flags: buildFlags(),
        });

        setProgress(100);
      } else {
        setError(detectionResult.error || "File scan failed. Please try again.");
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to scan file. Ensure backend is running.";
      setError(errorMsg);
      console.error("File scan error:", err);
    } finally {
      clearInterval(progressInterval);
      setIsScanning(false);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      performScan(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="w-full min-h-[calc(100vh-64px)] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 pb-20">
    <div className="w-full max-w-4xl mx-auto pt-12 pb-24 px-6">

      <div className="mb-16 text-center mt-4">
        <h1 className="font-display font-bold text-4xl mb-6 tracking-[0.2em]">
          MALWARE <span className="text-[var(--neon-green)]">SANDBOX</span>
        </h1>
        <p className="font-body text-[var(--text-muted)] max-w-3xl mx-auto leading-loose text-lg">
          Upload suspicious files or executables. Our system detonates the payload in an isolated environment to extract YARA matches and behavioral heuristics.
        </p>
      </div>

      <div className="flex gap-4 justify-center mb-8">
        {FILE_TYPES.map((ext) => (
          <div key={ext} className="font-mono text-[10px] uppercase px-3 py-1 bg-[rgba(0,255,65,0.05)] text-[var(--neon-green)] border border-[rgba(0,255,65,0.2)]">
            {ext}
          </div>
        ))}
      </div>

      <div
        {...getRootProps()}
        className={`relative w-full h-64 border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-300 overflow-hidden ${isDragActive
            ? "border-[var(--neon-green)] bg-[rgba(0,255,65,0.1)]"
            : "border-[rgba(0,255,65,0.3)] bg-[rgba(0,0,0,0.8)] hover:border-[var(--neon-green)]"
          }`}
      >
        <input {...getInputProps()} />

        {/* Subtle binary rain effect inside dropzone when hovering */}
        <AnimatePresence>
          {isDragActive && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-to-b from-[transparent] via-[var(--neon-green)] to-[transparent] opacity-10 animate-scanline pointer-events-none"
            />
          )}
        </AnimatePresence>

        <UploadCloud className={`w-12 h-12 mb-4 transition-colors ${isDragActive ? 'text-[var(--neon-green)]' : 'text-[var(--text-muted)]'}`} />
        <p className="font-mono text-sm tracking-widest text-center text-white mb-2">
          {isDragActive ? "> DROP TARGET SOURCED_" : "[ DROP PAYLOAD OR CLICK TO BROWSE ]"}
        </p>
        <p className="font-body text-xs text-[var(--text-muted)]">Max file size: 50MB. All uploads are securely purged after analysis.</p>

        <svg className="absolute top-0 left-0 w-4 h-4" style={{ fill: "rgba(0,255,65,0.3)" }} viewBox="0 0 10 10">
          <polygon points="0,0 10,0 10,2 2,2 2,10 0,10" />
        </svg>
        <svg className="absolute bottom-0 right-0 w-4 h-4" style={{ fill: "rgba(0,255,65,0.3)" }} viewBox="0 0 10 10">
          <polygon points="10,10 0,10 0,8 8,8 8,0 10,0" />
        </svg>
      </div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-4 border border-[var(--neon-red)] bg-[rgba(255,0,60,0.1)] text-[var(--neon-red)] font-mono text-sm"
          >
            {error}
          </motion.div>
        )}

        {isScanning && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-12 p-10 md:p-14 bg-[rgba(0,0,0,0.9)] border border-[rgba(0,212,255,0.4)] shadow-[0_0_40px_rgba(0,212,255,0.08)]"
          >
            <div className="flex justify-between font-mono text-sm md:text-base tracking-[0.2em] mb-8">
              <span className="text-[var(--neon-cyan)] flex items-center gap-3">
                 <span className="animate-pulse">▶</span> DETONATING: {file?.name}
              </span>
              <span className="text-white font-bold">{progress}%</span>
            </div>

            <div className="w-full h-3 bg-[rgba(255,255,255,0.05)] relative overflow-hidden rounded-sm border border-[rgba(0,212,255,0.1)]">
              <motion.div
                className="absolute top-0 left-0 h-full bg-[var(--neon-cyan)] shadow-[0_0_15px_rgba(0,212,255,0.8)] transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="mt-8 font-mono text-xs md:text-sm tracking-widest text-[var(--text-muted)] uppercase flex flex-col gap-4">
              {progress > 20 && <span className="flex items-center gap-4 text-[var(--neon-green)]"><span className="w-6 text-center">✓</span> <span className="text-white">EXTRACTING_METADATA...</span> [OK]</span>}
              {progress > 50 && <span className="flex items-center gap-4 text-[var(--neon-cyan)]"><span className="animate-pulse w-6 text-center text-xl">⟳</span> <span className="text-white">YARA_SCAN...</span> [RUNNING]</span>}
              {progress > 80 && <span className="flex items-center gap-4 text-[var(--neon-amber)]"><span className="animate-pulse w-6 text-center text-xl">⚠</span> <span className="text-white">HEURISTIC_MONITORING...</span> [ACTIVE]</span>}
            </div>
          </motion.div>
        )}

        {result && !isScanning && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-12 p-8 border ${result.status === 'threat' ? 'border-[var(--neon-red)] bg-[rgba(255,0,60,0.05)]' : 'border-[var(--neon-green)] bg-[rgba(0,255,65,0.05)]'}`}
          >
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="font-mono text-[var(--text-muted)] text-[10px] tracking-[2px] mb-1">TARGET_FILE</h2>
                <div className="font-code text-xl text-white break-all flex items-center gap-3">
                  <FileType className={result.status === 'threat' ? 'text-[var(--neon-red)]' : 'text-[var(--neon-green)]'} />
                  {file?.name}
                </div>
              </div>
              <ThreatBadge status={result.status} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <div className="font-mono text-[10px] text-[var(--text-muted)] tracking-widest mb-2 flex items-center gap-2">
                    <Hash className="w-3 h-3" /> SHA256_HASH
                  </div>
                  <div className="font-code text-xs text-white bg-black p-3 border border-[rgba(255,255,255,0.1)] break-all">
                    {result.hash}
                  </div>
                </div>

                <div>
                  <div className="font-mono text-[10px] text-[var(--text-muted)] tracking-widest mb-2 flex items-center gap-2">
                    <Cpu className="w-3 h-3" /> BEHAVIORAL_FLAGS
                  </div>
                  <div className="flex flex-col gap-2">
                    {result.flags.map((flag: string, i: number) => (
                      <div key={i} className="flex items-center gap-2 font-mono text-[11px] bg-black p-2 border border-[rgba(255,255,255,0.05)]">
                        <span className={result.status === 'threat' ? 'text-[var(--neon-red)]' : 'text-[var(--neon-green)]'}>+</span>
                        <span className="text-white">{flag}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <div className="font-mono text-[10px] text-[var(--text-muted)] tracking-widest mb-2 flex items-center gap-2">
                  <ShieldAlert className="w-3 h-3" /> YOUR_MATCHES
                </div>

                {result.yaraMatches[0] === 'none' ? (
                  <div className="font-code text-[11px] text-[var(--neon-green)] bg-black p-4 border border-[rgba(0,255,65,0.2)]">
                    No malicious rules triggered.
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {result.yaraMatches.map((match: string, i: number) => (
                      <div key={i} className="font-code text-[11px] text-[var(--neon-red)] bg-black p-3 border border-[rgba(255,0,60,0.3)]">
                        [RULE_MATCH] {match}
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-8 pt-6 border-t border-[rgba(255,255,255,0.1)]">
                  <div className="font-mono text-[10px] text-[var(--text-muted)] tracking-[2px] mb-2">FINAL_VERDICT</div>
                  <div className={`font-display font-bold text-3xl tracking-widest ${result.status === 'threat' ? 'text-[var(--neon-red)]' : 'text-[var(--neon-green)]'}`}>
                    {result.verdict}
                  </div>
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
