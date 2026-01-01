
import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Send, Cpu, Zap, Activity } from 'lucide-react';
import { processGenerativeCommand } from '../services/geminiService';

const GenerativeUIEngine: React.FC = () => {
  const [history, setHistory] = useState<Array<{ type: 'cmd' | 'resp'; text: string }>>([
    { type: 'resp', text: 'LinkZ Generative UI Engine v2.4 initialized. Gresham Protocol Active.' },
    { type: 'resp', text: 'Type "help" to see available protocol commands.' }
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const userCmd = input;
    setHistory(prev => [...prev, { type: 'cmd', text: userCmd }]);
    setInput('');
    setIsProcessing(true);

    try {
      const result = await processGenerativeCommand(userCmd);
      setHistory(prev => [...prev, { type: 'resp', text: result }]);
    } catch (err) {
      setHistory(prev => [...prev, { type: 'resp', text: 'Error: Protocol communication interrupted.' }]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] glass-card rounded-3xl overflow-hidden border border-indigo-500/20 shadow-2xl shadow-indigo-900/20">
      <div className="bg-slate-900/80 px-6 py-3 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-red-500/50" />
          <div className="w-3 h-3 rounded-full bg-amber-500/50" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
          <span className="ml-4 text-xs font-mono text-slate-500 uppercase tracking-widest">Gresham Protocol CLI</span>
        </div>
        <div className="flex items-center gap-4 text-xs text-indigo-400 font-mono">
          <span className="flex items-center gap-1"><Activity size={12}/> CPU: 12%</span>
          <span className="flex items-center gap-1"><Zap size={12}/> MCP: ONLINE</span>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 p-6 font-mono text-sm overflow-y-auto space-y-4 scrollbar-hide bg-slate-950/40">
        {history.map((entry, i) => (
          <div key={i} className={`${entry.type === 'cmd' ? 'text-indigo-300' : 'text-slate-300'} whitespace-pre-wrap leading-relaxed`}>
            {entry.type === 'cmd' ? (
              <span className="flex items-start gap-2">
                <span className="text-emerald-500">gresham-cli $</span> {entry.text}
              </span>
            ) : (
              <div className="pl-6 border-l border-white/5 py-1">
                {entry.text}
              </div>
            )}
          </div>
        ))}
        {isProcessing && (
          <div className="flex items-center gap-2 text-indigo-400 pl-6 animate-pulse">
            <Cpu size={14} className="animate-spin" />
            <span>AI Reasoning in progress...</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 bg-slate-900/50 border-t border-white/5 flex gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Deploy service, check logs, or request analysis..."
          className="flex-1 bg-transparent border-none outline-none text-indigo-100 placeholder:text-slate-600 font-mono"
        />
        <button 
          disabled={isProcessing}
          type="submit"
          className="p-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors disabled:opacity-50"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default GenerativeUIEngine;
