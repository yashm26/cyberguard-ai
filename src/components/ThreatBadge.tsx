import { Loader2 } from "lucide-react";

export type ThreatStatus = "threat" | "safe" | "scanning" | "warning";

interface ThreatBadgeProps {
  status: ThreatStatus;
}

export function ThreatBadge({ status }: ThreatBadgeProps) {
  const styles = {
    threat: {
      bg: "rgba(255,0,60,0.15)",
      color: "var(--neon-red)",
      border: "1px solid rgba(255,0,60,0.4)",
    },
    safe: {
      bg: "rgba(0,255,65,0.12)",
      color: "var(--neon-green)",
      border: "1px solid rgba(0,255,65,0.3)",
    },
    scanning: {
      bg: "rgba(0,212,255,0.12)",
      color: "var(--neon-cyan)",
      border: "1px solid rgba(0,212,255,0.3)", // Using cyan border for consistency
    },
    warning: {
      bg: "rgba(255,184,0,0.15)",
      color: "var(--neon-amber)",
      border: "1px solid rgba(255,184,0,0.4)",
    },
  };

  const currentStyle = styles[status];

  return (
    <div
      className="inline-flex items-center font-mono uppercase"
      style={{
        backgroundColor: currentStyle.bg,
        color: currentStyle.color,
        border: currentStyle.border,
        fontSize: "9px",
        letterSpacing: "1px",
        padding: "3px 8px",
      }}
    >
      {status === "scanning" && (
        <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />
      )}
      {status === "threat" && "THREAT"}
      {status === "safe" && "SAFE"}
      {status === "scanning" && "SCANNING"}
      {status === "warning" && "WARNING"}
    </div>
  );
}
