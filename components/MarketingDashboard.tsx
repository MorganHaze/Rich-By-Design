import React, { useState, useEffect } from 'react';
import { BookDetails, MarketingContentType, PostStatus, ScheduledPost } from '../types';
import { generateMarketingContent, generateCampaign } from '../services/geminiService';
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
  Calendar,
  Clock,
  Trash2,
  Check,
  PlayCircle
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
  
  // Marketing Automation State
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);

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

    // Load queue from localStorage
    const savedQueue = localStorage.getItem('rbd_marketing_queue');
    if (savedQueue) {
      setScheduledPosts(JSON.parse(savedQueue));
    }
  }, []);

  const saveQueue = (newQueue: ScheduledPost[]) => {
    setScheduledPosts(newQueue);
    localStorage.setItem('rbd_marketing_queue', JSON.stringify(newQueue));
  };

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

  const handleCreateCampaign = async () => {
    setIsLoading(true);
    try {
      const campaignData = await generateCampaign(book, 7);
      const newPosts: ScheduledPost[] = campaignData.map((p: any) => ({
        id: Math.random().toString(36).substr(2, 9),
        type: p.type as MarketingContentType,
        platform: p.platform,
        content: p.content,
        scheduledTime: Date.now() + (p.dayOffset * 86400000),
        status: PostStatus.DRAFT
      }));
      saveQueue([...newPosts, ...scheduledPosts]);
      setActiveTab('AUTOMATION');
    } catch (err) {
      alert("Campaign architecture failed. System recalibrating...");
    }
    setIsLoading(false);
  };

  const updatePostStatus = (id: string, status: PostStatus) => {
    saveQueue(scheduledPosts.map(p => p.id === id ? { ...p, status } : p));
  };

  const deletePost = (id: string) => {
    saveQueue(scheduledPosts.filter(p => p.id !== id));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const tabs = [
    { id: 'STRATEGY', label: 'Launch Status', icon: Rocket },
    { id: 'AUTOMATION', label: 'Campaign Architect', icon: Calendar },
    { id: MarketingContentType.SOCIAL_POST, label: 'Ghostwriter Lab', icon: Share2 },
    { id: MarketingContentType.BLOG_FULL, label: 'Blog Engine', icon: PenTool },
    { id: MarketingContentType.EMAIL_NEWSLETTER, label: 'Email Blast', icon: Mail },
  ];

  const tones = [
    'Inspirational & Authoritative',
    'Direct & Aggressive',
    'Educational & Helpful',
    'Story-driven & Relatable'
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-12 selection:bg-gold-100">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <div className="h-1.5 w-6 bg-gold-500 rounded-full"></div>
                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-navy-400">Marketing Command Center</span>
                </div>
                <h1 className="text-3xl font-black text-navy-900 font-serif uppercase tracking-tight">
                    Rich By Design <span className="text-gold-500 italic">HQ</span>
                </h1>
                <p className="text-sm text-gray-500 font-sans">Strategic automated growth engine for {book.author}</p>
            </div>
            
            <div className="flex flex-wrap gap-3">
                <div className={`px-4 py-2 rounded-2xl text-[10px] font-black flex items-center border transition-all duration-700 shadow-sm ${
                    isApiActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse'
                }`}>
                    {isApiActive ? <Wifi className="w-3.5 h-3.5 mr-2" /> : <WifiOff className="w-3.5 h-3.5 mr-2" />}
                    {isApiActive ? 'GEMINI-3 CORE: ACTIVE' : 'SYSTEM: OFFLINE'}
                </div>
                <div className="bg-navy-900 text-white px-4 py-2 rounded-2xl text-[10px] font-black flex items-center border border-navy-700 shadow-lg">
                    <Clock className="w-3.5 h-3.5 mr-2 text-gold-400" />
                    {scheduledPosts.filter(p => p.status === PostStatus.SCHEDULED).length} POSTS QUEUED
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
                            if (!['STRATEGY', 'AUTOMATION'].includes(tab.id)) setGeneratedContent('');
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

            {isApiActive && activeTab !== 'AUTOMATION' && (
                <div className="mt-8 p-6 bg-gradient-to-br from-gold-50 to-white rounded-[2rem] border border-gold-100 shadow-sm">
                    <h4 className="text-[10px] font-black uppercase text-gold-700 tracking-widest mb-4 flex items-center">
                        <MessageSquare className="w-3 h-3 mr-2" /> Ghostwriter Tone
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
              <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 p-8 md:p-16 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-gold-100/30 rounded-full -mr-48 -mt-48 blur-3xl"></div>
                  <div className="relative z-10">
                      <div className="mb-12">
                          <h2 className="text-4xl font-black text-navy-900 mb-3 font-serif uppercase tracking-tighter">
                              Campaign Sequence
                          </h2>
                          <p className="text-gray-500 text-lg max-w-xl">Initiate the 7-day automated wealth blast to dominate your market presence.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                        <div className="p-8 bg-navy-900 text-white rounded-[2rem] shadow-2xl relative group overflow-hidden">
                           <Zap className="absolute top-4 right-4 text-gold-500 w-8 h-8 opacity-20 group-hover:scale-125 transition-transform" />
                           <h4 className="text-xs font-black uppercase tracking-widest text-gold-400 mb-2">Ghostwriter Core</h4>
                           <p className="text-xl font-black mb-6 leading-tight">Generate a 7-day automated campaign across all channels.</p>
                           <Button onClick={handleCreateCampaign} isLoading={isLoading} className="w-full bg-gold-500 text-navy-900 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-white transition-colors">
                             Launch Campaign Architect
                           </Button>
                        </div>
                        <div className="p-8 bg-white border border-gray-100 rounded-[2rem] shadow-sm flex flex-col justify-center">
                           <div className="flex items-center gap-3 mb-4">
                             <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                               <CheckCircle2 className="w-6 h-6" />
                             </div>
                             <h4 className="font-black text-navy-900 uppercase tracking-tight">System Status</h4>
                           </div>
                           <p className="text-sm text-gray-500 font-medium">Ready to deploy 3,500+ keywords and 14 distinct pieces of content.</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-6 p-8 bg-amber-50 rounded-3xl border border-amber-200 shadow-sm">
                          <div className="bg-amber-500 text-white rounded-2xl p-2.5 shadow-lg shadow-amber-200">
                              <Globe className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                              <h4 className="font-black text-amber-900 text-xl tracking-tight uppercase">Domain Health Check</h4>
                              <p className="text-sm text-amber-800 mt-2 font-medium leading-relaxed">
                                  Routing for <strong>richbydesignhq.com</strong> is optimized. System is ready for traffic bursts.
                              </p>
                          </div>
                      </div>
                  </div>
              </div>
            ) : activeTab === 'AUTOMATION' ? (
              <div className="space-y-6">
                <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 p-8 md:p-10">
                   <div className="flex justify-between items-center mb-8">
                      <div>
                        <h2 className="text-2xl font-black text-navy-900 uppercase tracking-tight">Marketing Automation Queue</h2>
                        <p className="text-sm text-gray-500">Review, edit, and approve your AI-ghostwritten content calendar.</p>
                      </div>
                      <Button onClick={handleCreateCampaign} isLoading={isLoading} variant="outline" className="border-navy-900 text-navy-900 text-[10px] uppercase font-black tracking-widest px-6 h-12 rounded-xl">
                        Regenerate Queue <RefreshCcw className="ml-2 w-3.5 h-3.5" />
                      </Button>
                   </div>

                   {scheduledPosts.length === 0 ? (
                     <div className="p-20 text-center bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
                        <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-gray-400 uppercase tracking-widest">No posts in queue</h3>
                        <p className="text-gray-400 text-xs mt-2">Generate a campaign to populate your calendar.</p>
                     </div>
                   ) : (
                     <div className="space-y-4">
                       {scheduledPosts.sort((a,b) => a.scheduledTime - b.scheduledTime).map((post) => (
                         <div key={post.id} className="bg-white border border-gray-100 rounded-[1.5rem] p-6 hover:shadow-lg transition-all flex flex-col md:flex-row gap-6 items-start">
                            <div className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-2xl min-w-[100px]">
                               <span className="text-[10px] font-black text-navy-400 uppercase">{post.platform}</span>
                               <span className="text-lg font-black text-navy-900">{new Date(post.scheduledTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                            </div>
                            <div className="flex-1">
                               <div className="flex items-center gap-2 mb-2">
                                  {post.platform === 'LinkedIn' && <Linkedin className="w-4 h-4 text-blue-700" />}
                                  {post.platform === 'Instagram' && <Instagram className="w-4 h-4 text-rose-600" />}
                                  {post.platform === 'Twitter' && <Twitter className="w-4 h-4 text-sky-500" />}
                                  {post.platform === 'Official Blog' && <Globe className="w-4 h-4 text-emerald-600" />}
                                  <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                                    post.status === PostStatus.SCHEDULED ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'
                                  }`}>
                                    {post.status}
                                  </span>
                               </div>
                               <p className="text-sm text-gray-700 leading-relaxed font-medium line-clamp-3">{post.content}</p>
                            </div>
                            <div className="flex md:flex-col gap-2">
                               <button onClick={() => copyToClipboard(post.content)} className="p-3 bg-gray-50 text-gray-600 rounded-xl hover:bg-navy-900 hover:text-white transition-all"><Copy className="w-4 h-4" /></button>
                               {post.status === PostStatus.DRAFT ? (
                                 <button onClick={() => updatePostStatus(post.id, PostStatus.SCHEDULED)} className="p-3 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all"><Check className="w-4 h-4" /></button>
                               ) : (
                                 <button onClick={() => updatePostStatus(post.id, PostStatus.DRAFT)} className="p-3 bg-gold-50 text-gold-600 rounded-xl hover:bg-gold-500 hover:text-white transition-all"><PlayCircle className="w-4 h-4" /></button>
                               )}
                               <button onClick={() => deletePost(post.id)} className="p-3 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all"><Trash2 className="w-4 h-4" /></button>
                            </div>
                         </div>
                       ))}
                     </div>
                   )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 p-8 md:p-12">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                      <div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-gold-600 mb-1 block">Selected Module</span>
                          <h2 className="text-3xl font-black text-navy-900 font-serif uppercase tracking-tight">
                              {tabs.find(t => t.id === activeTab)?.label}
                          </h2>
                      </div>
                      <Button onClick={handleGenerate} isLoading={isLoading} className="bg-navy-900 hover:bg-navy-950 px-10 py-7 h-auto text-sm font-black uppercase tracking-widest rounded-2xl shadow-xl">
                          Generate Content
                          <ArrowRight className="ml-3 w-5 h-5" />
                      </Button>
                  </div>

                  {generatedContent ? (
                      <div className="relative group animate-in fade-in slide-in-from-bottom-4">
                          <div className="bg-gray-50/50 rounded-[2rem] p-8 border border-gray-200 prose prose-slate max-w-none whitespace-pre-wrap text-gray-800 font-sans leading-relaxed min-h-[400px] text-lg">
                              {generatedContent}
                          </div>
                          <div className="absolute top-4 right-4 flex gap-2">
                              <button onClick={() => copyToClipboard(generatedContent)} className="p-4 bg-white rounded-2xl shadow-lg border border-gray-100 text-navy-900 hover:bg-navy-900 hover:text-white transition-all">
                                  <Copy className="w-5 h-5" />
                              </button>
                          </div>
                      </div>
                  ) : (
                  <div className="bg-gray-50/50 rounded-[3rem] p-24 text-center border-2 border-dashed border-gray-200">
                      <div className="mx-auto h-24 w-24 bg-white rounded-[2rem] shadow-sm flex items-center justify-center text-gold-500 mb-8">
                          <PenTool className="w-10 h-10" />
                      </div>
                      <h3 className="text-2xl font-black text-navy-900 mb-3 font-serif uppercase tracking-tight">Ready for Input</h3>
                      <p className="text-gray-400 font-medium">Click generate to let your AI ghostwriter create new content.</p>
                  </div>
                  )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
