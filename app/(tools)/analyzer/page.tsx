'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, Sparkles, FileText, ArrowRight, Save } from 'lucide-react';

function AnalyzerContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get('id');
  
  const [brief, setBrief] = useState('');
  const [model, setModel] = useState('claude-sonnet-4-5');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
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
        setBrief(project.input);
        setResult(project.output);
        setModel(project.modelUsed === 'llama-3.3-70b-versatile' ? 'groq' : project.modelUsed);
        setIsViewingHistory(true);
      }
    } catch (error) {
      console.error('Failed to load project:', error);
    }
  };

  const analyze = async () => {
    setLoading(true);
    setError('');
    setIsViewingHistory(false);
    
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brief, model }),
      });
      
      const data = await res.json();
      
      if (!data.success) throw new Error(data.error);
      setResult(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const generateLanding = () => {
    const context = `Project: ${result?.projectName || 'New Project'}
Description: ${result?.summary || ''}
Features: ${result?.functionalRequirements?.join(', ') || ''}`;
    router.push(`/landing-builder?context=${encodeURIComponent(context)}`);
  };

  const clearForm = () => {
    setBrief('');
    setResult(null);
    setIsViewingHistory(false);
    router.push('/analyzer');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FileText className="text-blue-400" />
          {isViewingHistory ? 'View Analysis' : 'Requirements Analyzer'}
        </h1>
        
        <div className="flex items-center gap-3">
          {isViewingHistory && (
            <button
              onClick={clearForm}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition-colors eastern-peak:bg-gray-100 eastern-peak:hover:bg-gray-200"
            >
              New Analysis
            </button>
          )}
          
          <select 
            value={model} 
            onChange={(e) => setModel(e.target.value)}
            disabled={isViewingHistory}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm disabled:opacity-50 eastern-peak:bg-white eastern-peak:border-gray-300"
          >
            <option value="claude-sonnet-4-5">Claude Sonnet 4.5</option>
            <option value="groq">Groq (Llama 3.1)</option>
          </select>
        </div>
      </div>

      {/* Input Section */}
      <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800 eastern-peak:bg-white eastern-peak:border-gray-200">
        <label className="block text-sm font-medium mb-2 text-slate-300 eastern-peak:text-gray-600">
          {isViewingHistory ? 'Original Brief' : 'Client Project Brief'}
        </label>
        <textarea
          value={brief}
          onChange={(e) => setBrief(e.target.value)}
          readOnly={isViewingHistory}
          placeholder="Describe the project requirements..."
          className="w-full h-40 bg-slate-950 border border-slate-800 rounded-lg p-4 text-sm focus:ring-2 focus:ring-blue-500 resize-none read-only:bg-slate-900/30 eastern-peak:bg-white eastern-peak:border-gray-300 eastern-peak:text-gray-800"
        />
        
        {!isViewingHistory && (
          <div className="flex justify-between items-center mt-4">
            <span className="text-xs text-slate-500 eastern-peak:text-gray-500">{brief.length} characters</span>
            <button
              onClick={analyze}
              disabled={loading || brief.length < 10}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors eastern-peak:bg-green-600 eastern-peak:hover:bg-green-700"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Analyze Brief
                </>
              )}
            </button>
          </div>
        )}
        
        {error && (
          <div className="mt-4 p-3 bg-red-900/50 border border-red-800 rounded text-red-200 text-sm eastern-peak:bg-red-50 eastern-peak:text-red-700 eastern-peak:border-red-200">
            {error}
          </div>
        )}
      </div>

      {/* Results Section */}
      {result && (
        <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800 space-y-6 eastern-peak:bg-white eastern-peak:border-gray-200">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-semibold text-blue-400 eastern-peak:text-green-600">{result.projectName}</h2>
              <p className="text-slate-400 text-sm mt-1 eastern-peak:text-gray-600">{result.summary}</p>
            </div>
            <button
              onClick={generateLanding}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium transition-colors whitespace-nowrap shrink-0 eastern-peak:bg-green-600 eastern-peak:hover:bg-green-700"
            >
              Generate Landing
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Functional Requirements */}
          <section>
            <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-3 eastern-peak:text-gray-500">
              Functional Requirements
            </h3>
            <ul className="space-y-2">
              {result.functionalRequirements?.map((req: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-slate-300 eastern-peak:text-gray-700">
                  <span className="text-blue-400 mt-1 eastern-peak:text-red-500">•</span>
                  {req}
                </li>
              ))}
            </ul>
          </section>

          {/* User Stories */}
          <section>
            <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-3 eastern-peak:text-gray-500">
              User Stories
            </h3>
            <div className="grid gap-3">
              {result.userStories?.map((story: any, i: number) => (
                <div key={i} className="bg-slate-950/50 p-3 rounded-lg border-l-4 border-purple-500 eastern-peak:bg-gray-50 eastern-peak:border-l-red-500">
                  <p className="text-sm eastern-peak:text-gray-700">
                    As a <span className="text-purple-400 eastern-peak:text-green-600">{story.role}</span>, I want{' '}
                    <span className="text-blue-400 eastern-peak:text-blue-600">{story.action}</span> so that{' '}
                    <span className="text-green-400 eastern-peak:text-green-600">{story.benefit}</span>
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* AI Opportunities */}
          <section>
            <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-3 eastern-peak:text-gray-500">
              AI Opportunities
            </h3>
            <ul className="space-y-2">
              {result.aiOpportunities?.map((opp: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-slate-300 eastern-peak:text-gray-700">
                  <span className="text-yellow-400 mt-1 eastern-peak:text-yellow-600">✦</span>
                  {opp}
                </li>
              ))}
            </ul>
          </section>

          {/* Complexity & Risks */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-slate-950/50 p-4 rounded-lg eastern-peak:bg-gray-50">
              <h3 className="text-sm font-medium text-slate-400 mb-2 eastern-peak:text-gray-500">Complexity</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                result.estimatedComplexity === 'Low' ? 'bg-green-900/50 text-green-400 eastern-peak:bg-green-100 eastern-peak:text-green-700' :
                result.estimatedComplexity === 'Medium' ? 'bg-yellow-900/50 text-yellow-400 eastern-peak:bg-yellow-100 eastern-peak:text-yellow-700' :
                'bg-red-900/50 text-red-400 eastern-peak:bg-red-100 eastern-peak:text-red-700'
              }`}>
                {result.estimatedComplexity}
              </span>
            </div>
            <div className="bg-slate-950/50 p-4 rounded-lg eastern-peak:bg-gray-50">
              <h3 className="text-sm font-medium text-slate-400 mb-2 eastern-peak:text-gray-500">MVP Scope</h3>
              <p className="text-sm text-slate-300 eastern-peak:text-gray-700">{result.mvpScope}</p>
            </div>
          </div>

          {isViewingHistory && (
            <div className="pt-4 border-t border-slate-800 text-center eastern-peak:border-gray-200">
              <p className="text-sm text-slate-500 eastern-peak:text-gray-500">
                <Save size={14} className="inline mr-1" />
                This analysis was saved on {new Date().toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AnalyzerPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    }>
      <AnalyzerContent />
    </Suspense>
  );
}
