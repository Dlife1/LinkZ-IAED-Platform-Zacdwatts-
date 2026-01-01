
import React, { useState, useEffect } from 'react';
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
  // Fix: Adding missing icon imports used in the dashboard and generative engine views.
  Zap,
  Cpu
} from 'lucide-react';
import { Metadata, ViewState } from './types';
import StatCard from './components/StatCard';
import GenerativeUIEngine from './components/GenerativeUIEngine';
import { suggestMetadata, getRadarInsights } from './services/geminiService';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('landing');
  const [onboardStep, setOnboardStep] = useState(0);
  const [aiLoading, setAiLoading] = useState(false);
  const [radarInsights, setRadarInsights] = useState<any[]>([]);
  
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
          <div className="max-w-7xl mx-auto px-8 py-12 animate-in fade-in duration-700">
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
                <button onClick={() => setView('onboarding')} className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-bold transition-all hover:scale-105">
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
    </div>
  );
};

/* --- Sub-Components --- */

const LandingView: React.FC<{ onStart: () => void }> = ({ onStart }) => (
  <div className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center overflow-hidden">
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[160px] -z-10 animate-pulse" />
    <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-cyan-600/10 rounded-full blur-[120px] -z-10" />
    
    <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 text-xs font-bold border rounded-full bg-white/5 border-white/10 text-indigo-300 backdrop-blur-md tracking-widest uppercase">
      <Sparkles size={14} className="animate-spin-slow" />
      <span>AI-Native Equity Engine</span>
    </div>
    
    <h1 className="max-w-4xl mb-8 text-6xl font-black tracking-tighter md:text-8xl leading-[0.9]">
      Distribute your <br/>
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">Sonic Identity</span>
    </h1>
    
    <p className="max-w-2xl mb-12 text-lg md:text-xl text-slate-400 font-medium leading-relaxed">
      Gresham Protocol is the world's first metadata-first distribution engine. 
      Move from 90-day pay cycles to real-time spending with IAED.
    </p>
    
    <div className="flex flex-col sm:flex-row gap-6">
      <button 
        onClick={onStart}
        className="flex items-center gap-3 px-10 py-5 text-lg font-bold transition-all rounded-3xl bg-indigo-600 hover:bg-indigo-500 hover:scale-105 active:scale-95 shadow-[0_0_60px_rgba(79,70,229,0.4)]"
      >
        Ignite Deployment <ChevronRight size={24} />
      </button>
      <button className="px-10 py-5 text-lg font-bold border border-white/10 rounded-3xl hover:bg-white/5 transition-all">
        Gresham Protocol Docs
      </button>
    </div>

    <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-40 grayscale">
      {['Apple Music', 'Spotify', 'Tidal', 'Amazon'].map(p => (
        <span key={p} className="text-xl font-bold tracking-widest uppercase">{p}</span>
      ))}
    </div>
  </div>
);

const OnboardingFlow: React.FC<{ 
  currentStep: number; 
  onNext: () => void; 
  onBack: () => void;
  onComplete: () => void; 
  metadata: Metadata; 
  setMetadata: (m: Metadata) => void;
  onAiSuggest: () => void;
  aiLoading: boolean;
}> = ({ currentStep, onNext, onBack, onComplete, metadata, setMetadata, onAiSuggest, aiLoading }) => {
  const steps = [
    { title: 'Identity', icon: UserPlus },
    { title: 'Sonic Asset', icon: Music },
    { title: 'Fidelity', icon: Database },
    { title: 'Deployment', icon: ShieldCheck }
  ];

  const handleAddContributor = () => {
    setMetadata({
      ...metadata,
      contributors: [...metadata.contributors, { name: '', role: 'Writer', share: 0 }]
    });
  };

  return (
    <div className="max-w-3xl px-6 py-20 mx-auto">
      <div className="flex items-center justify-between mb-16 px-4">
        {steps.map((s, i) => (
          <div key={i} className="flex flex-col items-center gap-3 relative z-10">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${i <= currentStep ? 'bg-indigo-600 shadow-lg shadow-indigo-600/30' : 'bg-slate-800'}`}>
              <s.icon size={24} />
            </div>
            <span className={`text-[10px] uppercase font-bold tracking-widest ${i <= currentStep ? 'text-indigo-400' : 'text-slate-500'}`}>{s.title}</span>
          </div>
        ))}
        {/* Progress Line */}
        <div className="absolute top-[108px] left-[calc(50%-180px)] right-[calc(50%-180px)] h-[2px] bg-slate-800 -z-0" />
      </div>

      <div className="glass-card p-10 rounded-[40px] shadow-2xl animate-in zoom-in-95 duration-500">
        {currentStep === 0 && (
          <div className="space-y-8">
            <div className="flex justify-between items-end">
               <div>
                  <h2 className="text-3xl font-black mb-2">Define Your Identity</h2>
                  <p className="text-slate-400">The primary metadata entry point for global syndication.</p>
               </div>
               <button 
                  onClick={onAiSuggest} 
                  disabled={!metadata.artist || aiLoading}
                  className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl hover:bg-indigo-500/20 transition-all disabled:opacity-30 flex items-center gap-2 text-xs font-bold"
                >
                  <Sparkles size={16} className={aiLoading ? 'animate-spin' : ''} /> AI Suggest
                </button>
            </div>
            <div className="grid gap-6">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-bold text-slate-500 ml-1">Artist Legal Name / Moniker</label>
                <input 
                  className="w-full p-5 text-xl transition-all border outline-none bg-slate-950/50 border-white/5 rounded-2xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  placeholder="e.g. Neon Horizon"
                  value={metadata.artist}
                  onChange={(e) => setMetadata({...metadata, artist: e.target.value})}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest font-bold text-slate-500 ml-1">Genre</label>
                    <select 
                      className="w-full p-5 transition-all border outline-none bg-slate-950/50 border-white/5 rounded-2xl focus:border-indigo-500"
                      value={metadata.genre}
                      onChange={(e) => setMetadata({...metadata, genre: e.target.value})}
                    >
                      <option>Electronic</option>
                      <option>Lo-fi</option>
                      <option>Cinematic</option>
                      <option>Phonk</option>
                      <option>Techno</option>
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest font-bold text-slate-500 ml-1">Release Title</label>
                    <input 
                      className="w-full p-5 transition-all border outline-none bg-slate-950/50 border-white/5 rounded-2xl focus:border-indigo-500"
                      placeholder="e.g. Midnight Protocol"
                      value={metadata.title}
                      onChange={(e) => setMetadata({...metadata, title: e.target.value})}
                    />
                 </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-8">
            <h2 className="text-3xl font-black">Upload Master Asset</h2>
            <div className="group flex flex-col items-center justify-center w-full p-16 border-2 border-dashed rounded-[32px] border-white/10 bg-white/5 hover:bg-white/10 transition-all cursor-pointer hover:border-indigo-500/50">
              <div className="p-6 bg-indigo-600/10 rounded-full text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
                <Upload size={48} />
              </div>
              <p className="text-xl font-bold mb-2">Drop High-Fidelity Source</p>
              <p className="text-sm text-slate-500">WAV (24-bit) or FLAC required for Gresham Certification</p>
            </div>
            
            <div className="grid gap-4">
              <div className={`p-5 border rounded-2xl transition-all cursor-pointer flex items-center justify-between ${metadata.spatialAudio ? 'border-indigo-500 bg-indigo-500/5' : 'border-white/5 bg-slate-950/30'}`} onClick={() => setMetadata({...metadata, spatialAudio: !metadata.spatialAudio})}>
                 <div className="flex items-center gap-4">
                   <div className={`p-2 rounded-lg ${metadata.spatialAudio ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-500'}`}>
                      <Sparkles size={18} />
                   </div>
                   <div>
                      <p className="font-bold text-sm">Spatial Audio (Dolby Atmos)</p>
                      <p className="text-xs text-slate-500">Enhanced immersive metadata layer</p>
                   </div>
                 </div>
                 <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${metadata.spatialAudio ? 'border-indigo-500 bg-indigo-500' : 'border-slate-700'}`}>
                    {metadata.spatialAudio && <CheckCircle2 size={14} />}
                 </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-black gradient-text">Smart Attribution</h2>
              <button onClick={handleAddContributor} className="p-3 bg-white/5 hover:bg-white/10 text-indigo-400 rounded-full transition-all">
                <Plus size={24} />
              </button>
            </div>
            <div className="space-y-4">
              {metadata.contributors.map((c, i) => (
                <div key={i} className="flex gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="flex-1 space-y-2">
                    <input 
                      className="w-full p-4 text-sm border outline-none bg-slate-950/50 border-white/5 rounded-xl focus:border-indigo-500"
                      placeholder="Collaborator Name"
                      value={c.name}
                      onChange={(e) => {
                        const newC = [...metadata.contributors];
                        newC[i].name = e.target.value;
                        setMetadata({...metadata, contributors: newC});
                      }}
                    />
                  </div>
                  <div className="w-40 space-y-2">
                    <select 
                      className="w-full p-4 text-sm border outline-none bg-slate-950/50 border-white/5 rounded-xl focus:border-indigo-500"
                      value={c.role}
                      onChange={(e) => {
                        const newC = [...metadata.contributors];
                        newC[i].role = e.target.value;
                        setMetadata({...metadata, contributors: newC});
                      }}
                    >
                      <option>Producer</option>
                      <option>Writer</option>
                      <option>Vocalist</option>
                      <option>Engineer</option>
                    </select>
                  </div>
                  <div className="w-24 space-y-2">
                    <input 
                      className="w-full p-4 text-sm border outline-none bg-slate-950/50 border-white/5 rounded-xl focus:border-indigo-500 text-center font-bold"
                      placeholder="%"
                      value={c.share}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="p-6 rounded-3xl bg-indigo-500/5 border border-indigo-500/10 text-sm text-indigo-300 leading-relaxed flex gap-4">
              <Info size={24} className="shrink-0" />
              <p>
                LinkZ uses <strong>Dynamic Smart Contracts</strong>. This metadata ensures all equity is distributed instantly upon stream settlement via the AP2 FinTech Protocol.
              </p>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-8 text-center">
            <div className="flex justify-center">
               <div className="p-6 bg-emerald-500/20 rounded-full text-emerald-400 animate-pulse">
                <ShieldCheck size={64} />
               </div>
            </div>
            <h2 className="text-4xl font-black">Certification Complete</h2>
            <div className="p-8 text-left border rounded-[32px] bg-white/5 border-white/10 space-y-4">
               <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Protocol Summary</p>
               <div className="grid grid-cols-2 gap-y-4">
                  <div className="text-slate-400">Project Moniker</div>
                  <div className="font-mono text-indigo-400 text-right font-bold">{metadata.artist || 'NULL'}</div>
                  
                  <div className="text-slate-400">Release Title</div>
                  <div className="font-mono text-indigo-400 text-right font-bold">{metadata.title || 'NULL'}</div>
                  
                  <div className="text-slate-400">Fidelity Layer</div>
                  <div className="font-mono text-indigo-400 text-right font-bold">Gresham Level 4</div>
                  
                  <div className="text-slate-400">Spatial Encoding</div>
                  <div className="font-mono text-emerald-400 text-right font-bold">{metadata.spatialAudio ? 'ENABLED' : 'DISABLED'}</div>
               </div>
            </div>
            <p className="text-sm text-slate-500 italic">"Deploying this release creates a permanent entry in the Global Credits Database (GCD)."</p>
          </div>
        )}

        <div className="flex gap-6 mt-12">
          {currentStep > 0 && (
            <button 
              onClick={onBack}
              className="px-10 py-5 font-bold border rounded-3xl border-white/10 hover:bg-white/5 transition-all"
            >
              Previous
            </button>
          )}
          <button 
            onClick={currentStep === 3 ? onComplete : onNext}
            className="flex-1 px-10 py-5 font-bold transition-all bg-indigo-600 rounded-3xl hover:bg-indigo-500 hover:scale-[1.02] shadow-xl shadow-indigo-600/20"
          >
            {currentStep === 3 ? 'Deploy to Cloud Run' : 'Proceed to Next Phase'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
