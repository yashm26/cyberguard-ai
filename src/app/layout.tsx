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
  display: "swap",
});

const shareTechMono = Share_Tech_Mono({
  variable: "--font-share-tech-mono",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  weight: ["300", "400", "600"],
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CyberGuard AI — Phishing & Malware Detection",
  description:
    "Military-grade AI threat detection platform. Real-time phishing URL analysis and malware file scanning powered by Flask ML backend.",
  keywords: ["cybersecurity", "phishing detection", "malware scanner", "AI security"],
  authors: [{ name: "CyberGuard AI" }],
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${orbitron.variable} ${shareTechMono.variable} ${rajdhani.variable} ${jetbrainsMono.variable} h-full w-full antialiased`}
    >
      <body
        className="min-h-full w-full flex flex-col overflow-x-hidden"
        style={{ backgroundColor: "#020b08", color: "#00FF41" }}
      >
        {/* Animated neural network background */}
        <BinaryCanvas />

        {/* Sticky top navbar */}
        <Navbar />

        {/* Page content */}
        <main className="flex-1 relative z-10 w-full flex flex-col items-center pb-16">
          <div className="w-full max-w-[1400px]">
            {children}
          </div>
        </main>

        {/* Scrolling threat feed at bottom */}
        <LiveTicker />
      </body>
    </html>
  );
}
