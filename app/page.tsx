import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold eastern-peak:text-slate-900">AI Product Suite</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <Link href="/analyzer" className="p-6 bg-slate-900 rounded-xl border border-slate-800 hover:border-blue-500 transition eastern-peak:bg-white eastern-peak:border-gray-200 eastern-peak:hover:border-green-500 eastern-peak:shadow-sm">
          <h2 className="text-2xl font-semibold mb-2 eastern-peak:text-slate-900">Requirements Analyzer</h2>
          <p className="text-slate-400 eastern-peak:text-slate-600">Analyze client briefs with AI</p>
        </Link>
        <Link href="/landing-builder" className="p-6 bg-slate-900 rounded-xl border border-slate-800 hover:border-purple-500 transition eastern-peak:bg-white eastern-peak:border-gray-200 eastern-peak:hover:border-green-500 eastern-peak:shadow-sm">
          <h2 className="text-2xl font-semibold mb-2 eastern-peak:text-slate-900">Landing Page Builder</h2>
          <p className="text-slate-400 eastern-peak:text-slate-600">Generate marketing pages</p>
        </Link>
      </div>
    </div>
  );
}
