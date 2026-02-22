'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Sparkles, Loader2, Copy, Check, ArrowLeft } from 'lucide-react';

export default function LandingBuilderPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const projectId = searchParams.get('id');
  
  const [context, setContext] = useState('');
  const [model, setModel] = useState('claude-sonnet-4-5');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [isViewingHistory, setIsViewingHistory] = useState(false);

  // Load project if ID is in URL
  useEffect(() => {
    if (projectId) {
      loadProject(projectId);
    }
  }, [projectId]);

  const loadProject = async (id: string) => {
    try {
      const res = await fetch(`/api/history/${id}`);
      const project = await res.json();
      
      if (project) {
        setContext(project.input);
        setResult(project.output);
        setModel(project.modelUsed === 'llama-3.3-70b-versatile' ? 'groq' : project.modelUsed);
        setIsViewingHistory(true);
      }
    } catch (error) {
      console.error('Failed to load project:', error);
    }
  };

  const generate = async () => {
    setLoading(true);
    setIsViewingHistory(false);
    
    try {
      const res = await fetch('/api/landing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context, model }),
      });
      const data = await res.json();
      if (data.success) setResult(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearForm = () => {
    setContext('');
    setResult(null);
    setIsViewingHistory(false);
    router.push('/landing-builder');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="text-purple-400" />
            {isViewingHistory ? 'View Landing Page' : 'Landing Page Builder'}
          </h1>
          {isViewingHistory && (
            <button
              onClick={clearForm}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition-colors"
            >
              <ArrowLeft size={16} className="inline mr-1" />
              New
            </button>
          )}
        </div>
        
        <select 
          value={model} 
          onChange={(e) => setModel(e.target.value)}
          disabled={isViewingHistory}
          className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm disabled:opacity-50"
        >
          <option value="claude-sonnet-4-5">Claude Sonnet 4.5</option>
          <option value="groq">Groq (Llama 3.1)</option>
        </select>
      </div>

      {/* Input */}
      <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800">
        <label className="block text-sm font-medium mb-2 text-slate-300">
          {isViewingHistory ? 'Original Context' : 'Project Context'}
        </label>
        <textarea
          value={context}
          onChange={(e) => setContext(e.target.value)}
          readOnly={isViewingHistory}
          placeholder="Describe the product, target audience, and key benefits..."
          className="w-full h-32 bg-slate-950 border border-slate-800 rounded-lg p-4 text-sm focus:ring-2 focus:ring-purple-500 resize-none read-only:bg-slate-900/30"
        />
        
        {!isViewingHistory && (
          <button
            onClick={generate}
            disabled={loading || context.length < 10}
            className="mt-4 w-full bg-purple-600 hover:bg-purple-700 disabled:bg-slate-700 disabled:cursor-not-allowed py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Generating...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Generate Landing Page
              </>
            )}
          </button>
        )}
      </div>

      {/* Results */}
      {result && (
        <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800 space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">{result.headline}</h2>
              <p className="text-lg text-slate-300">{result.subheadline}</p>
            </div>
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition-colors"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? 'Copied!' : 'Copy JSON'}
            </button>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-4">
            {result.features?.map((feature: any, i: number) => (
              <div key={i} className="bg-slate-950/50 p-4 rounded-lg border border-slate-800">
                <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="bg-purple-900/20 border border-purple-800/50 rounded-lg p-6 text-center">
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-medium transition-colors">
              {result.cta || 'Get Started'}
            </button>
          </div>

          {isViewingHistory && (
            <div className="pt-4 border-t border-slate-800 text-center text-sm text-slate-500">
              Saved landing page from history
            </div>
          )}
        </div>
      )}
    </div>
  );
}