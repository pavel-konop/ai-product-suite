'use client';

import { useState, useEffect } from 'react';
import { Settings, Key, Database, Save } from 'lucide-react';

export default function SettingsPage() {
  const [claudeKey, setClaudeKey] = useState('');
  const [groqKey, setGroqKey] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Load from localStorage for demo (in production, use env vars)
    setClaudeKey(localStorage.getItem('claude_key') || '');
    setGroqKey(localStorage.getItem('groq_key') || '');
  }, []);

  const saveSettings = () => {
    localStorage.setItem('claude_key', claudeKey);
    localStorage.setItem('groq_key', groqKey);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Settings className="text-slate-400" />
        Settings
      </h1>

      <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800 space-y-6">
        <div>
          <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
            <Key size={18} />
            API Keys
          </h2>
          <p className="text-slate-400 text-sm mb-4">
            For demo purposes, keys are stored in browser. In production, use environment variables.
          </p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Anthropic API Key (Claude)
              </label>
              <input
                type="password"
                value={claudeKey}
                onChange={(e) => setClaudeKey(e.target.value)}
                placeholder="sk-ant-..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Groq API Key
              </label>
              <input
                type="password"
                value={groqKey}
                onChange={(e) => setGroqKey(e.target.value)}
                placeholder="gsk_..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800">
          <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
            <Database size={18} />
            Database
          </h2>
          <p className="text-slate-400 text-sm">
            SQLite database is stored locally at <code className="bg-slate-800 px-1 rounded">prisma/dev.db</code>
          </p>
        </div>

        <button
          onClick={saveSettings}
          className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
        >
          <Save size={18} />
          {saved ? 'Saved!' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}