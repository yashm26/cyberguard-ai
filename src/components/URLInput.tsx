"use client";

import { ClipboardPaste } from "lucide-react";
import { FormEvent, useState } from "react";

interface URLInputProps {
  onSubmit: (url: string) => void;
  isLoading?: boolean;
}

export function URLInput({ onSubmit, isLoading }: URLInputProps) {
  const [url, setUrl] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (url) {
      onSubmit(url);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
    } catch (err) {
      console.error("Failed to read clipboard", err);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="relative flex items-center w-full max-w-2xl mx-auto transition-all duration-300"
      style={{
        height: "52px",
        background: "rgba(0,0,0,0.9)",
        border: `1px solid ${isFocused ? "var(--neon-green)" : "rgba(0,255,65,0.3)"}`,
        boxShadow: isFocused ? "0 0 16px rgba(0,255,65,0.2)" : "none",
      }}
    >
      <div className="absolute left-4 font-mono text-sm text-[var(--text-muted)] animate-pulse">
        &gt;
      </div>
      
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="ENTER URL TARGET TO ANALYZE..."
        className="w-full h-full bg-transparent pl-10 pr-32 font-code text-[13px] text-white outline-none placeholder:text-[var(--text-muted)] placeholder:font-mono placeholder:tracking-widest"
        disabled={isLoading}
      />
      
      <div className="absolute right-2 flex items-center gap-2">
        <button
          type="button"
          onClick={handlePaste}
          className="p-1.5 text-[var(--text-muted)] hover:text-white transition-colors cursor-pointer"
          title="Paste from clipboard"
        >
          <ClipboardPaste className="w-4 h-4" />
        </button>
        
        <button
          type="submit"
          disabled={!url || isLoading}
          className="flex items-center justify-center h-[36px] px-4 bg-transparent text-[var(--neon-green)] border border-[rgba(0,255,65,0.3)] hover:bg-[var(--neon-green)] hover:text-black font-mono text-[11px] tracking-widest uppercase transition-all"
          style={{
            clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))"
          }}
        >
          [ ANALYZE ]
        </button>
      </div>
    </form>
  );
}
