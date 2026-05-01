"use client";

import { StatCard } from "@/components/StatCard";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const scanData = [
  { day: "MON", scans: 1200, threats: 45 },
  { day: "TUE", scans: 1800, threats: 112 },
  { day: "WED", scans: 2400, threats: 350 },
  { day: "THU", scans: 2100, threats: 180 },
  { day: "FRI", scans: 3200, threats: 420 },
  { day: "SAT", scans: 2800, threats: 210 },
  { day: "SUN", scans: 4100, threats: 850 } // Spikes on weekends
];

const threatDistribution = [
  { name: "Phishing URLs", value: 450, color: "var(--neon-cyan)" },
  { name: "Malware Files", value: 300, color: "var(--neon-red)" },
  { name: "Suspicious", value: 200, color: "var(--neon-amber)" },
  { name: "Clean", value: 8050, color: "var(--neon-green)" }
];

const recentTable = [
  { id: "TX-4892", target: "discord-nitro-gift.com", type: "PHISHING", time: "2 min ago", status: "BLOCKED" },
  { id: "TX-4891", target: "invoice_1094.pdf.exe", type: "MALWARE", time: "5 min ago", status: "BLOCKED" },
  { id: "TX-4890", target: "github.com", type: "CLEAN", time: "12 min ago", status: "PASSED" },
  { id: "TX-4889", target: "paypal.security-update.xyz", type: "PHISHING", time: "18 min ago", status: "BLOCKED" },
  { id: "TX-4888", target: "setup_v2.zip", type: "SUSPICIOUS", time: "24 min ago", status: "QUARANTINED" },
];

export default function DashboardPage() {
  return (
    <div className="w-full min-h-[calc(100vh-64px)] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 pb-20">
    <div className="w-full pt-8 pb-20 px-6">
      
      <div className="mb-14 mt-4">
        <h1 className="font-display font-bold text-4xl tracking-[0.2em] text-white">
          GLOBAL <span className="text-[var(--neon-cyan)]">TELEMETRY</span>
        </h1>
        <p className="font-mono text-sm text-[var(--text-muted)] tracking-[0.3em] mt-4 uppercase">
          SYSTEM OVERVIEW / TACTICAL METRICS
        </p>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="TOTAL SCANS (7D)" value={17600} color="white" />
        <StatCard label="THREATS BLOCKED" value={2167} color="var(--neon-red)" />
        <StatCard label="AVG RESPONSE" value={1.2} color="var(--neon-cyan)" suffix="s" />
        <StatCard label="ACCURACY SCORE" value={99.4} color="var(--neon-green)" isPercentage />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        <div className="lg:col-span-2 bg-[rgba(0,0,0,0.8)] border border-[rgba(0,255,65,0.15)] p-6 relative flex flex-col">
          <h3 className="font-mono text-[10px] text-[var(--neon-cyan)] tracking-[2px] mb-6">SCAN_VOLUME_vs_THREATS</h3>
          <div className="h-[280px] w-full min-h-[280px] flex-1">
            <ResponsiveContainer width="99%" height="100%">
              <AreaChart data={scanData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--neon-green)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--neon-green)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--neon-red)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--neon-red)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="day" stroke="var(--text-muted)" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'black', border: '1px solid var(--neon-cyan)', borderRadius: 0 }}
                  itemStyle={{ fontFamily: 'var(--font-code)', fontSize: '11px' }}
                  labelStyle={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '10px', marginBottom: '8px' }}
                />
                <Area type="monotone" dataKey="scans" stroke="var(--neon-green)" fillOpacity={1} fill="url(#colorScans)" />
                <Area type="monotone" dataKey="threats" stroke="var(--neon-red)" fillOpacity={1} fill="url(#colorThreats)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[rgba(0,0,0,0.8)] border border-[rgba(0,255,65,0.15)] p-6 relative">
          <h3 className="font-mono text-[10px] text-[var(--neon-cyan)] tracking-[2px] mb-2">INFRACTION_TYPES</h3>
          <div className="h-[240px] w-full flex justify-center mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={threatDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {threatDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'black', border: '1px solid var(--border-glow)', borderRadius: 0 }}
                  itemStyle={{ fontFamily: 'var(--font-code)', fontSize: '11px', color: 'white' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-col gap-2 mt-2 px-4">
             {threatDistribution.map(t => (
               <div key={t.name} className="flex justify-between items-center font-mono text-[10px] uppercase">
                 <div className="flex items-center gap-2">
                   <span className="w-2 h-2" style={{ backgroundColor: t.color }}></span>
                   <span className="text-[var(--text-muted)]">{t.name}</span>
                 </div>
                 <span className="text-white font-code">{t.value}</span>
               </div>
             ))}
          </div>
        </div>

      </div>

      {/* TABLE */}
      <div className="bg-[rgba(0,0,0,0.8)] border border-[rgba(0,255,65,0.15)] relative overflow-hidden">
        <div className="p-4 border-b border-[rgba(255,255,255,0.05)]">
           <h3 className="font-mono text-[10px] text-[var(--neon-cyan)] tracking-[2px]">RECENT_INTERCEPTIONS</h3>
        </div>
        
        <div className="w-full overflow-x-auto">
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
                <tr key={i} className="border-b border-[rgba(255,255,255,0.03)] hover:bg-[rgba(0,255,65,0.05)] transition-colors">
                  <td className="p-4 text-[var(--text-muted)]">[{row.id}]</td>
                  <td className="p-4 font-code text-[var(--neon-cyan)]">{row.target}</td>
                  <td className="p-4">
                    <span className={
                      row.type === 'MALWARE' || row.type === 'PHISHING' ? 'text-[var(--neon-red)]' :
                      row.type === 'SUSPICIOUS' ? 'text-[var(--neon-amber)]' : 'text-[var(--neon-green)]'
                    }>
                      {row.type}
                    </span>
                  </td>
                  <td className="p-4 text-[var(--text-muted)]">{row.time}</td>
                  <td className="p-4">
                     <span className={`px-2 py-1 bg-black border ${
                        row.status === 'BLOCKED' ? 'border-[var(--neon-red)] text-[var(--neon-red)]' : 
                        row.status === 'PASSED' ? 'border-[var(--neon-green)] text-[var(--neon-green)]' :
                        'border-[var(--neon-amber)] text-[var(--neon-amber)]'
                     }`}>
                       {row.status}
                     </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
    </div>
  );
}
