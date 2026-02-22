import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AI Product Suite",
  description: "Requirements Analysis & Landing Page Builder",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-slate-950 text-white min-h-screen" suppressHydrationWarning>
        <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="font-bold text-xl">AI Suite</Link>
            <div className="flex gap-6 text-sm">
              <Link href="/analyzer" className="hover:text-blue-400">Analyzer</Link>
              <Link href="/landing-builder" className="hover:text-blue-400">Landing Builder</Link>
              <Link href="/history" className="hover:text-blue-400">History</Link>
              <Link href="/settings" className="hover:text-blue-400">Settings</Link>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}