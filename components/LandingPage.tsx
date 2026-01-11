import React, { useState } from 'react';
import { BookDetails, ChatMessage } from '../types';
import { chatWithBook } from '../services/geminiService';
import { Button } from './ui/Button';
import { 
  TrendingUp, 
  Send, 
  ExternalLink, 
  ArrowRight,
  Download,
  Calculator,
  ShieldCheck,
  Zap,
  CheckCircle2,
  FileText,
  X,
  ChevronRight,
  Lightbulb,
  Printer,
  Copy,
  Sparkles,
  DownloadCloud,
  Heart,
  Globe,
  Users,
  Home as HomeIcon
} from 'lucide-react';

interface LandingPageProps {
  book: BookDetails;
}

export const LandingPage: React.FC<LandingPageProps> = ({ book }) => {
  // Navigation & Modal System
  const [activeModal, setActiveModal] = useState<string | null>(null);
  
  // Chat State
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { role: 'model', text: `Hi! I'm the AI mentor for "${book.title}". Ask me anything about building your financial architecture!` }
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Calculator State
  const [income, setIncome] = useState<number>(5000);
  
  // Checklist State
  const [checkedItems, setCheckedItems] = useState<number[]>([]);

  // Vision Blueprint State (Modal)
  const [visionInput, setVisionInput] = useState('');
  const [visionResult, setVisionResult] = useState('');
  const [isVisionLoading, setIsVisionLoading] = useState(false);

  // Architect Tool State (In-page)
  const [architectGoal, setArchitectGoal] = useState('');
  const [architectResult, setArchitectResult] = useState('');
  const [isArchitectLoading, setIsArchitectLoading] = useState(false);

  const auditScore = Math.round((checkedItems.length / 10) * 100);

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatInput('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsChatLoading(true);
    const apiHistory = chatHistory.map(msg => ({ role: msg.role, parts: [{ text: msg.text }] }));
    const response = await chatWithBook(book, userMsg, apiHistory as any);
    setChatHistory(prev => [...prev, { role: 'model', text: response }]);
    setIsChatLoading(false);
  };

  const handleVisionGenerate = async () => {
    if (!visionInput.trim()) return;
    setIsVisionLoading(true);
    const prompt = `Create a "Vision Blueprint" for someone whose life legacy goal is: "${visionInput}". Structure it into 5 pillars: Physical, Emotional, Spiritual, Social, and Financial. Use a professional, architect-inspired tone.`;
    const response = await chatWithBook(book, prompt, []);
    setVisionResult(response);
    setIsVisionLoading(false);
  };

  const handleArchitectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!architectGoal.trim()) return;
    setIsArchitectLoading(true);
    const response = await chatWithBook(book, `Design a detailed financial blueprint for this goal: "${architectGoal}". Structure it as a professional architect's report with Phase 1, 2, and 3.`, []);
    setArchitectResult(response);
    setIsArchitectLoading(false);
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const asin = "B0FN334YXZ";
  const coverImageUrl = `https://m.media-amazon.com/images/P/${asin}.01.20.LZZZZZZZ.jpg`;

  const resources = [
    {
      id: 'calc',
      title: "The 70-10-10-10 Tracker",
      description: "Interactive live calculator to instantly architect your monthly cash flow.",
      icon: Calculator,
      type: "Interactive Web Tool",
      color: "bg-blue-50 text-blue-600"
    },
    {
      id: 'guard',
      title: "Wealth Guard Checklist",
      description: "A digital security audit to score your investment safety and structural integrity.",
      icon: ShieldCheck,
      type: "Interactive Audit",
      color: "bg-emerald-50 text-emerald-600"
    },
    {
      id: 'vision',
      title: "The Vision Blueprint",
      description: "Proprietary framework for visualizing your legacy and financial architecture.",
      icon: FileText,
      type: "AI Generator",
      color: "bg-purple-50 text-purple-600"
    }
  ];

  const charities = [
    {
      name: "Angel's Hope",
      desc: "Architecting a better future for animals through community-based rescue and educational programs.",
      url: "https://www.angelshope.org/",
      icon: Heart,
      color: "bg-rose-50 text-rose-600"
    },
    {
      name: "Wounded Warrior Project",
      desc: "Providing the structural support and resources our nation's veterans need to thrive in civilian life.",
      url: "https://www.woundedwarriorproject.org/",
      icon: Users,
      color: "bg-white text-navy-900"
    },
    {
      name: "Habitat for Humanity",
      desc: "Building literal foundations for families, because everyone deserves a safe place to call home.",
      url: "https://www.habitat.org/",
      icon: HomeIcon,
      color: "bg-emerald-50 text-emerald-700"
    }
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-gold-200">
      {/* MODAL SYSTEM */}
      {activeModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-navy-950/90 backdrop-blur-md" onClick={() => setActiveModal(null)}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-xl font-black text-navy-900 uppercase tracking-tight">
                {activeModal === 'calc' && "Financial Architecture Calculator"}
                {activeModal === 'guard' && "Investment Security Audit"}
                {activeModal === 'vision' && "Legacy Vision Architect"}
              </h3>
              <button onClick={() => setActiveModal(null)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="p-8 max-h-[75vh] overflow-y-auto scrollbar-hide">
              {activeModal === 'calc' && (
                <div className="space-y-8">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-400 mb-4 tracking-widest">Monthly Net Income ($)</label>
                    <input 
                      type="number" 
                      value={income} 
                      onChange={(e) => setIncome(Number(e.target.value))}
                      className="w-full text-4xl font-black text-navy-900 outline-none border-b-4 border-gold-500 pb-2 mb-8 focus:border-navy-900 transition-colors"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                      <div className="text-[10px] font-black text-blue-600 uppercase mb-2">Living (70%)</div>
                      <div className="text-3xl font-black text-navy-900">${(income * 0.7).toFixed(0)}</div>
                    </div>
                    <div className="p-6 bg-gold-50 rounded-3xl border border-gold-100">
                      <div className="text-[10px] font-black text-gold-700 uppercase mb-2">Investment (10%)</div>
                      <div className="text-3xl font-black text-navy-900">${(income * 0.1).toFixed(0)}</div>
                    </div>
                    <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100">
                      <div className="text-[10px] font-black text-emerald-700 uppercase mb-2">Savings (10%)</div>
                      <div className="text-3xl font-black text-navy-900">${(income * 0.1).toFixed(0)}</div>
                    </div>
                    <div className="p-6 bg-purple-50 rounded-3xl border border-purple-100">
                      <div className="text-[10px] font-black text-purple-700 uppercase mb-2">Giving/Debt (10%)</div>
                      <div className="text-3xl font-black text-navy-900">${(income * 0.1).toFixed(0)}</div>
                    </div>
                  </div>
                  <Button onClick={() => window.print()} className="w-full h-14 bg-navy-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest">
                    Save Blueprint <Printer className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              )}

              {activeModal === 'guard' && (
                <div className="space-y-6">
                  <div className="mb-8 p-6 bg-navy-900 rounded-[2rem] text-center">
                    <div className="text-[10px] font-black uppercase text-gold-400 mb-2">Structural Security Score</div>
                    <div className="text-5xl font-black text-white">{auditScore}%</div>
                    <div className="mt-4 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gold-500 transition-all duration-1000" style={{ width: `${auditScore}%` }}></div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {[
                      "All high-interest debt eliminated",
                      "Emergency fund covers 6 months expenses",
                      "Diversified across at least 3 asset classes",
                      "Will & Estate plan legally verified",
                      "Investment fees are below 1% annually",
                      "Passive income covers at least 10% of needs",
                      "Proper life & disability insurance in place",
                      "Annual budget audit completed",
                      "Multiple income streams (min 2)",
                      "Wealth protection 'Law 4' fully implemented"
                    ].map((item, idx) => (
                      <button 
                        key={idx}
                        onClick={() => setCheckedItems(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx])}
                        className={`w-full flex items-center p-5 rounded-2xl border transition-all text-left ${
                          checkedItems.includes(idx) ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-gray-100'
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-lg mr-4 flex items-center justify-center border-2 ${
                          checkedItems.includes(idx) ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-200'
                        }`}>
                          {checkedItems.includes(idx) && <CheckCircle2 className="w-4 h-4" />}
                        </div>
                        <span className="font-bold text-sm">{item}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeModal === 'vision' && (
                <div className="space-y-6">
                  {!visionResult ? (
                    <div className="text-center space-y-6">
                      <div className="w-20 h-20 bg-purple-50 text-purple-600 rounded-3xl flex items-center justify-center mx-auto">
                        <Sparkles className="w-10 h-10" />
                      </div>
                      <h4 className="text-2xl font-black text-navy-900 uppercase">Legacy Blueprint AI</h4>
                      <p className="text-gray-500 font-medium px-4">
                        What is your primary long-term legacy goal? Describe your vision for your family, career, and community.
                      </p>
                      <textarea 
                        value={visionInput}
                        onChange={(e) => setVisionInput(e.target.value)}
                        placeholder="e.g. Build a foundation for local schools and leave a debt-free estate for my children..."
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-6 text-navy-900 placeholder-gray-400 outline-none focus:border-purple-500 transition-colors min-h-[120px] font-medium"
                      />
                      <Button 
                        isLoading={isVisionLoading} 
                        onClick={handleVisionGenerate} 
                        disabled={!visionInput.trim()}
                        className="w-full h-16 bg-navy-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest"
                      >
                        Architect My Vision <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                       <div className="bg-purple-50 border border-purple-100 p-8 rounded-[2rem]">
                         <div className="flex items-center gap-3 mb-6 text-purple-700">
                           <FileText className="w-5 h-5" />
                           <span className="text-[10px] font-black uppercase tracking-widest">Architect's Legacy Report</span>
                         </div>
                         <div className="text-sm text-gray-800 leading-relaxed font-medium whitespace-pre-wrap">
                           {visionResult}
                         </div>
                       </div>
                       <div className="flex gap-4">
                         <Button onClick={() => setVisionResult('')} variant="outline" className="flex-1 h-14 rounded-2xl text-xs uppercase font-black tracking-widest">
                           New Vision
                         </Button>
                         <Button className="flex-1 h-14 bg-navy-900 text-white rounded-2xl text-xs uppercase font-black tracking-widest">
                           Download PDF <DownloadCloud className="ml-2 w-4 h-4" />
                         </Button>
                       </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* NAVIGATION */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-8">
              <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="text-xl font-black text-navy-900 tracking-tighter font-serif uppercase">
                Rich By Design<span className="text-gold-500">HQ</span>
              </button>
              <div className="hidden lg:flex items-center space-x-8">
                <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="text-[11px] font-black uppercase tracking-widest text-gray-500 hover:text-navy-900 transition-colors">Home</button>
                <button onClick={() => scrollTo('book-section')} className="text-[11px] font-black uppercase tracking-widest text-gray-500 hover:text-navy-900 transition-colors">Book</button>
                <button onClick={() => scrollTo('resources-section')} className="text-[11px] font-black uppercase tracking-widest text-gray-500 hover:text-navy-900 transition-colors">Resources</button>
                <button onClick={() => scrollTo('giving-section')} className="text-[11px] font-black uppercase tracking-widest text-gray-500 hover:text-navy-900 transition-colors">Giving</button>
                <button onClick={() => scrollTo('ai-preview')} className="text-[11px] font-black uppercase tracking-widest text-gray-500 hover:text-navy-900 transition-colors">AI Mentor</button>
              </div>
            </div>
            <Button onClick={() => window.open(book.amazonLink, '_blank')} className="bg-navy-900 text-white px-6 h-10 text-[10px] font-black uppercase tracking-widest rounded-xl">
              Buy Now
            </Button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="pt-44 pb-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-gold-50 text-gold-700 text-[10px] font-black uppercase mb-8 border border-gold-100">
                <TrendingUp className="w-3.5 h-3.5 mr-2" /> Financial Architect HQ
              </div>
              <h1 className="text-5xl lg:text-7xl font-black text-navy-900 font-serif leading-tight mb-8 uppercase tracking-tighter">
                {book.title}: <br/>
                <span className="text-gold-500 italic lowercase font-sans font-medium block">{book.subtitle}</span>
              </h1>
              <p className="text-xl text-gray-500 max-w-2xl leading-relaxed mb-10 font-medium">{book.description}</p>
              <div className="flex flex-wrap gap-5">
                <Button onClick={() => window.open(book.amazonLink, '_blank')} className="px-10 h-16 text-xs font-black uppercase tracking-widest bg-navy-900 text-white rounded-2xl shadow-2xl">
                  Order Blueprint <ExternalLink className="ml-2 w-4 h-4" />
                </Button>
                <Button onClick={() => scrollTo('resources-section')} variant="outline" className="px-10 h-16 text-xs font-black uppercase tracking-widest border-2 border-gray-100 text-navy-900 hover:bg-gray-50 rounded-2xl">
                  Access Free Tools
                </Button>
              </div>
            </div>
            <div className="mt-20 lg:mt-0 lg:col-span-5 perspective-1000 flex justify-center lg:justify-end">
              <div className="relative group transition-all duration-700 hover:scale-105" style={{ transform: 'rotateY(-22deg) rotateX(4deg)' }}>
                <div className="absolute -inset-10 bg-gold-400/20 blur-[100px] rounded-full"></div>
                <img src={coverImageUrl} className="w-72 h-[450px] object-cover shadow-[25px_35px_80px_rgba(0,0,0,0.5)] rounded-r-lg border-r border-white/20" alt="Book Cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RESOURCES SECTION */}
      <section id="resources-section" className="py-32 bg-gray-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="mb-20">
            <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-gold-600 mb-4">The Toolkit</h2>
            <h3 className="text-4xl lg:text-5xl font-black text-navy-900 font-serif uppercase tracking-tight mb-6 leading-none">
              Architect Your <span className="text-gold-500 lowercase italic font-sans font-medium">Resources</span>
            </h3>
            <p className="text-lg text-gray-500 font-medium max-w-2xl">
              Designing wealth requires functional instruments. Use these live tools to start implementing the Seven Laws today.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
            {resources.map((res, idx) => (
              <div key={idx} className="group bg-white p-10 rounded-[2.5rem] border border-gray-100 hover:border-gold-300 transition-all hover:shadow-2xl flex flex-col h-full">
                <div className={`w-14 h-14 ${res.color} rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform`}>
                  <res.icon className="w-6 h-6" />
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest text-gold-600 mb-2">{res.type}</div>
                <h4 className="text-xl font-black text-navy-900 mb-4 uppercase tracking-tight">{res.title}</h4>
                <p className="text-gray-500 text-sm font-medium leading-relaxed mb-8 flex-grow">{res.description}</p>
                <button 
                  onClick={() => setActiveModal(res.id)}
                  className="w-full py-4 bg-navy-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-gold-500 hover:text-navy-900 transition-all"
                >
                  Launch Tool <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEVEN LAWS SECTION */}
      <section id="book-section" className="py-32 bg-white relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-20">
            <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-gold-600 mb-4">The Blueprint</h2>
            <h3 className="text-4xl lg:text-5xl font-black text-navy-900 font-serif uppercase tracking-tight">The Seven Laws of Money</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {book.keyTakeaways.map((law, idx) => (
              <div key={idx} className="bg-gray-50 p-10 rounded-[2.5rem] border border-gray-100 hover:border-gold-300 transition-all hover:shadow-xl group">
                <div className="w-14 h-14 bg-navy-900 text-gold-400 rounded-2xl flex items-center justify-center mb-8 font-black text-2xl group-hover:bg-gold-500 group-hover:text-navy-900 transition-colors">
                  {idx + 1}
                </div>
                <h4 className="text-xl font-black text-navy-900 mb-4 uppercase tracking-tight">{law.split('.')[0]}</h4>
                <p className="text-gray-500 font-medium leading-relaxed">{law.split('.')[1]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GIVING SECTION */}
      <section id="giving-section" className="py-32 bg-navy-900 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="flex flex-col lg:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-gold-500 mb-4">The Tenth Law</h2>
              <h3 className="text-4xl lg:text-5xl font-black text-white font-serif uppercase tracking-tight leading-none mb-6">
                Design Your <span className="text-gold-400 lowercase italic font-sans font-medium">Impact</span>
              </h3>
              <p className="text-lg text-white/90 font-medium">
                True wealth architecture isn't just about what you keep—it's about what you build for others. Philanthropy is the capstone of a rich design.
              </p>
            </div>
            <div className="hidden lg:flex items-center gap-4 bg-white/5 p-4 rounded-3xl border border-white/10">
              <Globe className="w-6 h-6 text-gold-400" />
              <span className="text-xs font-black text-white uppercase tracking-widest">Global Philanthropic Network</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {charities.map((charity, idx) => (
              <div key={idx} className="bg-white/5 backdrop-blur-sm p-10 rounded-[3rem] border border-white/10 hover:border-gold-500/50 transition-all hover:-translate-y-2 group">
                <div className={`w-16 h-16 ${charity.color} rounded-[1.5rem] flex items-center justify-center mb-8 shadow-xl transition-transform group-hover:rotate-6`}>
                  <charity.icon className="w-8 h-8" />
                </div>
                <h4 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">{charity.name}</h4>
                <p className="text-white/80 text-sm font-medium leading-relaxed mb-10 min-h-[80px]">
                  {charity.desc}
                </p>
                <button 
                  onClick={() => window.open(charity.url, '_blank')}
                  className="w-full py-5 bg-white text-navy-900 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-gold-500 transition-all"
                >
                  Contribute Now <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI MENTOR SECTION */}
      <section id="ai-preview" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="lg:w-1/2">
                <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-navy-400 mb-4">Interactive Intelligence</h2>
                <h3 className="text-5xl font-black text-navy-900 font-serif mb-8 uppercase tracking-tighter">
                    Consult the <span className="text-gold-500">Wealth AI</span>
                </h3>
                <p className="text-xl text-gray-500 leading-relaxed mb-10 font-medium">
                    The book's philosophy is alive. Ask the AI mentor how to apply the Wealth Laws to your specific life situation.
                </p>
                <div className="flex items-center gap-4 text-navy-900">
                   <div className="w-10 h-10 rounded-full bg-gold-50 flex items-center justify-center">
                     <TrendingUp className="w-5 h-5 text-gold-600" />
                   </div>
                   <span className="font-bold text-sm uppercase tracking-widest">Real-time Financial Guidance</span>
                </div>
            </div>
            
            <div className="lg:w-1/2 w-full">
              <div className="bg-navy-950 rounded-[3rem] shadow-[0_40px_100px_rgba(16,42,67,0.2)] overflow-hidden border border-white/5">
                <div className="h-[450px] p-8 overflow-y-auto flex flex-col space-y-6 bg-gradient-to-b from-navy-900 to-navy-950 scrollbar-hide">
                  {chatHistory.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] rounded-3xl px-6 py-4 text-sm font-medium leading-relaxed ${
                        msg.role === 'user' 
                          ? 'bg-gold-500 text-navy-900 rounded-br-none' 
                          : 'bg-white/10 border border-white/10 text-white rounded-bl-none'
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {isChatLoading && (
                    <div className="flex justify-start">
                       <div className="bg-white/10 border border-white/10 px-6 py-4 rounded-3xl rounded-bl-none">
                         <div className="flex space-x-2">
                           <div className="w-2 h-2 bg-gold-400 rounded-full animate-bounce"></div>
                           <div className="w-2 h-2 bg-gold-400 rounded-full animate-bounce delay-75"></div>
                           <div className="w-2 h-2 bg-gold-400 rounded-full animate-bounce delay-150"></div>
                         </div>
                       </div>
                    </div>
                  )}
                </div>
                <div className="p-6 bg-navy-900">
                  <form onSubmit={handleChatSubmit} className="flex gap-3">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Ask the Wealth AI..."
                      className="flex-1 bg-white/5 border border-white/10 text-white rounded-2xl px-6 py-4 outline-none focus:border-gold-500 transition-colors"
                    />
                    <button type="submit" disabled={isChatLoading || !chatInput.trim()} className="bg-gold-500 text-navy-900 font-black p-4 rounded-2xl transition-all shadow-lg hover:scale-105">
                      <Send className="w-5 h-5" />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="py-32 bg-gray-50 relative overflow-hidden text-center">
        <div className="max-w-4xl mx-auto px-6 relative z-10">
            <h2 className="text-4xl lg:text-6xl font-black text-navy-900 font-serif uppercase tracking-tighter mb-8 leading-tight">
                Stop Surviving. <br/>
                <span className="text-gold-500 italic">Start Designing.</span>
            </h2>
            <Button onClick={() => window.open(book.amazonLink, '_blank')} className="h-20 bg-navy-900 text-white px-16 text-lg rounded-3xl font-black uppercase tracking-widest shadow-2xl hover:scale-105 transition-transform flex items-center justify-center gap-3 mx-auto">
                Secure Your Copy <ArrowRight className="w-6 h-6" />
            </Button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white py-12 border-t border-gray-100 text-center">
        <div className="text-sm font-black text-navy-900 tracking-tighter uppercase mb-2">Rich By Design<span className="text-gold-500">HQ</span></div>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">© 2025 {book.author}. All Rights Reserved.</p>
      </footer>
    </div>
  );
};
