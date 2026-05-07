"use client";

import { useEffect, useState, useCallback } from "react";
import { StatCard } from "@/components/StatCard";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  getDashboardStats,
  type DashboardStats,
  type RecentInterception,
  type ThreatDistributionItem,
  type ScanVolumeItem,
} from "@/lib/api";

// ── Skeleton loader block ────────────────────────────────────────────────────
function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-[rgba(0,255,65,0.06)] rounded ${className}`}
    />
  );
}

// ── Status / classification colour helpers ───────────────────────────────────
const typeColor = (type: RecentInterception["type"]) => {
  if (type === "MALWARE" || type === "PHISHING") return "text-[var(--neon-red)]";
  if (type === "SUSPICIOUS") return "text-[var(--neon-amber)]";
  return "text-[var(--neon-green)]";
};

const statusClass = (status: RecentInterception["status"]) => {
  if (status === "BLOCKED") return "border-[var(--neon-red)] text-[var(--neon-red)]";
  if (status === "PASSED") return "border-[var(--neon-green)] text-[var(--neon-green)]";
  return "border-[var(--neon-amber)] text-[var(--neon-amber)]";
};

// ── Main page ────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setError(null);
      const res = await getDashboardStats();
      if (res.success && res.data) {
        setStats(res.data);
        setLastRefreshed(new Date());
      }
    } catch (err: any) {
      setError(err?.message || "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch + auto-refresh every 30 s
  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30_000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  // ── Fallback threat distribution when DB is empty ──────────────────────────
  const threatDistribution: ThreatDistributionItem[] = stats?.threat_distribution ?? [
    { name: "Phishing URLs", value: 0, color: "var(--neon-cyan)" },
    { name: "Malware Files", value: 0, color: "var(--neon-red)" },
    { name: "Suspicious",    value: 0, color: "var(--neon-amber)" },
    { name: "Clean",         value: 0, color: "var(--neon-green)" },
  ];

  const scanVolume: ScanVolumeItem[] = stats?.scan_volume ?? [];
  const recentTable: RecentInterception[] = stats?.recent ?? [];

  return (
    <div className="w-full min-h-[calc(100vh-64px)] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 pb-20">
      <div className="w-full pt-8 pb-20 px-6">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="mb-14 mt-4 flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-display font-bold text-4xl tracking-[0.2em] text-white">
              GLOBAL <span className="text-[var(--neon-cyan)]">TELEMETRY</span>
            </h1>
            <p className="font-mono text-sm text-[var(--text-muted)] tracking-[0.3em] mt-4 uppercase">
              SYSTEM OVERVIEW / TACTICAL METRICS
            </p>
          </div>

          {/* Refresh button + last-update stamp */}
          <div className="flex flex-col items-end gap-2">
            <button
              onClick={() => { setLoading(true); fetchStats(); }}
              disabled={loading}
              className="font-mono text-[10px] tracking-[2px] uppercase px-4 py-2
                         border border-[var(--neon-cyan)] text-[var(--neon-cyan)]
                         hover:bg-[rgba(0,255,255,0.08)] transition-colors disabled:opacity-40"
            >
              {loading ? "SYNCING…" : "↻ REFRESH"}
            </button>
            {lastRefreshed && (
              <span className="font-mono text-[9px] text-[var(--text-muted)]">
                LAST SYNC: {lastRefreshed.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>

        {/* ── Error banner ────────────────────────────────────────────────── */}
        {error && (
          <div className="mb-6 p-4 border border-[var(--neon-red)] bg-[rgba(255,0,60,0.06)] font-mono text-[11px] text-[var(--neon-red)] tracking-widest flex items-center justify-between">
            <span>⚠ {error.toUpperCase()}</span>
            <button
              onClick={() => { setLoading(true); fetchStats(); }}
              className="underline underline-offset-2 hover:opacity-80 transition-opacity"
            >
              RETRY
            </button>
          </div>
        )}

        {/* ── STAT CARDS ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {loading ? (
            <>
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
            </>
          ) : (
            <>
              <StatCard label="TOTAL SCANS" value={stats?.total_scans ?? 0} color="white" />
              <StatCard label="THREATS BLOCKED" value={stats?.threats_blocked ?? 0} color="var(--neon-red)" />
              <StatCard label="PHISHING URLS" value={threatDistribution[0]?.value ?? 0} color="var(--neon-cyan)" />
              <StatCard
                label="CLEAN SCANS"
                value={
                  stats
                    ? Math.round(
                        ((threatDistribution[3]?.value ?? 0) /
                          Math.max(stats.total_scans, 1)) *
                          100
                      )
                    : 0
                }
                color="var(--neon-green)"
                isPercentage
              />
            </>
          )}
        </div>

        {/* ── CHARTS ──────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

          {/* Area chart */}
          <div className="lg:col-span-2 bg-[rgba(0,0,0,0.8)] border border-[rgba(0,255,65,0.15)] p-6 relative flex flex-col">
            <h3 className="font-mono text-[10px] text-[var(--neon-cyan)] tracking-[2px] mb-6">
              SCAN_VOLUME_vs_THREATS
            </h3>
            {loading ? (
              <Skeleton className="h-[280px] w-full" />
            ) : scanVolume.length === 0 ? (
              <div className="h-[280px] flex items-center justify-center font-mono text-[11px] text-[var(--text-muted)] tracking-widest">
                NO DATA YET — RUN SOME SCANS
              </div>
            ) : (
              <div className="h-[280px] w-full min-h-[280px] flex-1">
                <ResponsiveContainer width="99%" height="100%">
                  <AreaChart data={scanVolume} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="var(--neon-green)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="var(--neon-green)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="var(--neon-red)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="var(--neon-red)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="day" stroke="var(--text-muted)" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--text-muted)" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "black", border: "1px solid var(--neon-cyan)", borderRadius: 0 }}
                      itemStyle={{ fontFamily: "var(--font-code)", fontSize: "11px" }}
                      labelStyle={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)", fontSize: "10px", marginBottom: "8px" }}
                    />
                    <Area type="monotone" dataKey="scans"   stroke="var(--neon-green)" fillOpacity={1} fill="url(#colorScans)" />
                    <Area type="monotone" dataKey="threats" stroke="var(--neon-red)"   fillOpacity={1} fill="url(#colorThreats)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Pie chart */}
          <div className="bg-[rgba(0,0,0,0.8)] border border-[rgba(0,255,65,0.15)] p-6 relative">
            <h3 className="font-mono text-[10px] text-[var(--neon-cyan)] tracking-[2px] mb-2">
              INFRACTION_TYPES
            </h3>
            {loading ? (
              <Skeleton className="h-[280px] w-full mt-4" />
            ) : (
              <>
                <div className="h-[240px] w-full flex justify-center mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={threatDistribution}
                        cx="50%" cy="50%"
                        innerRadius={60} outerRadius={90}
                        paddingAngle={2}
                        dataKey="value"
                        stroke="none"
                      >
                        {threatDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: "black", border: "1px solid var(--border-glow)", borderRadius: 0 }}
                        itemStyle={{ fontFamily: "var(--font-code)", fontSize: "11px", color: "white" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-col gap-2 mt-2 px-4">
                  {threatDistribution.map((t) => (
                    <div key={t.name} className="flex justify-between items-center font-mono text-[10px] uppercase">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2" style={{ backgroundColor: t.color }} />
                        <span className="text-[var(--text-muted)]">{t.name}</span>
                      </div>
                      <span className="text-white font-code">{t.value}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── RECENT INTERCEPTIONS TABLE ───────────────────────────────────── */}
        <div className="bg-[rgba(0,0,0,0.8)] border border-[rgba(0,255,65,0.15)] relative overflow-hidden">
          <div className="p-4 border-b border-[rgba(255,255,255,0.05)] flex items-center justify-between">
            <h3 className="font-mono text-[10px] text-[var(--neon-cyan)] tracking-[2px]">
              RECENT_INTERCEPTIONS
            </h3>
            {stats && (
              <span className="font-mono text-[9px] text-[var(--text-muted)] tracking-widest">
                LIVE · MONGODB
              </span>
            )}
          </div>

          <div className="w-full overflow-x-auto">
            {loading ? (
              <div className="p-6 flex flex-col gap-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-8 w-full" />
                ))}
              </div>
            ) : recentTable.length === 0 ? (
              <div className="p-10 text-center font-mono text-[11px] text-[var(--text-muted)] tracking-widest">
                NO INTERCEPTIONS RECORDED — DATABASE IS EMPTY
              </div>
            ) : (
              <table className="w-full text-left font-mono">
                <thead className="text-[10px] text-[var(--text-muted)] bg-[rgba(255,255,255,0.02)]">
                  <tr>
                    <th className="p-4 font-normal">ID</th>
                    <th className="p-4 font-normal">TARGET / HASH</th>
                    <th className="p-4 font-normal">CLASS</th>
                    <th className="p-4 font-normal">TIME</th>
                    <th className="p-4 font-normal">ACTION</th>
                  </tr>
                </thead>
                <tbody className="text-[11px] text-white">
                  {recentTable.map((row, i) => (
                    <tr
                      key={i}
                      className="border-b border-[rgba(255,255,255,0.03)] hover:bg-[rgba(0,255,65,0.05)] transition-colors"
                    >
                      <td className="p-4 text-[var(--text-muted)]">[{row.id}]</td>
                      <td className="p-4 font-code text-[var(--neon-cyan)] max-w-[260px] truncate">
                        {row.target}
                      </td>
                      <td className={`p-4 ${typeColor(row.type)}`}>{row.type}</td>
                      <td className="p-4 text-[var(--text-muted)]">{row.time}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 bg-black border ${statusClass(row.status)}`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
