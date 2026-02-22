import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">AI Product Suite</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <Link href="/analyzer" className="p-6 bg-slate-900 rounded-xl border border-slate-800 hover:border-blue-500 transition">
          <h2 className="text-2xl font-semibold mb-2">Requirements Analyzer</h2>
          <p className="text-slate-400">Analyze client briefs with AI</p>
        </Link>
        <Link href="/landing-builder" className="p-6 bg-slate-900 rounded-xl border border-slate-800 hover:border-purple-500 transition">
          <h2 className="text-2xl font-semibold mb-2">Landing Page Builder</h2>
          <p className="text-slate-400">Generate marketing pages</p>
        </Link>
      </div>
    </div>
  );
}