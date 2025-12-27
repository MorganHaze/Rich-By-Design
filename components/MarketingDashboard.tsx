import React, { useState, useEffect } from 'react';
import { BookDetails, MarketingContentType } from '../types';
import { generateMarketingContent } from '../services/geminiService';
import { Button } from './ui/Button';
import { 
  Copy, 
  PenTool, 
  Share2, 
  Mail, 
  FileText, 
  Zap, 
  CheckCircle2, 
  TrendingUp, 
  Wifi, 
  WifiOff, 
  Rocket, 
  RefreshCcw, 
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Trophy,
  AlertCircle,
  MessageSquare,
  Layout,
  Instagram,
  Linkedin,
  Twitter
} from 'lucide-react';

interface MarketingDashboardProps {
  book: BookDetails;
}

export const MarketingDashboard: React.FC<MarketingDashboardProps> = ({ book }) => {
  const [activeTab, setActiveTab] = useState<string>('STRATEGY');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tone, setTone] = useState('Inspirational & Authoritative');
  const [apiStatus, setApiStatus] = useState<'checking' | 'active' | 'missing'>('checking');

  const isApiActive = apiStatus === 'active';
  const isApiChecking = apiStatus === 'checking';

  useEffect(() => {
    const key = process.env.API_KEY;
    if (key && key !== "undefined" && key.length > 10) {
        setApiStatus('active');
        if (activeTab === 'STRATEGY') setActiveTab(MarketingContentType.SOCIAL_POST);
    } else {
        setApiStatus('missing');
        setActiveTab('STRATEGY');
    }
  }, []);

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
        const content = await generateMarketingContent(book, activeTab as MarketingContentType, tone);
        setGeneratedContent(content);
    } catch (err) {
        setGeneratedContent("Error: The AI brain hasn't been activated yet. Please ensure the Vercel redeploy has finished.");
    }
    setIsLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent);
    alert('Copied to clipboard!');
  };

  const tabs = [
    { id: 'STRATEGY', label: 'Launch Status', icon: Rocket },
    { id: MarketingContentType.SOCIAL_POST, label: 'Social Media', icon: Share2 },
    { id: MarketingContentType.EMAIL_NEWSLETTER, label: 'Email Blast', icon: Mail },
    { id: MarketingContentType.BLOG_OUTLINE, label: 'Blog Strategy', icon: FileText },
    { id: MarketingContentType.AD_COPY, label: 'Ad Copy', icon: Zap },
  ];

  const tones = [
    'Inspirational & Authoritative',
    'Direct & Aggressive',
    'Educational & Helpful',
    'Story-driven & Relatable'
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-12 selection:bg-gold-100">
      <div className="max-w-6xl mx-auto">
        {/* Header Area */}
        <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <div className="h-1.5 w-6 bg-gold-500 rounded-full"></div>
                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-navy-400">Marketing Intelligence Unit</span>
                </div>
                <h1 className="text-3xl font-black text-navy-900 font-serif uppercase tracking-tight">
                    Rich By Design <span className="text-gold-500 italic">HQ</span>
                </h1>
                <p className="text-gray-500 mt-1 text-sm font-sans">Strategic command for {book.author}</p>
            </div>
            
            <div className="flex flex-wrap gap-3">
                <div className={`px-4 py-2 rounded-2xl text-[10px] font-black flex items-center border transition-all duration-700 shadow-sm ${
                    isApiActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse'
                }`}>
                    {isApiActive ? <Wifi className="w-3.5 h-3.5 mr-2" /> : <WifiOff className="w-3.5 h-3.5 mr-2" />}
                    {isApiActive ? 'GEMINI-3 CORE: ACTIVE' : 'SYSTEM: OFFLINE (REDEPLOY REQ)'}
                </div>
                <div className="bg-navy-900 text-white px-4 py-2 rounded-2xl text-[10px] font-black flex items-center border border-navy-700 shadow-lg">
                    <Layout className="w-3.5 h-3.5 mr-2 text-gold-400" />
                    LIVE DEPLOYMENT
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="space-y-3">
            {tabs.map((tab) => {
                const Icon = tab.icon;
                const isLocked = !isApiActive && tab.id !== 'STRATEGY';
                const isActive = activeTab === tab.id;
                
                return (
                    <button
                        key={tab.id}
                        disabled={isLocked}
                        onClick={() => {
                            setActiveTab(tab.id);
                            if (tab.id !== 'STRATEGY') setGeneratedContent('');
                        }}
                        className={`w-full flex items-center px-6 py-4 rounded-[1.25rem] transition-all duration-300 group relative overflow-hidden ${
                        isActive
                            ? 'bg-navy-900 text-white shadow-2xl translate-x-2'
                            : isLocked 
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200 opacity-60'
                                : 'bg-white text-gray-600 hover:bg-white hover:shadow-xl border border-gray-100 hover:border-navy-100 hover:-translate-y-1'
                        }`}
                    >
                        <Icon className={`w-5 h-5 mr-4 transition-transform duration-500 ${isActive ? 'scale-125 text-gold-400' : 'group-hover:scale-110 group-hover:text-navy-900'}`} />
                        <span className="font-bold tracking-tight text-sm uppercase">{tab.label}</span>
                        {isActive && <div className="ml-auto w-2 h-2 rounded-full bg-gold-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]"></div>}
                    </button>
                )
            })}

            {isApiActive && (
                <div className="mt-8 p-6 bg-gradient-to-br from-gold-50 to-white rounded-[2rem] border border-gold-100 shadow-sm">
                    <h4 className="text-[10px] font-black uppercase text-gold-700 tracking-widest mb-4 flex items-center">
                        <MessageSquare className="w-3 h-3 mr-2" /> Brand Voice
                    </h4>
                    <div className="space-y-2">
                        {tones.map((t) => (
                            <button
                                key={t}
                                onClick={() => setTone(t)}
                                className={`w-full text-left text-xs px-3 py-2 rounded-lg transition-all ${
                                    tone === t ? 'bg-navy-900 text-white font-bold' : 'text-gray-500 hover:bg-gold-100'
                                }`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>
            )}
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {activeTab === 'STRATEGY' ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 p-8 md:p-16 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-gold-100/30 rounded-full -mr-48 -mt-48 blur-3xl"></div>
                    
                    <div className="relative z-10">
                        <div className="mb-8">
                            <h2 className="text-4xl font-black text-navy-900 mb-3 font-serif uppercase tracking-tighter">
                                Launch Sequence
                            </h2>
                            <p className="text-gray-500 text-lg max-w-xl">Your domain is active. Now we initialize the AI engine to start scaling your message.</p>
                        </div>

                        <div className="space-y-6 max-w-2xl">
                            <div className="flex items-start gap-6 p-8 bg-emerald-50/40 rounded-3xl border border-emerald-100 hover:shadow-md transition-shadow">
                                <div className="bg-emerald-500 text-white rounded-2xl p-2.5 shadow-lg shadow-emerald-200">
                                    <CheckCircle2 className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-black text-emerald-900 text-xl tracking-tight">Infrastructure: ONLINE</h4>
                                    <p className="text-sm text-emerald-700 mt-1 font-medium">Domain richbydesignhq.com is mapped and secure.</p>
                                </div>
                            </div>

                            <div className={`flex items-start gap-6 p-8 rounded-3xl border transition-all duration-700 ${
                                isApiActive ? 'bg-emerald-50/40 border-emerald-100' : 'bg-white border-gold-400 shadow-[0_20px_50px_rgba(251,191,36,0.15)] scale-[1.02]'
                            }`}>
                                <div className={`${isApiActive ? 'bg-emerald-500' : 'bg-gold-500'} text-white rounded-2xl p-2.5 shadow-lg transition-all duration-700`}>
                                    {isApiActive ? <CheckCircle2 className="w-6 h-6" /> : <RefreshCcw className="w-6 h-6 animate-spin" />}
                                </div>
                                <div className="flex-1">
                                    <h4 className={`font-black text-xl tracking-tight ${isApiActive ? 'text-emerald-900' : 'text-navy-900'}`}>
                                        AI Engine: {isApiActive ? 'NOMINAL' : 'WAITING FOR REDEPLOY'}
                                    </h4>
                                    {isApiActive ? (
                                        <p className="text-sm text-emerald-700 mt-1 italic font-medium">Connection established. The Author's voice is loaded.</p>
                                    ) : (
                                        <div className="mt-5 space-y-4">
                                            <div className="bg-navy-950 p-6 rounded-2xl border border-navy-800 shadow-inner">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <AlertCircle className="w-4 h-4 text-gold-400" />
                                                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Action Item</span>
                                                </div>
                                                <p className="text-sm text-navy-100 leading-relaxed">
                                                    You've added your API Key. Now, go to your **Vercel Deployments**, click the **Redeploy** button, and this screen will transform into your marketing engine.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className={`flex items-start gap-6 p-8 rounded-3xl border transition-all duration-1000 ${
                                isApiActive ? 'bg-navy-900 text-white shadow-2xl scale-[1.05]' : 'bg-gray-50 border-gray-100 opacity-40'
                            }`}>
                                <div className={`${isApiActive ? 'bg-gold-500 shadow-[0_0_15px_rgba(251,191,36,0.4)]' : 'bg-gray-300'} text-navy-900 rounded-2xl p-2.5`}>
                                    <Trophy className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-black text-xl tracking-tight">Market Ready</h4>
                                    <p className={`text-sm mt-1 font-medium ${isApiActive ? 'text-navy-100' : 'text-gray-400'}`}>
                                        {isApiActive ? 'Strategy modules unlocked. Your financial revolution is live.' : 'Awaiting system initialization...'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-700">
                <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 p-8 md:p-12">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-gold-600 mb-1 block">Selected Module</span>
                            <h2 className="text-3xl font-black text-navy-900 font-serif uppercase tracking-tight">
                                {tabs.find(t => t.id === activeTab)?.label}
                            </h2>
                        </div>
                        <Button 
                            onClick={handleGenerate} 
                            isLoading={isLoading} 
                            className="bg-navy-900 hover:bg-navy-950 px-10 py-7 h-auto text-sm font-black uppercase tracking-widest rounded-2xl shadow-xl hover:shadow-2xl transition-all group"
                        >
                            {generatedContent ? 'Refine Logic' : 'Execute Generation'}
                            <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </div>

                    {generatedContent ? (
                        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
                            <div className="xl:col-span-3 relative group">
                                <div className="bg-gray-50/50 rounded-[2rem] p-8 border border-gray-200 prose prose-slate max-w-none whitespace-pre-wrap text-gray-800 font-sans leading-relaxed min-h-[400px] text-lg">
                                    {generatedContent}
                                </div>
                                <div className="absolute top-4 right-4">
                                    <button 
                                        onClick={copyToClipboard}
                                        className="p-4 bg-white rounded-2xl shadow-lg border border-gray-100 text-navy-900 hover:bg-navy-900 hover:text-white transition-all transform active:scale-95"
                                        title="Copy to clipboard"
                                    >
                                        <Copy className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                            
                            {/* Visual Preview for Social Posts */}
                            {activeTab === MarketingContentType.SOCIAL_POST && (
                                <div className="xl:col-span-2 space-y-4">
                                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Live Preview</span>
                                    <div className="bg-white border border-gray-200 rounded-[2rem] overflow-hidden shadow-sm">
                                        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-navy-900 flex items-center justify-center">
                                                    <span className="text-[8px] text-gold-400 font-black">MH</span>
                                                </div>
                                                <span className="text-xs font-bold text-navy-900 tracking-tight">Morgan Haze</span>
                                            </div>
                                            <div className="flex gap-2">
                                                <Linkedin className="w-3 h-3 text-gray-400" />
                                                <Instagram className="w-3 h-3 text-gray-400" />
                                                <Twitter className="w-3 h-3 text-gray-400" />
                                            </div>
                                        </div>
                                        <div className="aspect-square bg-navy-900 flex flex-col items-center justify-center p-8 text-center relative">
                                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
                                            <h3 className="text-white font-serif text-3xl font-black leading-tight uppercase mb-2">Rich By Design</h3>
                                            <div className="h-0.5 w-12 bg-gold-400 mb-4"></div>
                                            <p className="text-gold-400 text-xs font-black tracking-widest uppercase">The 7 Laws of Money</p>
                                        </div>
                                        <div className="p-4">
                                            <div className="h-2 w-24 bg-gray-100 rounded mb-2"></div>
                                            <div className="h-2 w-full bg-gray-50 rounded mb-2"></div>
                                            <div className="h-2 w-2/3 bg-gray-50 rounded"></div>
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-gray-400 italic text-center">Simulated visual for Instagram/LinkedIn</p>
                                </div>
                            )}
                        </div>
                    ) : (
                    <div className="bg-gray-50/50 rounded-[3rem] p-24 text-center border-2 border-dashed border-gray-200 transition-all hover:border-gold-300 group">
                        <div className="mx-auto h-24 w-24 bg-white rounded-[2rem] shadow-sm flex items-center justify-center text-gold-500 mb-8 transition-transform group-hover:scale-110 duration-500">
                            <PenTool className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-black text-navy-900 mb-3 font-serif uppercase tracking-tight">Ready for Input</h3>
                        <p className="text-gray-500 max-w-sm mx-auto leading-relaxed">Choose your tone and click generate to deploy high-impact assets for the Rich By Design brand.</p>
                    </div>
                    )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
