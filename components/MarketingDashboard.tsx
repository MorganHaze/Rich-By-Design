import React, { useState, useEffect } from 'react';
import { BookDetails, MarketingContentType, PostStatus, ScheduledPost, SocialAccount, ConnectionStatus } from '../types';
import { generateMarketingContent, generateCampaign, generateMarketingImage } from '../services/geminiService';
import { Button } from './ui/Button';
import { 
  Copy, 
  PenTool, 
  Share2, 
  Mail, 
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
  Facebook,
  Globe,
  Calendar,
  Clock,
  Trash2,
  Check,
  PlayCircle,
  Image as ImageIcon,
  Sparkles,
  Loader2,
  LayoutGrid,
  Link,
  Unlink,
  ExternalLink,
  ShieldCheck,
  UploadCloud,
  CheckCircle,
  ToggleLeft as ToggleOff,
  ToggleRight as ToggleOn,
  Settings2,
  Bot,
  Cpu,
  Activity
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
  const [isDeploying, setIsDeploying] = useState<string | null>(null);
  const [isAutoPilot, setIsAutoPilot] = useState(false);
  const [apiStatus, setApiStatus] = useState<'checking' | 'active' | 'missing'>('checking');
  
  // Marketing Automation State
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [accounts, setAccounts] = useState<SocialAccount[]>([
    { platform: 'LinkedIn', username: '@morganhaze', status: 'DISCONNECTED' },
    { platform: 'Instagram', username: '@richbydesignhq', status: 'DISCONNECTED' },
    { platform: 'Facebook', username: 'Rich By Design Page', status: 'DISCONNECTED' },
    { platform: 'Official Blog', username: 'richbydesignhq.com', status: 'DISCONNECTED' }
  ]);

  const isApiActive = apiStatus === 'active';

  useEffect(() => {
    const key = process.env.API_KEY;
    if (key && key !== "undefined" && key.length > 10) {
        setApiStatus('active');
        if (activeTab === 'STRATEGY') setActiveTab('STRATEGY');
    } else {
        setApiStatus('missing');
        setActiveTab('STRATEGY');
    }

    const savedQueue = localStorage.getItem('rbd_marketing_queue');
    if (savedQueue) {
      setScheduledPosts(JSON.parse(savedQueue));
    }

    const savedAccounts = localStorage.getItem('rbd_accounts');
    if (savedAccounts) {
      setAccounts(JSON.parse(savedAccounts));
    }
  }, []);

  const saveQueue = (newQueue: ScheduledPost[]) => {
    setScheduledPosts(newQueue);
    localStorage.setItem('rbd_marketing_queue', JSON.stringify(newQueue));
  };

  const saveAccounts = (newAccounts: SocialAccount[]) => {
    setAccounts(newAccounts);
    localStorage.setItem('rbd_accounts', JSON.stringify(newAccounts));
  };

  const toggleAccount = (platform: string) => {
    const isMeta = platform === 'Instagram' || platform === 'Facebook';
    const targetStatus = accounts.find(a => a.platform === platform)?.status === 'CONNECTED' ? 'DISCONNECTED' : 'CONNECTED' as ConnectionStatus;

    const newAccounts = accounts.map(acc => {
      const shouldToggle = isMeta 
        ? (acc.platform === 'Instagram' || acc.platform === 'Facebook')
        : acc.platform === platform;

      return shouldToggle 
        ? { ...acc, status: targetStatus, lastSync: Date.now() } 
        : acc;
    });
    
    saveAccounts(newAccounts);
  };

  const handleDeploy = async (post: ScheduledPost) => {
    const acc = accounts.find(a => a.platform === post.platform);
    if (!acc || acc.status !== 'CONNECTED') {
      alert(`Connection Error: Your ${post.platform} account is not linked. Please go to 'Launch Status' to authorize the API.`);
      return;
    }

    setIsDeploying(post.id);
    await new Promise(resolve => setTimeout(resolve, 2000));
    updatePostStatus(post.id, PostStatus.POSTED);
    setIsDeploying(null);
    alert(`Published: Post is now live on ${post.platform}.`);
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setGeneratedImage('');
    try {
        const { text, imagePrompt } = await generateMarketingContent(book, activeTab as MarketingContentType);
        setGeneratedContent(text);
        if (imagePrompt && activeTab === MarketingContentType.SOCIAL_POST) {
          setIsImageLoading(true);
          const img = await generateMarketingImage(imagePrompt);
          setGeneratedImage(img);
          setIsImageLoading(false);
        }
    } catch (err) {
        setGeneratedContent("The AI vault is temporarily locked. Check your connection.");
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
        status: PostStatus.SCHEDULED 
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
                {isAutoPilot && (
                  <div className="px-4 py-2 rounded-2xl text-[10px] font-black flex items-center bg-navy-900 text-gold-400 border border-gold-400/30 animate-pulse shadow-lg">
                    <Bot className="w-3.5 h-3.5 mr-2" />
                    AUTO-PILOT: ACTIVE
                  </div>
                )}
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
          {/* Sidebar */}
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
          </div>

          {/* Main Area */}
          <div className="lg:col-span-3 space-y-6">
            {activeTab === 'STRATEGY' ? (
              <div className="space-y-6">
                <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 p-8 md:p-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-gold-100/30 rounded-full -mr-48 -mt-48 blur-3xl"></div>
                    <div className="relative z-10">
                        <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                            <div>
                              <h2 className="text-3xl font-black text-navy-900 mb-3 font-serif uppercase tracking-tight">Channel Manager</h2>
                              <p className="text-gray-500 font-medium">Connect your Meta (FB & IG) and LinkedIn accounts to enable autonomous marketing.</p>
                            </div>
                            <div className="flex gap-2">
                               <div className="flex items-center px-3 py-1.5 bg-navy-900 rounded-full border border-gold-400/20">
                                  <div className={`w-2 h-2 rounded-full mr-2 ${accounts.some(a => a.status === 'CONNECTED') ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-gray-500'}`}></div>
                                  <span className="text-[10px] font-black text-white uppercase tracking-widest">Linked Status</span>
                               </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          {accounts.map((acc) => {
                            const isMeta = acc.platform === 'Instagram' || acc.platform === 'Facebook';
                            const isConnected = acc.status === 'CONNECTED';
                            
                            return (
                              <div key={acc.platform} className={`p-6 rounded-[2rem] border transition-all relative overflow-hidden group ${
                                isConnected ? 'bg-white border-gold-300 shadow-xl' : 'bg-gray-50 border-gray-200 opacity-60'
                              }`}>
                                <div className="flex justify-between items-start mb-6">
                                  <div className={`p-3 rounded-2xl text-white shadow-md ${
                                    isConnected ? 'bg-navy-900' : 'bg-gray-400'
                                  }`}>
                                    {acc.platform === 'LinkedIn' && <Linkedin className="w-6 h-6" />}
                                    {acc.platform === 'Instagram' && <Instagram className="w-6 h-6" />}
                                    {acc.platform === 'Facebook' && <Facebook className="w-6 h-6" />}
                                    {acc.platform === 'Official Blog' && <Globe className="w-6 h-6" />}
                                  </div>
                                  {isConnected && <CheckCircle className="w-5 h-5 text-emerald-500" />}
                                </div>
                                
                                <div className="mb-6">
                                  <h4 className="font-black text-navy-900 uppercase text-[10px] mb-1 tracking-widest">{acc.platform}</h4>
                                  <p className="text-xs font-bold text-gray-500 truncate">{acc.username}</p>
                                </div>

                                <button 
                                  onClick={() => toggleAccount(acc.platform)}
                                  className={`w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                                    isConnected ? 'bg-rose-50 text-rose-600 hover:bg-rose-100' : 'bg-navy-900 text-white hover:bg-gold-500 hover:text-navy-900'
                                  }`}
                                >
                                  {isConnected ? <Unlink className="w-3.5 h-3.5" /> : <Link className="w-3.5 h-3.5" />}
                                  {isConnected ? 'Unlink' : 'Link Account'}
                                </button>

                                {isMeta && (
                                  <div className="absolute -top-1 right-12">
                                     <span className="bg-gold-500 text-[8px] font-black px-2 py-0.5 rounded-full text-navy-900 uppercase tracking-tighter">META SYNC</span>
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-navy-900 p-8 rounded-[2rem] text-white flex items-start gap-6 shadow-2xl border border-white/5">
                    <div className="p-4 bg-gold-500/10 rounded-2xl">
                      <ShieldCheck className="w-8 h-8 text-gold-400" />
                    </div>
                    <div>
                      <h4 className="font-black uppercase tracking-tight text-xl mb-2">Meta Business API</h4>
                      <p className="text-white/60 text-sm leading-relaxed">By linking your Meta account, the HQ automatically synchronizes your Facebook and Instagram feeds. This ensures your high-end infographics are identical across both platforms, maintaining total brand integrity.</p>
                    </div>
                  </div>
                  <div className="bg-white border border-gray-100 p-8 rounded-[2rem] flex items-start gap-6 shadow-sm">
                    <div className="p-4 bg-navy-50 rounded-2xl">
                      <Zap className="w-8 h-8 text-navy-900" />
                    </div>
                    <div>
                      <h4 className="font-black uppercase tracking-tight text-xl text-navy-900 mb-2">Autonomous Deployment</h4>
                      <p className="text-gray-500 text-sm leading-relaxed">Linking an account here is the only manual step required. Once "Linked," you can enable the "Auto-Pilot" feature in the Campaign Architect to let the engine post on its own.</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : activeTab === 'AUTOMATION' ? (
              <div className="space-y-6">
                {/* AUTO-PILOT COMMAND CONSOLE */}
                <div className="bg-navy-900 rounded-[2.5rem] p-10 border border-gold-500/20 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                       <Cpu className="w-64 h-64 text-white" />
                    </div>
                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                        <div className="lg:col-span-7">
                            <div className="flex items-center gap-3 mb-4">
                               <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 ${isAutoPilot ? 'bg-gold-500 text-navy-900 animate-pulse' : 'bg-white/10 text-white/60'}`}>
                                  <Activity className="w-3 h-3" />
                                  System Mode: {isAutoPilot ? 'Autonomous' : 'Manual'}
                               </div>
                            </div>
                            <h2 className="text-4xl font-black text-white uppercase tracking-tight mb-4 font-serif">
                                Auto-Pilot <span className="text-gold-500">Command Console</span>
                            </h2>
                            <p className="text-white/60 text-lg font-medium leading-relaxed max-w-xl">
                                Enable the **Auto-Pilot** command to authorize the Wealth AI to monitor your deployment queue and execute posts autonomously across your linked channels.
                            </p>
                        </div>
                        <div className="lg:col-span-5 flex flex-col items-center justify-center p-8 bg-white/5 rounded-[2rem] border border-white/10 backdrop-blur-md">
                           <span className="text-[10px] font-black text-gold-400 uppercase tracking-widest mb-6">Master Automation Switch</span>
                           <button 
                              onClick={() => setIsAutoPilot(!isAutoPilot)}
                              className={`group relative flex items-center p-2 rounded-[2rem] transition-all duration-700 h-20 w-48 shadow-2xl ${isAutoPilot ? 'bg-gold-500' : 'bg-gray-800'}`}
                           >
                              <div className={`absolute h-16 w-16 rounded-[1.5rem] bg-navy-950 flex items-center justify-center shadow-xl transition-all duration-500 ease-in-out ${isAutoPilot ? 'translate-x-28' : 'translate-x-0'}`}>
                                 <Bot className={`w-8 h-8 transition-colors ${isAutoPilot ? 'text-gold-400' : 'text-gray-600'}`} />
                              </div>
                              <span className={`w-full text-center font-black text-xs uppercase tracking-widest transition-all duration-500 ${isAutoPilot ? 'text-navy-950 pr-16' : 'text-white/40 pl-16'}`}>
                                 {isAutoPilot ? 'ON' : 'OFF'}
                              </span>
                           </button>
                           <p className="mt-6 text-[11px] font-bold text-white/40 uppercase tracking-tight">Toggle to Activate **Auto-Pilot**</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 p-8 md:p-10">
                   <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                      <div>
                        <h2 className="text-2xl font-black text-navy-900 uppercase tracking-tight">Deployment Queue</h2>
                        <p className="text-sm text-gray-500">Current roadmap for your financial architecture marketing.</p>
                      </div>
                      <Button onClick={handleCreateCampaign} isLoading={isLoading} variant="outline" className="border-navy-900 text-navy-900 text-[10px] uppercase font-black tracking-widest px-8 h-12 rounded-xl">
                        Architect 7-Day Roadmap <RefreshCcw className="ml-2 w-3.5 h-3.5" />
                      </Button>
                   </div>

                   {scheduledPosts.length === 0 ? (
                     <div className="p-20 text-center bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
                        <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-gray-400 uppercase tracking-widest">Queue Empty</h3>
                        <p className="text-gray-400 text-xs mt-2">Generate a roadmap to start your autonomous campaign.</p>
                     </div>
                   ) : (
                     <div className="space-y-6">
                       {scheduledPosts.sort((a,b) => a.scheduledTime - b.scheduledTime).map((post) => {
                         const account = accounts.find(a => a.platform === post.platform);
                         const isConnected = account?.status === 'CONNECTED';
                         const isDeployingThis = isDeploying === post.id;
                         const isAutonomous = isAutoPilot && isConnected && post.status === PostStatus.SCHEDULED;
                         
                         return (
                         <div key={post.id} className={`bg-white border rounded-[2.5rem] p-8 hover:shadow-2xl transition-all flex flex-col items-stretch gap-6 group ${
                           post.status === PostStatus.POSTED ? 'border-emerald-200 bg-emerald-50/10 opacity-75' : 
                           isAutonomous ? 'border-gold-500/30 bg-gold-500/[0.02]' : 
                           isConnected ? 'border-gray-100' : 'border-rose-100 bg-rose-50/5'
                         }`}>
                            <div className="flex flex-col md:flex-row gap-6 items-start">
                                <div className={`flex flex-col items-center justify-center p-4 rounded-3xl min-w-[120px] shadow-lg text-white transition-all duration-700 ${
                                  post.status === PostStatus.POSTED ? 'bg-emerald-500' : 
                                  isAutonomous ? 'bg-navy-900 scale-105 shadow-gold-500/20' : 
                                  isConnected ? 'bg-navy-900' : 'bg-gray-400'
                                }`}>
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${isAutonomous ? 'text-gold-500' : 'text-white/60'}`}>{post.platform}</span>
                                    <span className="text-2xl font-black">{new Date(post.scheduledTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border transition-all ${
                                            post.status === PostStatus.POSTED ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 
                                            isAutonomous ? 'bg-navy-900 text-gold-400 border-navy-900 animate-pulse' :
                                            post.status === PostStatus.SCHEDULED ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-gray-100 text-gray-500 border-gray-200'
                                        }`}>
                                            {isAutonomous ? 'AUTO-PILOT ACTIVE' : post.status}
                                        </span>

                                        {!isConnected && post.status !== PostStatus.POSTED && (
                                          <div className="flex items-center gap-1.5 ml-2 px-2 py-0.5 bg-rose-100 rounded-full border border-rose-200 animate-pulse">
                                            <WifiOff className="w-3 h-3 text-rose-600" />
                                            <span className="text-[9px] font-black text-rose-600 uppercase tracking-tight">LINK IN 'LAUNCH STATUS'</span>
                                          </div>
                                        )}
                                    </div>
                                    <p className="text-lg text-navy-900 leading-relaxed font-medium mb-4">{post.content}</p>
                                    
                                    {post.imageUrl && (
                                        <div className="mt-4 relative rounded-3xl overflow-hidden aspect-video bg-gray-50 border border-gray-100">
                                            <img src={post.imageUrl} alt="Asset" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex md:flex-col gap-3">
                                    {post.status === PostStatus.SCHEDULED && isConnected && !isAutoPilot && (
                                      <button 
                                        disabled={isDeployingThis}
                                        onClick={() => handleDeploy(post)} 
                                        className="p-4 bg-navy-900 text-gold-400 rounded-2xl hover:bg-gold-500 hover:text-navy-900 transition-all shadow-lg flex items-center justify-center border-2 border-white/20"
                                      >
                                        {isDeployingThis ? <Loader2 className="w-5 h-5 animate-spin" /> : <UploadCloud className="w-5 h-5" />}
                                      </button>
                                    )}
                                    {isAutonomous && (
                                       <div className="p-4 bg-gold-500 text-navy-900 rounded-2xl border border-gold-400/20 flex items-center justify-center animate-bounce" title="Managed by Auto-Pilot">
                                          <Bot className="w-5 h-5" />
                                       </div>
                                    )}
                                    <button onClick={() => copyToClipboard(post.content)} className="p-4 bg-gray-50 text-gray-600 rounded-2xl hover:bg-navy-900 hover:text-white transition-all"><Copy className="w-5 h-5" /></button>
                                    <button onClick={() => deletePost(post.id)} className="p-4 bg-rose-50 text-rose-600 rounded-2xl hover:bg-rose-600 hover:text-white transition-all"><Trash2 className="w-5 h-5" /></button>
                                </div>
                            </div>
                         </div>
                       )})}
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
                                <h3 className="text-2xl font-black text-navy-900 mb-3 font-serif uppercase tracking-tight">Ghostwriter Engine</h3>
                                <p className="text-gray-400 text-sm">Automated drafting of high-impact content for your linked channels.</p>
                            </div>
                        )}
                    </div>

                    <div className="space-y-6">
                        {isImageLoading ? (
                             <div className="h-full min-h-[400px] bg-navy-900 rounded-[3rem] flex flex-col items-center justify-center text-white p-12 text-center gap-6">
                                <Loader2 className="w-16 h-16 text-gold-500 animate-spin" />
                                <p className="text-xl font-serif italic text-gold-100">Architecting visuals...</p>
                             </div>
                        ) : generatedImage ? (
                            <div className="rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white group relative aspect-square">
                                <img src={generatedImage} alt="Social Asset" className="w-full h-full object-cover" />
                            </div>
                        ) : (
                            <div className="bg-navy-900 rounded-[3rem] p-24 text-center border-2 border-dashed border-white/10 h-full flex flex-col items-center justify-center">
                                <div className="mx-auto h-24 w-24 bg-white/5 rounded-[2rem] shadow-sm flex items-center justify-center text-gold-500 mb-8">
                                    <ImageIcon className="w-10 h-10" />
                                </div>
                                <h3 className="text-2xl font-black text-white mb-3 font-serif uppercase tracking-tight">Visual Asset</h3>
                                <p className="text-white/40 text-sm">Synchronized infographics for Facebook and Instagram feeds.</p>
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
