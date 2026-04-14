'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Search, Trash2, RefreshCcw, ChevronDown, ChevronUp, Clock, Globe, List, Database, ShieldCheck, Zap } from 'lucide-react';
import { ApiLogEntry } from '../types';

interface DashboardProps {
    endpoint?: string;
    title?: string;
}

export const Dashboard: React.FC<DashboardProps> = ({
    endpoint = '/api/debug-logs',
    title = 'API Telescope'
}) => {
    const [mounted, setMounted] = useState(false);
    const [logs, setLogs] = useState<ApiLogEntry[]>([]);
    const [search, setSearch] = useState('');
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const fetchLogs = async () => {
        if (isPaused) return;
        try {
            const res = await fetch(endpoint);
            if (!res.ok) return;
            const data = await res.json();
            setLogs(data);
        } catch (e) {
        }
    };

    useEffect(() => {
        if (!mounted) return;
        fetchLogs();
        const interval = setInterval(fetchLogs, 3000);
        return () => clearInterval(interval);
    }, [isPaused, endpoint, mounted]);

    const filteredLogs = logs.filter(log =>
        log.url.toLowerCase().includes(search.toLowerCase()) ||
        log.method.toLowerCase().includes(search.toLowerCase()) ||
        log.status.toString().includes(search) ||
        log.source?.toLowerCase().includes(search.toLowerCase())
    );

    const clearLogs = async () => {
        try {
            await fetch(endpoint, { method: 'DELETE' });
            setLogs([]);
        } catch (e) {
            setLogs([]); // Fallback to local clear
        }
    };

    const getStatusColor = (status: number) => {
        if (status >= 200 && status < 300) return 'text-green-500 bg-green-500/10 border-green-500/20';
        if (status >= 400) return 'text-red-500 bg-red-500/10 border-red-500/20';
        return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
    };

    const getSourceIcon = (source?: string) => {
        switch (source) {
            case 'MW': return <Zap size={14} className="text-yellow-500" />;
            case 'API': return <ShieldCheck size={14} className="text-blue-500" />;
            case 'BACKEND': return <Database size={14} className="text-purple-500" />;
            default: return <Globe size={14} className="text-gray-500" />;
        }
    };

    const getSourceLabel = (source?: string) => {
        switch (source) {
            case 'MW': return 'Navigation';
            case 'API': return 'Internal API';
            case 'BACKEND': return 'Backend API';
            default: return 'Request';
        }
    };

    const formatJson = (jsonStr?: string) => {
        if (!jsonStr) return 'No data';
        try {
            const obj = typeof jsonStr === 'string' ? JSON.parse(jsonStr) : jsonStr;
            return JSON.stringify(obj, null, 2);
        } catch {
            return jsonStr;
        }
    };

    if (!mounted) {
        return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-gray-500 font-mono">Initializing Telescope...</div>;
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-gray-300 p-6 font-mono selection:bg-blue-500 selection:text-white">
            <header className="max-w-6xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg text-blue-500">
                        <Terminal size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">{title}</h1>
                        <p className="text-sm text-gray-500">Live request inspector • {logs.length} logs stored</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input
                            type="text"
                            placeholder="Filter by URL..."
                            className="pl-10 pr-4 py-2 bg-[#1a1a1a] border border-gray-800 rounded-lg focus:outline-none focus:border-blue-500 w-64 text-sm transition-all text-gray-300"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => setIsPaused(!isPaused)}
                        className={`p-2 rounded-lg border transition-all ${isPaused ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500' : 'bg-gray-800 border-gray-700 hover:bg-gray-700'}`}
                    >
                        <RefreshCcw size={18} className={isPaused ? "" : "animate-spin"} style={{ animationDuration: '4s' }} />
                    </button>
                    <button
                        onClick={clearLogs}
                        className="p-2 bg-red-500/10 border border-red-500/30 text-red-500 rounded-lg hover:bg-red-500/20 transition-all"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </header>

            <main className="max-w-6xl mx-auto">
                <div className="bg-[#141414] border border-gray-800 rounded-xl overflow-hidden shadow-2xl">
                    <div className="grid grid-cols-[80px_100px_1fr_80px_100px_40px] gap-4 px-6 py-3 bg-[#1a1a1a] border-b border-gray-800 text-xs font-bold text-gray-500 uppercase tracking-widest leading-none items-center">
                        <span>Method</span>
                        <span>Source</span>
                        <span>Route / URL</span>
                        <span>Status</span>
                        <span>Duration</span>
                        <span></span>
                    </div>

                    <div className="divide-y divide-gray-800">
                        {filteredLogs.length === 0 ? (
                            <div className="py-20 text-center">
                                <List className="mx-auto mb-4 text-gray-700" size={48} />
                                <p className="text-gray-500 italic text-sm">No activity detected yet...</p>
                            </div>
                        ) : (
                            <AnimatePresence initial={false}>
                                {filteredLogs.map((log) => (
                                    <motion.div
                                        key={log.id}
                                        layout
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                    >
                                        <div
                                            onClick={() => setExpandedId(expandedId === log.id ? null : log.id)}
                                            className="grid grid-cols-[80px_100px_1fr_80px_100px_40px] gap-4 px-6 py-4 items-center hover:bg-[#1a1a1a] cursor-pointer"
                                        >
                                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded inline-block text-center border leading-none ${log.method === 'GET' ? 'text-blue-400 bg-blue-400/10 border-blue-400/20' :
                                                    log.method === 'POST' ? 'text-green-400 bg-green-400/10 border-green-400/20' :
                                                        'text-purple-400 bg-purple-400/10 border-purple-400/20'
                                                }`}>
                                                {log.method}
                                            </span>

                                            <div className="flex items-center gap-1.5 overflow-hidden">
                                                {getSourceIcon(log.source)}
                                                <span className="text-[10px] uppercase font-bold text-gray-500 whitespace-nowrap">{getSourceLabel(log.source)}</span>
                                            </div>

                                            <div className="flex items-center gap-2 overflow-hidden text-sm truncate text-gray-300">
                                                {log.url}
                                            </div>

                                            <div>
                                                <span className={`text-[10px] px-1.5 py-0.5 rounded border leading-none ${getStatusColor(log.status)}`}>
                                                    {log.status}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                                <Clock size={12} />
                                                <span className={log.duration > 800 ? 'text-red-400' : 'text-gray-500'}>
                                                    {log.duration}ms
                                                </span>
                                            </div>

                                            <div className="text-gray-600 text-right">
                                                {expandedId === log.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                            </div>
                                        </div>

                                        <AnimatePresence>
                                            {expandedId === log.id && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden bg-[#0d0d0d] border-t border-gray-800"
                                                >
                                                    <div className="p-6">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                            <div>
                                                                <h4 className="text-[10px] font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">Full URL</h4>
                                                                <div className="p-3 bg-black/40 border border-gray-800 rounded-lg text-xs break-all text-blue-300 leading-relaxed font-mono">
                                                                    {log.url}
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <h4 className="text-[10px] font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">Metadata</h4>
                                                                <div className="grid grid-cols-2 gap-4 text-xs">
                                                                    <div className="p-3 bg-black/40 border border-gray-800 rounded-lg">
                                                                        <span className="block text-[10px] text-gray-600 uppercase mb-1">Status Code</span>
                                                                        <span className={`font-bold text-sm ${log.status >= 400 ? 'text-red-400' : 'text-green-400'}`}>{log.status}</span>
                                                                    </div>
                                                                    <div className="p-3 bg-black/40 border border-gray-800 rounded-lg">
                                                                        <span className="block text-[10px] text-gray-600 uppercase mb-1">Time</span>
                                                                        <span className="font-bold text-sm text-gray-400">{new Date(log.timestamp).toLocaleTimeString()}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-[11px]">
                                                            <div>
                                                                <h4 className="text-[10px] font-bold text-gray-500 uppercase mb-3 text-purple-500">Request Body</h4>
                                                                <pre className="p-4 bg-black/40 border border-gray-800 rounded-lg overflow-x-auto text-purple-300 max-h-[300px] overflow-y-auto font-mono scrollbar-thin scrollbar-thumb-gray-800">
                                                                    {formatJson(log.requestBody)}
                                                                </pre>
                                                            </div>
                                                            <div>
                                                                <h4 className="text-[10px] font-bold text-gray-500 uppercase mb-3 text-orange-500">Response Body</h4>
                                                                <pre className="p-4 bg-black/40 border border-gray-800 rounded-lg overflow-x-auto text-orange-300 max-h-[300px] overflow-y-auto font-mono scrollbar-thin scrollbar-thumb-gray-800">
                                                                    {formatJson(log.responseBody)}
                                                                </pre>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};
