"use client";

import React, { useEffect, useRef } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*<>?/\\|";

interface GlitchTextProps {
  text: string;
  delay?: number;         // ms before animation starts
  className?: string;
  as?: React.ElementType;
  speed?: number;         // interval ms per frame (default 10)
}

export function GlitchText({
  text,
  delay = 0,
  className = "",
  as: Tag = "span",
  speed = 10,
}: GlitchTextProps) {
  const elRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    const chars = text.split("");
    const total = chars.length;
    let revealed = 0;
    let iv: ReturnType<typeof setInterval>;
    let timer: ReturnType<typeof setTimeout>;

    // Start scrambled
    el.textContent = Array.from({ length: total }, () =>
      CHARS[Math.floor(Math.random() * CHARS.length)]
    ).join("");

    timer = setTimeout(() => {
      iv = setInterval(() => {
        // Reveal 2 chars per tick for speed
        revealed = Math.min(revealed + 2, total);
        let out = "";
        for (let i = 0; i < total; i++) {
          out += i < revealed
            ? chars[i]
            : CHARS[Math.floor(Math.random() * CHARS.length)];
        }
        el.textContent = out;
        if (revealed >= total) {
          el.textContent = text;
          clearInterval(iv);
        }
      }, speed);
    }, delay);

    return () => {
      clearTimeout(timer);
      clearInterval(iv);
    };
  }, [text, delay, speed]);

  return <Tag ref={elRef} className={className} suppressHydrationWarning />;
}

// Hook version — for inline use inside JSX
export function useGlitchEffect(
  elRef: React.RefObject<HTMLElement | null>,
  text: string,
  delay = 0,
  speed = 10
) {
  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    const chars = text.split("");
    const total = chars.length;
    let revealed = 0;
    let frame = 0;
    let iv: ReturnType<typeof setInterval>;
    let timer: ReturnType<typeof setTimeout>;

    el.textContent = Array.from({ length: total }, () =>
      CHARS[Math.floor(Math.random() * CHARS.length)]
    ).join("");

    timer = setTimeout(() => {
      iv = setInterval(() => {
        let out = "";
        for (let i = 0; i < total; i++) {
          if (i < revealed) {
            out += chars[i];
          } else {
            out += CHARS[Math.floor(Math.random() * CHARS.length)];
          }
        }
        el.textContent = out;
        frame++;
        if (frame % 2 === 0 && revealed < total) revealed++;
        if (revealed >= total) {
          el.textContent = text;
          clearInterval(iv);
        }
      }, speed);
    }, delay);

    return () => {
      clearTimeout(timer);
      clearInterval(iv);
    };
  }, [elRef, text, delay, speed]);
}
