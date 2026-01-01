
import React, { useState, useEffect, useRef } from 'react';
import { 
  Music, 
  Upload, 
  Globe, 
  ChevronRight, 
  ShieldCheck, 
  BarChart3, 
  UserPlus, 
  Database, 
  CheckCircle2, 
  CreditCard,
  Plus,
  Info,
  Layers,
  Sparkles,
  Command,
  LayoutDashboard,
  BrainCircuit,
  Settings,
  Zap,
  Cpu,
  Hash,
  Fingerprint,
  Mic,
  MessageSquare,
  X,
  Send,
  Search,
  ExternalLink
} from 'lucide-react';
import { Metadata, ViewState } from './types';
import StatCard from './components/StatCard';
import GenerativeUIEngine from './components/GenerativeUIEngine';
import { 
  suggestMetadata, 
  getRadarInsights, 
  transcribeAudio, 
  performMarketSearch, 
  createAssistantChat 
} from './services/geminiService';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('landing');
  const [onboardStep, setOnboardStep] = useState(0);
  const [aiLoading, setAiLoading] = useState(false);
  const [radarInsights, setRadarInsights] = useState<any[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [marketSearchQuery, setMarketSearchQuery] = useState('');
  const [marketSearchResult, setMarketSearchResult] = useState<{text: string, sources: any[]} | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  
  const [metadata, setMetadata] = useState<Metadata>({
    title: '',
    artist: '',
    genre: 'Electronic',
    isrc: '',
    upc: '',
    contributors: [{ name: '', role: 'Producer', share: 100 }],
    aiAssisted: true,
    spatialAudio: true
  });

  const nextOnboard = () => setOnboardStep(s => s + 1);
  
  const handleAISuggestions = async () => {
    if (!metadata.artist) return;
    setAiLoading(true);
    try {
      const suggestions = await suggestMetadata(metadata.artist, metadata.genre);
      setMetadata(prev => ({
        ...prev,
        title: suggestions.suggestedTitles[0],
        bpm: suggestions.bpm,
        mood: suggestions.moods.join(', ')
      }));
    } finally {
      setAiLoading(false);
    }
  };

  const handleMarketSearch = async () => {
    if (!marketSearchQuery.trim()) return;
    setSearchLoading(true);
    try {
      const result = await performMarketSearch(marketSearchQuery);
      setMarketSearchResult(result);
    } finally {
      setSearchLoading(false);
    }
  };

  const fetchInsights = async () => {
    const insights = await getRadarInsights(metadata);
    setRadarInsights(insights);
  };

  useEffect(() => {
    if (view === 'dashboard' && metadata.artist) {
      fetchInsights();
    }
  }, [view]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-indigo-500/30">
      {/* Navigation */}
      {view !== 'landing' && (
        <nav className="fixed left-0 top-0 bottom-0 w-20 flex flex-col items-center py-8 glass-card border-r border-white/5 z-50">
          <div className="p-3 bg-indigo-600 rounded-2xl mb-12 shadow-lg shadow-indigo-600/30">
            <Layers size={24} />
          </div>
          <div className="flex flex-col gap-8">
            <button onClick={() => setView('dashboard')} className={`p-3 rounded-xl transition-all ${view === 'dashboard' ? 'text-indigo-400 bg-white/5' : 'text-slate-500 hover:text-indigo-300'}`}>
              <LayoutDashboard size={24} />
            </button>
            <button onClick={() => setView('generative-engine')} className={`p-3 rounded-xl transition-all ${view === 'generative-engine' ? 'text-indigo-400 bg-white/5' : 'text-slate-500 hover:text-indigo-300'}`}>
              <Command size={24} />
            </button>
            <button className="p-3 rounded-xl text-slate-500 hover:text-indigo-300 transition-all">
              <BrainCircuit size={24} />
            </button>
            <button className="p-3 rounded-xl text-slate-500 hover:text-indigo-300 transition-all">
              <Settings size={24} />
            </button>
          </div>
        </nav>
      )}

      <main className={`${view !== 'landing' ? 'pl-20' : ''}`}>
        {view === 'landing' && <LandingView onStart={() => setView('onboarding')} />}
        
        {view === 'onboarding' && (
          <OnboardingFlow 
            currentStep={onboardStep} 
            onNext={nextOnboard} 
            onBack={() => setOnboardStep(s => s - 1)}
            onComplete={() => setView('dashboard')}
            metadata={metadata}
            setMetadata={setMetadata}
            onAiSuggest={handleAISuggestions}
            aiLoading={aiLoading}
          />
        )}

        {view === 'dashboard' && (
          <div className="max-w-7xl mx-auto px-8 py-12 animate-in fade-in duration-700 pb-32">
            <header className="flex flex-col gap-4 mb-12 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-4xl font-extrabold tracking-tight mb-2">
                  Welcome back, <span className="gradient-text">{metadata.artist || 'Artist'}</span>
                </h1>
                <p className="text-slate-400 flex items-center gap-2">
                  <ShieldCheck size={16} className="text-indigo-400"/> Gresham Protocol Active: Deployment Secure
                </p>
              </div>
              <div className="flex gap-4">
                <div className="flex flex-col items-end">
                   <p className="text-xs text-slate-500 font-mono">IAED IGNITION CARD</p>
                   <p className="text-xl font-bold font-mono">$1,240.00</p>
                </div>
                <button onClick={() => setOnboardStep(0) || setView('onboarding')} className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-bold transition-all hover:scale-105">
                  <Plus size={20} /> New Mission
                </button>
              </div>
            </header>

            <div className="grid gap-8 mb-12 md:grid-cols-4">
              <StatCard title="Total Equity Generated" value="$12.4k" delta="+24%" icon={BarChart3} color="text-emerald-400" />
              <StatCard title="Global Syndication" value="184" delta="Live" icon={Globe} color="text-indigo-400" />
              <StatCard title="Synergistic Lift" value="+18%" delta="Active" icon={Sparkles} color="text-cyan-400" />
              <StatCard title="Protocol Health" value="99.9%" delta="Stable" icon={Database} color="text-purple-400" />
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-8">
                {/* Market Intelligence Search (Grounded) */}
                <div className="glass-card p-8 rounded-3xl border border-indigo-500/20 bg-indigo-500/5">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold flex items-center gap-2"><Globe size={20} className="text-indigo-400" /> Market Intelligence</h3>
                      <p className="text-xs text-slate-400">Search global music trends using Gresham Protocol Grounding</p>
                    </div>
                  </div>
                  <div className="flex gap-3 mb-6">
                    <input 
                      value={marketSearchQuery}
                      onChange={(e) => setMarketSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleMarketSearch()}
                      placeholder="e.g. Current independent artist sync trends in 2024"
                      className="flex-1 p-4 bg-slate-900 border border-white/5 rounded-2xl text-sm outline-none focus:border-indigo-500 transition-all"
                    />
                    <button 
                      onClick={handleMarketSearch}
                      disabled={searchLoading}
                      className="p-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl transition-all disabled:opacity-50"
                    >
                      {searchLoading ? <Cpu className="animate-spin" size={20} /> : <Search size={20} />}
                    </button>
                  </div>
                  {marketSearchResult && (
                    <div className="p-6 bg-slate-950/50 rounded-2xl border border-white/5 animate-in fade-in slide-in-from-top-2">
                      <p className="text-sm text-slate-300 leading-relaxed mb-4 whitespace-pre-wrap">{marketSearchResult.text}</p>
                      {marketSearchResult.sources.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {marketSearchResult.sources.map((src: any, i: number) => (
                            <a 
                              key={i} 
                              href={src.web?.uri} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-3 py-1 bg-white/5 border border-white/5 rounded-full text-[10px] text-indigo-300 hover:bg-white/10 transition-all"
                            >
                              <ExternalLink size={10} /> {src.web?.title || 'Source'}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="glass-card p-8 rounded-3xl border border-white/5">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-bold">Synergistic Opportunity Radar</h3>
                    <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full text-xs font-bold border border-indigo-500/20">Live Analysis</span>
                  </div>
                  <div className="space-y-4">
                    {radarInsights.length > 0 ? radarInsights.map((insight, idx) => (
                      <div key={idx} className="p-5 rounded-2xl bg-white/5 border border-white/5 flex items-start gap-4 hover:bg-white/10 transition-all cursor-pointer">
                        <div className="p-3 bg-indigo-600/20 rounded-xl text-indigo-400">
                          <Zap size={20} />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <h4 className="font-bold text-indigo-100">{insight.opportunityName}</h4>
                            <span className="text-xs font-mono text-emerald-400">{Math.round(insight.confidence * 100)}% Match</span>
                          </div>
                          <p className="text-sm text-slate-400 mb-3">{insight.reasoning}</p>
                          <div className="flex gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-white/5 rounded-md border border-white/5 text-slate-500">Action: {insight.action}</span>
                          </div>
                        </div>
                        <ChevronRight className="text-slate-600 mt-1" size={20} />
                      </div>
                    )) : (
                      <div className="text-center py-12 text-slate-500 italic">
                        Initializing Synergistic Opportunity Radar...
                      </div>
                    )}
                  </div>
                </div>

                <div className="glass-card p-8 rounded-3xl">
                   <h3 className="text-xl font-bold mb-6">Active Deployments</h3>
                   <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="text-[10px] uppercase tracking-[0.2em] text-slate-500 bg-white/5">
                        <tr>
                          <th className="p-4 rounded-l-xl">Service ID</th>
                          <th className="p-4">Status</th>
                          <th className="p-4">Latency</th>
                          <th className="p-4 text-right rounded-r-xl">Endpoint</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        <tr className="hover:bg-white/5 transition-colors group">
                          <td className="p-4 font-mono text-sm">linkz-core-prod-01</td>
                          <td className="p-4">
                            <span className="flex items-center gap-2 text-xs text-emerald-400">
                              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Healthy
                            </span>
                          </td>
                          <td className="p-4 font-mono text-xs text-slate-400">14ms</td>
                          <td className="p-4 text-right">
                            <button className="text-indigo-400 text-xs font-bold hover:underline">Launch URL</button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                   </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="glass-card p-8 rounded-3xl bg-gradient-to-br from-indigo-900/20 to-transparent border border-indigo-500/20">
                  <div className="flex items-center gap-3 mb-6">
                    <BrainCircuit className="text-indigo-400" />
                    <h3 className="text-xl font-bold">Metadata Quality</h3>
                  </div>
                  <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-200">
                          Fidelity Index
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold inline-block text-indigo-400">
                          92%
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-3 mb-4 text-xs flex rounded-full bg-slate-800">
                      <div style={{ width: "92%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500 transition-all duration-1000"></div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Your current metadata meets the <span className="text-indigo-300">Gresham Gold Standard</span>. Higher fidelity increases distribution weight by 14%.
                  </p>
                </div>
                
                <div className="glass-card p-8 rounded-3xl border border-white/5">
                  <h4 className="font-bold text-sm uppercase tracking-widest text-slate-500 mb-6">Syndicated Partners</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {['Spotify', 'Apple', 'Tidal', 'Amazon', 'Tiktok', 'Peloton'].map(p => (
                      <div key={p} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-xs font-bold text-slate-300 group hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all">
                        {p}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {view === 'generative-engine' && (
          <div className="max-w-5xl mx-auto px-8 py-12">
            <div className="flex items-center justify-between mb-8">
               <div>
                  <h1 className="text-3xl font-bold mb-2">Generative UI Engine</h1>
                  <p className="text-slate-400">Autonomous strategic execution via Gresham Protocol MCP</p>
               </div>
               <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center gap-4">
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] text-slate-500 uppercase">Current Project</span>
                    <span className="text-sm font-mono font-bold">studio-1562661932</span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
                    <Layers size={20} />
                  </div>
               </div>
            </div>
            <GenerativeUIEngine />
            
            <div className="mt-12 grid gap-6 md:grid-cols-2">
               <div className="glass-card p-6 rounded-3xl">
                  <h4 className="font-bold mb-4 flex items-center gap-2"><Cpu size={18} className="text-indigo-400"/> Recent Executions</h4>
                  <div className="space-y-3">
                    {[
                      { cmd: 'deploy --service linkz-core', status: 'Success', time: '12m ago' },
                      { cmd: 'status --env prod', status: 'Success', time: '1h ago' },
                      { cmd: 'logs --tail 100', status: 'Viewed', time: '3h ago' }
                    ].map((ex, i) => (
                      <div key={i} className="flex justify-between items-center text-xs p-3 bg-white/5 rounded-xl">
                        <span className="font-mono text-slate-400">{ex.cmd}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-emerald-400 font-bold">{ex.status}</span>
                          <span className="text-slate-600">{ex.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
               </div>
               <div className="glass-card p-6 rounded-3xl bg-indigo-600/5 border-indigo-500/10">
                  <h4 className="font-bold mb-4 flex items-center gap-2 text-indigo-300"><Info size={18} /> Documentation Note</h4>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    The Generative UI Engine uses direct MCP calls to manage infrastructure. Use natural language commands like "deploy the latest revision to us-central1" or "analyze my sync potential".
                  </p>
                  <button className="text-xs font-bold text-indigo-400 hover:underline">View MCP Server Specification &rarr;</button>
               </div>
            </div>
          </div>
        )}
      </main>

      {/* Floating ChatBot */}
      <ChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} onOpen={() => setIsChatOpen(true)} />
    </div>
  );
};

/* --- UI Sub-Components --- */

const ChatBot: React.FC<{ isOpen: boolean; onClose: () => void; onOpen: () => void }> = ({ isOpen, onClose, onOpen }) => {
  const [messages, setMessages] = useState<Array<{role: 'user' | 'bot', text: string}>>([
    { role: 'bot', text: "Hello! I'm your LinkZ Assistant. How can I help you with the Gresham Protocol today?" }
  ]);
  const [input, setInput