'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { FileText, ArrowRight, Clock, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function HistoryPage() {
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const res = await fetch('/api/history');
            const data = await res.json();
            setProjects(data);
        } catch (error) {
            console.error('Failed to fetch history:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Clock className="text-blue-400" />
                    Project History
                </h1>
                <span className="text-slate-400 text-sm">{projects.length} projects</span>
            </div>

            {projects.length === 0 ? (
                <div className="text-center py-12 bg-slate-900/50 rounded-xl border border-slate-800">
                    <FileText className="mx-auto h-12 w-12 text-slate-600 mb-4" />
                    <p className="text-slate-400">No projects yet. Start by analyzing a brief!</p>
                    <Link
                        href="/analyzer"
                        className="inline-flex items-center gap-2 mt-4 text-blue-400 hover:text-blue-300"
                    >
                        Go to Analyzer <ArrowRight size={16} />
                    </Link>
                </div>
            ) : (
                <div className="grid gap-4">
                    {projects.map((project) => (
                        <div
                            key={project.id}
                            className="bg-slate-900/50 rounded-xl p-6 border border-slate-800 hover:border-slate-700 transition-colors"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h2 className="text-lg font-semibold text-white">{project.title}</h2>
                                        <span className={`px-2 py-0.5 rounded text-xs ${project.type === 'requirements'
                                                ? 'bg-blue-900/50 text-blue-400'
                                                : 'bg-purple-900/50 text-purple-400'
                                            }`}>
                                            {project.type}
                                        </span>
                                    </div>
                                    <p className="text-slate-400 text-sm flex items-center gap-2">
                                        <Clock size={14} />
                                        {format(new Date(project.createdAt), 'MMM d, yyyy HH:mm')}
                                        <span className="text-slate-600">•</span>
                                        <Sparkles size={14} />
                                        {project.modelUsed}
                                    </p>
                                </div>
                                <Link
                                    href={project.type === 'landing' ? `/landing-builder?id=${project.id}` : `/analyzer?id=${project.id}`}
                                    className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm"
                                >
                                    View <ArrowRight size={16} />
                                </Link>
                            </div>

                            <p className="text-slate-300 text-sm line-clamp-2">
                                {project.input.substring(0, 150)}...
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}