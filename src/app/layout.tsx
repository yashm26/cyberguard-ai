import type { Metadata } from "next";
import { Orbitron, Share_Tech_Mono, Rajdhani, JetBrains_Mono } from "next/font/google";
import "./globals.css";

import { Navbar } from "@/components/Navbar";
import { BinaryCanvas } from "@/components/BinaryCanvas";
import { LiveTicker } from "@/components/LiveTicker";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  weight: ["400", "700", "900"],
  subsets: ["latin"],
});

const shareTechMono = Share_Tech_Mono({
  variable: "--font-share-tech-mono",
  weight: "400",
  subsets: ["latin"],
});

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  weight: ["300", "400", "600"],
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CyberGuard AI",
  description: "Real-time phishing URL detection and malware file analysis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${orbitron.variable} ${shareTechMono.variable} ${rajdhani.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-body bg-black text-white overflow-x-hidden selection:bg-[var(--neon-green)] selection:text-black">
        <BinaryCanvas />
        <Navbar />
        <main className="flex-1 relative z-10 w-full max-w-[1280px] mx-auto pb-12">
          {children}
        </main>
        <LiveTicker />
      </body>
    </html>
  );
}
