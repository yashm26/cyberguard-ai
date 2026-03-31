"use client";

import { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  isCyan: boolean;
}

interface HexFragment {
  x: number;
  y: number;
  vy: number;
  text: string;
  opacity: number;
  size: number;
}

interface ScanLine {
  y: number;
  speed: number;
}

const HEX_POOL = [
  "3FA9C2","BEEF01","A7F3D0","C0FFEE","DEAD42","00FF41","1337AB",
  "F00BAR","BABA24","D34DB3","4C1D95","0FF1CE","B00B5E","CAFEF0",
  "FF003C","00D4FF","7FB3C8","E2D96F","ABD0FF","95F4CE",
];

export function BinaryCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let intervalId: ReturnType<typeof setInterval>;
    let resizeTimer: ReturnType<typeof setTimeout>;

    let W = 0, H = 0;
    let nodes: Node[] = [];
    let hexFragments: HexFragment[] = [];
    let scanLines: ScanLine[] = [];

    const buildScene = () => {
      W = window.innerWidth;
      H = window.innerHeight;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      // --- Neural network nodes (55) ---
      nodes = Array.from({ length: 55 }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        r: 0.5 + Math.random() * 1.5,
        isCyan: Math.random() < 0.25,
      }));

      // --- Hex fragments (28) ---
      hexFragments = Array.from({ length: 28 }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vy: (Math.random() - 0.5) * 0.4,
        text: HEX_POOL[Math.floor(Math.random() * HEX_POOL.length)],
        opacity: 0.04 + Math.random() * 0.18,
        size: 9 + Math.random() * 2,
      }));

      // --- Horizontal scan lines (3) ---
      scanLines = Array.from({ length: 3 }, () => ({
        y: Math.random() * H,
        speed: 0.2 + Math.random() * 0.4,
      }));

      // Fill solid background once
      ctx.fillStyle = "#020b08";
      ctx.fillRect(0, 0, W, H);
    };

    const draw = () => {
      // Ghosting overlay — creates trails
      ctx.fillStyle = "rgba(2,11,8,0.92)";
      ctx.fillRect(0, 0, W, H);

      // ── Hex fragments ──────────────────────────────────────────────
      hexFragments.forEach((hf) => {
        ctx.font = `${hf.size}px 'Share Tech Mono', monospace`;
        ctx.fillStyle = `rgba(0,255,65,${hf.opacity})`;
        ctx.fillText(hf.text, hf.x, hf.y);

        hf.y += hf.vy;
        if (hf.y < -20) hf.y = H + 20;
        if (hf.y > H + 20) hf.y = -20;
      });

      // ── Neural network connections ──────────────────────────────────
      const MAX_DIST = 110;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            const alpha = (1 - dist / MAX_DIST) * 0.12;
            const mixed = a.isCyan && b.isCyan;
            ctx.strokeStyle = mixed
              ? `rgba(0,212,255,${alpha})`
              : `rgba(0,255,65,${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // ── Neural network nodes ────────────────────────────────────────
      nodes.forEach((n) => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = n.isCyan
          ? "rgba(0,212,255,0.6)"
          : "rgba(0,255,65,0.6)";
        ctx.fill();

        // Drift
        n.x += n.vx;
        n.y += n.vy;

        // Wrap around edges
        if (n.x < -10) n.x = W + 10;
        if (n.x > W + 10) n.x = -10;
        if (n.y < -10) n.y = H + 10;
        if (n.y > H + 10) n.y = -10;
      });

      // ── Horizontal scan lines ───────────────────────────────────────
      scanLines.forEach((sl) => {
        const grad = ctx.createLinearGradient(0, sl.y - 1, 0, sl.y + 1);
        grad.addColorStop(0, "rgba(0,255,65,0)");
        grad.addColorStop(0.5, "rgba(0,255,65,0.06)");
        grad.addColorStop(1, "rgba(0,255,65,0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, sl.y - 1, W, 2);

        sl.y += sl.speed;
        if (sl.y > H + 5) sl.y = -5;
      });
    };

    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(buildScene, 150);
    };

    buildScene();
    intervalId = setInterval(draw, 33); // ~30fps per spec
    window.addEventListener("resize", handleResize);

    return () => {
      clearInterval(intervalId);
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
        display: "block",
      }}
    />
  );
}
