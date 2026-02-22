import type { Metadata } from "next";
import "./globals.css";
import "./eastern-peak.css";
import Link from "next/link";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";

export const metadata: Metadata = {
  title: "AI Product Suite",
  description: "Requirements Analysis & Landing Page Builder",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-slate-950 text-white min-h-screen transition-colors duration-300" suppressHydrationWarning>
        <ThemeProvider>
          <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur transition-colors duration-300 eastern-peak:bg-white eastern-peak:border-gray-200">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
              <Link href="/" className="font-bold text-xl eastern-peak:text-slate-900">AI Suite</Link>
              <div className="flex items-center gap-6 text-sm">
                <Link href="/analyzer" className="hover:text-blue-400 transition-colors eastern-peak:text-slate-600 eastern-peak:hover:text-green-500">Analyzer</Link>
                <Link href="/landing-builder" className="hover:text-blue-400 transition-colors eastern-peak:text-slate-600 eastern-peak:hover:text-green-500">Landing Builder</Link>
                <Link href="/history" className="hover:text-blue-400 transition-colors eastern-peak:text-slate-600 eastern-peak:hover:text-green-500">History</Link>
                <Link href="/settings" className="hover:text-blue-400 transition-colors eastern-peak:text-slate-600 eastern-peak:hover:text-green-500">Settings</Link>
                <ThemeToggle />
              </div>
            </div>
          </nav>
          <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
