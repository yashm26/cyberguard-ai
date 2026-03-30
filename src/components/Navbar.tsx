"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { name: "SCAN", href: "/scan" },
    { name: "UPLOAD", href: "/upload" },
    { name: "DASHBOARD", href: "/dashboard" },
    { name: "ABOUT", href: "/about" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-[rgba(0,0,0,0.85)] border-b border-[rgba(0,255,65,0.15)] backdrop-blur-md">
      <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-1 group">
          <span className="font-display font-black text-xl text-[var(--neon-green)] tracking-widest group-hover:drop-shadow-[0_0_8px_rgba(0,255,65,0.5)] transition-all">
            CYBER<span className="text-[var(--neon-cyan)]">GUARD</span>
          </span>
          <span className="font-display font-bold text-xl text-white ml-1">AI</span>
        </Link>
        
        {/* LINKS */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className="font-mono text-[11px] uppercase tracking-[2px] transition-colors relative"
                style={{
                  color: isActive ? "var(--neon-green)" : "var(--text-muted)",
                }}
              >
                {link.name}
                {isActive && (
                  <span className="absolute -bottom-[22px] left-0 right-0 h-[2px] bg-[var(--neon-green)] shadow-[0_0_8px_rgba(0,255,65,0.8)]" />
                )}
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        <Link
          href="/scan"
          className="hidden md:flex items-center justify-center h-[34px] px-6 bg-black text-[var(--neon-green)] border border-[var(--neon-green)] hover:bg-[var(--neon-green)] hover:text-black font-mono text-[11px] tracking-[2px] uppercase transition-all shadow-[0_0_10px_rgba(0,255,65,0.1)] hover:shadow-[0_0_15px_rgba(0,255,65,0.4)]"
          style={{
            clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))"
          }}
        >
          [ INIT SCAN ]
        </Link>
      </div>
    </nav>
  );
}
