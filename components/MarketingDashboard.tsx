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
  Wifi, 
  WifiOff, 
  Rocket, 
  RefreshCcw, 
  ArrowRight,
  Trophy,
  AlertCircle,
  MessageSquare,
  Layout,
  Linkedin,
  Instagram,
  Twitter,
  Globe,
  ExternalLink
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
        setGeneratedContent("Error generating content. Please check your network connection.");
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
                    {isApiActive ? 'GEMINI-3 CORE: ACTIVE' : 'SYSTEM: OFFLINE'}
                </div>
                <div className="bg-navy-900 text-white px-4 py-2 rounded-2xl text-[10px] font-black flex items-center border border-navy-700 shadow-lg">
                    <Layout className="w-3.5 h-3.5 mr-2 text-gold-400" />
                    LIVE DEPLOYMENT
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
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

          <div className="lg:col-span-3 space-y-6">
            {activeTab === 'STRATEGY' ? (
              <div className="space-y-6">
                <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 p-8 md:p-16 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-gold-100/30 rounded-full -mr-48 -mt-48 blur-3xl"></div>
                    <div className="relative z-10">
                        <div className="mb-8">
                            <h2 className="text-4xl font-black text-navy-900 mb-3 font-serif uppercase tracking-tighter">
                                Launch Sequence
                            </h2>
                            <p className="text-gray-500 text-lg max-w-xl">Initialize the AI engine to start scaling your message across all channels.</p>
                        </div>

                        <div className="space-y-6 max-w-2xl">
                            <div className="flex items-start gap-6 p-8 bg-amber-50 rounded-3xl border border-amber-200 shadow-sm">
                                <div className="bg-amber-500 text-white rounded-2xl p-2.5 shadow-lg shadow-amber-200">
                                    <Globe className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-black text-amber-900 text-xl tracking-tight uppercase">Domain Health Check</h4>
                                    <p className="text-sm text-amber-800 mt-2 font-medium leading-relaxed">
                                        If <strong>richbydesignhq.com</strong> is showing the old site while <strong>www</strong> works, check your DNS routing.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 p-8 md:p-12">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-gold-600 mb-1 block">Selected Module</span>
                            <h2 className="text-3xl font-black text-navy-900 font-serif uppercase tracking-tight">
                                {tabs.find(t => t.id === activeTab)?.label}
                            </h2>
                        </div>
                        <Button onClick={handleGenerate} isLoading={isLoading} className="bg-navy-900 hover:bg-navy-950 px-10 py-7 h-auto text-sm font-black uppercase tracking-widest rounded-2xl shadow-xl">
                            Execute Generation
                            <ArrowRight className="ml-3 w-5 h-5" />
                        </Button>
                    </div>

                    {generatedContent ? (
                        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
                            <div className="xl:col-span-3 relative group">
                                <div className="bg-gray-50/50 rounded-[2rem] p-8 border border-gray-200 prose prose-slate max-w-none whitespace-pre-wrap text-gray-800 font-sans leading-relaxed min-h-[400px] text-lg">
                                    {generatedContent}
                                </div>
                                <div className="absolute top-4 right-4">
                                    <button onClick={copyToClipboard} className="p-4 bg-white rounded-2xl shadow-lg border border-gray-100 text-navy-900 hover:bg-navy-900 hover:text-white transition-all">
                                        <Copy className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                    <div className="bg-gray-50/50 rounded-[3rem] p-24 text-center border-2 border-dashed border-gray-200">
                        <div className="mx-auto h-24 w-24 bg-white rounded-[2rem] shadow-sm flex items-center justify-center text-gold-500 mb-8">
                            <PenTool className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-black text-navy-900 mb-3 font-serif uppercase tracking-tight">Ready for Input</h3>
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
