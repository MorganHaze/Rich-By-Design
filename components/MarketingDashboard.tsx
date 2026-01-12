import React, { useState, useEffect } from 'react';
import { BookDetails, MarketingContentType, PostStatus, ScheduledPost } from '../types';
import { generateMarketingContent, generateCampaign, generateMarketingImage } from '../services/geminiService';
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
  MessageSquare,
  Linkedin,
  Instagram,
  Twitter,
  Globe,
  Calendar,
  Clock,
  Trash2,
  Check,
  PlayCircle,
  Image as ImageIcon,
  Sparkles,
  Loader2,
  ArrowDownLeft,
  LayoutGrid
} from 'lucide-react';

interface MarketingDashboardProps {
  book: BookDetails;
}

export const MarketingDashboard: React.FC<MarketingDashboardProps> = ({ book }) => {
  const [activeTab, setActiveTab] = useState<string>('STRATEGY');
  const [generatedContent, setGeneratedContent] = useState('');
  const [generatedImage, setGeneratedImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
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
    setGeneratedImage('');
    try {
        const { text, imagePrompt } = await generateMarketingContent(book, activeTab as MarketingContentType, tone);
        setGeneratedContent(text);
        if (imagePrompt && activeTab === MarketingContentType.SOCIAL_POST) {
          setIsImageLoading(true);
          const img = await generateMarketingImage(imagePrompt);
          setGeneratedImage(img);
          setIsImageLoading(false);
        }
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
        imagePrompt: p.imagePrompt,
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

  const generateImageForQueuedPost = async (id: string, prompt: string) => {
    const post = scheduledPosts.find(p => p.id === id);
    if (!post || !prompt) return;

    setIsImageLoading(true);
    const img = await generateMarketingImage(prompt);
    saveQueue(scheduledPosts.map(p => p.id === id ? { ...p, imageUrl: img } : p));
    setIsImageLoading(false);
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

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-12 selection:bg-gold-100">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
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
          {/* Sidebar Tabs */}
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
                            if (!['STRATEGY', 'AUTOMATION'].includes(tab.id)) {
                              setGeneratedContent('');
                              setGeneratedImage('');
                            }
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
                        {['Inspirational & Authoritative', 'Direct & Aggressive', 'Educational & Helpful', 'Story-driven & Relatable'].map((t) => (
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
              <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 p-8 md:p-16 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-gold-100/30 rounded-full -mr-48 -mt-48 blur-3xl"></div>
                  <div className="relative z-10">
                      <div className="mb-12">
                          <h2 className="text-4xl font-black text-navy-900 mb-3 font-serif uppercase tracking-tighter">
                              Campaign Sequence
                          </h2>
                          <p className="text-gray-500 text-lg max-w-xl">Initiate the 7-day automated wealth blast. The system will generate high-impact educational infographics like the ones that drive viral growth.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                        <div className="p-8 bg-navy-900 text-white rounded-[2rem] shadow-2xl relative group overflow-hidden">
                           <Zap className="absolute top-4 right-4 text-gold-500 w-8 h-8 opacity-20 group-hover:scale-125 transition-transform" />
                           <h4 className="text-xs font-black uppercase tracking-widest text-gold-400 mb-2">Ghostwriter Core</h4>
                           <p className="text-xl font-black mb-6 leading-tight">Generate a 7-day automated campaign with visual infographics and comparisons.</p>
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
                           <p className="text-sm text-gray-500 font-medium">Ready to deploy educational comparisons (e.g. Income vs Wealth) across all social platforms.</p>
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
                        <p className="text-sm text-gray-500">Review, generate custom imagery, and approve your content calendar.</p>
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
                     <div className="space-y-6">
                       {scheduledPosts.sort((a,b) => a.scheduledTime - b.scheduledTime).map((post) => (
                         <div key={post.id} className="bg-white border border-gray-100 rounded-[2.5rem] p-8 hover:shadow-2xl transition-all flex flex-col items-stretch gap-6 group">
                            <div className="flex flex-col md:flex-row gap-6 items-start">
                                <div className="flex flex-col items-center justify-center p-4 bg-navy-900 text-white rounded-3xl min-w-[120px] shadow-lg">
                                    <span className="text-[10px] font-black text-gold-400 uppercase tracking-widest">{post.platform}</span>
                                    <span className="text-2xl font-black">{new Date(post.scheduledTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-4">
                                        {post.platform === 'LinkedIn' && <Linkedin className="w-5 h-5 text-blue-700" />}
                                        {post.platform === 'Instagram' && <Instagram className="w-5 h-5 text-rose-600" />}
                                        {post.platform === 'Twitter' && <Twitter className="w-5 h-5 text-sky-500" />}
                                        {post.platform === 'Official Blog' && <Globe className="w-5 h-5 text-emerald-600" />}
                                        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                                            post.status === PostStatus.SCHEDULED ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-gray-100 text-gray-500 border border-gray-200'
                                        }`}>
                                            {post.status}
                                        </span>
                                    </div>
                                    <h4 className="text-sm font-black text-navy-400 uppercase tracking-widest mb-2 flex items-center">
                                      <LayoutGrid className="w-3 h-3 mr-2" /> Content Preview
                                    </h4>
                                    <p className="text-lg text-navy-900 leading-relaxed font-medium mb-4">{post.content}</p>
                                    
                                    {/* Image Section in Queue Card */}
                                    <div className="mt-6 border-t border-gray-50 pt-6">
                                        {post.imageUrl ? (
                                            <div className="relative rounded-3xl overflow-hidden group/img aspect-video bg-gray-50">
                                                <img src={post.imageUrl} alt="Generated Asset" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-navy-900/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                                    <button onClick={() => generateImageForQueuedPost(post.id, post.imagePrompt || post.content)} className="p-4 bg-white rounded-2xl text-navy-900 font-bold flex items-center gap-2 shadow-xl hover:scale-105 transition-transform">
                                                        <RefreshCcw className="w-5 h-5" /> Re-generate Infographic
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <button 
                                                onClick={() => generateImageForQueuedPost(post.id, post.imagePrompt || post.content)}
                                                className="w-full h-44 border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center text-gray-400 hover:border-gold-500 hover:bg-gold-50/50 hover:text-gold-600 transition-all gap-3"
                                            >
                                                <div className="p-4 bg-white rounded-full shadow-sm">
                                                  {isImageLoading ? <Loader2 className="w-6 h-6 animate-spin text-gold-500" /> : <Sparkles className="w-6 h-6 text-gold-500" />}
                                                </div>
                                                <span className="text-xs font-black uppercase tracking-widest">Generate Comparison Infographic</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className="flex md:flex-col gap-3">
                                    <button onClick={() => copyToClipboard(post.content)} className="p-4 bg-gray-50 text-gray-600 rounded-2xl hover:bg-navy-900 hover:text-white transition-all shadow-sm"><Copy className="w-5 h-5" /></button>
                                    {post.status === PostStatus.DRAFT ? (
                                        <button onClick={() => updatePostStatus(post.id, PostStatus.SCHEDULED)} className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"><Check className="w-5 h-5" /></button>
                                    ) : (
                                        <button onClick={() => updatePostStatus(post.id, PostStatus.DRAFT)} className="p-4 bg-gold-50 text-gold-600 rounded-2xl hover:bg-gold-500 hover:text-white transition-all shadow-sm"><PlayCircle className="w-5 h-5" /></button>
                                    )}
                                    <button onClick={() => deletePost(post.id)} className="p-4 bg-rose-50 text-rose-600 rounded-2xl hover:bg-rose-600 hover:text-white transition-all shadow-sm"><Trash2 className="w-5 h-5" /></button>
                                </div>
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
                          Generate New Post
                          <ArrowRight className="ml-3 w-5 h-5" />
                      </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        {generatedContent ? (
                            <div className="relative group animate-in fade-in slide-in-from-bottom-4">
                                <div className="bg-gray-50/50 rounded-[2rem] p-8 border border-gray-200 prose prose-slate max-w-none whitespace-pre-wrap text-gray-800 font-sans leading-relaxed min-h-[400px] text-lg">
                                    {generatedContent}
                                </div>
                                <div className="absolute top-4 right-4">
                                    <button onClick={() => copyToClipboard(generatedContent)} className="p-4 bg-white rounded-2xl shadow-lg border border-gray-100 text-navy-900 hover:bg-navy-900 hover:text-white transition-all">
                                        <Copy className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-gray-50/50 rounded-[3rem] p-24 text-center border-2 border-dashed border-gray-200 h-full flex flex-col items-center justify-center">
                                <div className="mx-auto h-24 w-24 bg-white rounded-[2rem] shadow-sm flex items-center justify-center text-gold-500 mb-8">
                                    <PenTool className="w-10 h-10" />
                                </div>
                                <h3 className="text-2xl font-black text-navy-900 mb-3 font-serif uppercase tracking-tight">Ready for Copy</h3>
                                <p className="text-gray-400 text-sm">Automated ghostwriting engine is ready to draft your next financial law post.</p>
                            </div>
                        )}
                    </div>

                    <div className="space-y-6">
                        {isImageLoading ? (
                             <div className="h-full min-h-[400px] bg-navy-900 rounded-[3rem] flex flex-col items-center justify-center text-white p-12 text-center gap-6">
                                <Loader2 className="w-16 h-16 text-gold-500 animate-spin" />
                                <p className="text-xl font-serif italic text-gold-100">Architecting comparison visuals...</p>
                             </div>
                        ) : generatedImage ? (
                            <div className="rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white group relative aspect-square">
                                <img src={generatedImage} alt="Social Asset" className="w-full h-full object-cover" />
                                <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/90 backdrop-blur rounded-2xl border border-gray-100 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-3">
                                   <ArrowDownLeft className="text-navy-900 w-5 h-5" />
                                   <span className="text-[10px] font-black uppercase text-navy-900 tracking-widest">Designed for High-Engagement Growth</span>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-navy-900 rounded-[3rem] p-24 text-center border-2 border-dashed border-white/10 h-full flex flex-col items-center justify-center">
                                <div className="mx-auto h-24 w-24 bg-white/5 rounded-[2rem] shadow-sm flex items-center justify-center text-gold-500 mb-8">
                                    <ImageIcon className="w-10 h-10" />
                                </div>
                                <h3 className="text-2xl font-black text-white mb-3 font-serif uppercase tracking-tight">Comparison Graphic</h3>
                                <p className="text-white/40 text-sm">Infographics (like Character A vs B) are automatically generated for social posts to boost engagement.</p>
                            </div>
                        )}
                    </div>
                  </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
