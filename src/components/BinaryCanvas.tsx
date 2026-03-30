"use client";

import { useEffect, useRef } from "react";

export function BinaryCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let resizeTimer: ReturnType<typeof setTimeout>;

    const CHAR_SIZE = 16;
    const FPS = 20;
    const fpsInterval = 1000 / FPS;
    let lastTime = 0;

    // Mutable state — fully rebuilt on every resize
    let drops: number[] = [];
    let isCyanCol: boolean[] = [];
    let numCols = 0;
    let W = 0;
    let H = 0;

    const init = () => {
      // Always read the latest viewport dimensions — crucial for large screens
      W = window.innerWidth;
      H = window.innerHeight;

      // HiDPI / Retina support: scale canvas buffer to device pixel ratio
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;

      // Reset transform and re-apply DPR scale every time (avoids cumulative scale on resize)
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      // Fully rebuild columns based on new width — no partial patching
      numCols = Math.ceil(W / CHAR_SIZE) + 2; // +2 buffer to guarantee right-edge coverage
      drops = Array.from({ length: numCols }, () =>
        Math.floor(Math.random() * Math.ceil(H / CHAR_SIZE))
      );
      isCyanCol = Array.from({ length: numCols }, () => Math.random() < 0.18);

      // Paint a clean black slate so old trails don't bleed through after resize
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, W, H);
    };

    const draw = () => {
      // Semi-transparent overlay is what creates the iconic fading "comet tail" effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, W, H);

      ctx.font = `bold ${CHAR_SIZE}px monospace`;
      ctx.textAlign = "left";

      for (let i = 0; i < numCols; i++) {
        const char = Math.random() > 0.5 ? "1" : "0";
        const x = i * CHAR_SIZE;
        const y = drops[i] * CHAR_SIZE;

        // ~15% of characters get a bright white "head" for the glowing leading edge
        if (Math.random() > 0.85) {
          ctx.fillStyle = "#FFFFFF";
        } else if (isCyanCol[i]) {
          ctx.fillStyle = "#00D4FF";
        } else {
          ctx.fillStyle = "#00FF41";
        }

        ctx.fillText(char, x, y);

        // Randomly reset a finished stream back to the top of the screen
        if (y > H && Math.random() > 0.975) {
          drops[i] = 0;
          isCyanCol[i] = Math.random() < 0.18;
        }

        drops[i]++;
      }
    };

    const render = (timestamp: number) => {
      animationFrameId = requestAnimationFrame(render);
      const elapsed = timestamp - lastTime;
      if (elapsed > fpsInterval) {
        lastTime = timestamp - (elapsed % fpsInterval);
        draw();
      }
    };

    // Debounce resize — prevents thrashing on continuous drag resize
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(init, 150);
    };

    init();
    animationFrameId = requestAnimationFrame(render);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      clearTimeout(resizeTimer);
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
        opacity: 0.38,
        pointerEvents: "none",
        display: "block",
      }}
    />
  );
}
