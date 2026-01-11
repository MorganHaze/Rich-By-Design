import React, { useState, useMemo } from 'react';
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
  Plus,
  Info,
  ChevronRight,
  Lightbulb,
  Printer,
  Copy
} from 'lucide-react';

interface LandingPageProps {
  book: BookDetails;
}

export const LandingPage: React.FC<LandingPageProps> = ({ book }) => {
  // Navigation & General UI
  const [activeModal, setActiveModal] = useState<string | null>(null);
  
  // Chat State
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { role: 'model', text: `Hi! I'm the AI mentor for "${book.title}". Ask me anything about building your financial architecture!` }
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  // 70-10-10-10 Calculator State
  const [income, setIncome] = useState<number>(5000);
  
  // Wealth Guard Checklist State
  const [checkedItems, setCheckedItems] = useState<number[]>([]);

  // Architect Tool State (In-section)
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
      type: "Template",
      color: "bg-purple-50 text-purple-600"
    }
  ];

  const toggleCheck = (id: number) => {
    setCheckedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

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
                {activeModal === 'vision' && "The Vision Blueprint Framework"}
              </h3>
              <button onClick={() => setActiveModal(null)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="p-8 max-h-[70vh] overflow-y-auto scrollbar-hide">
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
                      <p className="text-xs text-gray-500 mt-2 font-medium">Rent, utilities, food, lifestyle.</p>
                    </div>
                    <div className="p-6 bg-gold-50 rounded-3xl border border-gold-100">
                      <div className="text-[10px] font-black text-gold-700 uppercase mb-2">Investment (10%)</div>
                      <div className="text-3xl font-black text-navy-900">${(income * 0.1).toFixed(0)}</div>
                      <p className="text-xs text-gray-500 mt-2 font-medium">Wealth building architecture.</p>
                    </div>
                    <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100">
                      <div className="text-[10px] font-black text-emerald-700 uppercase mb-2">Savings (10%)</div>
                      <div className="text-3xl font-black text-navy-900">${(income * 0.1).toFixed(0)}</div>
                      <p className="text-xs text-gray-500 mt-2 font-medium">Emergency structural guard.</p>
                    </div>
                    <div className="p-6 bg-purple-50 rounded-3xl border border-purple-100">
                      <div className="text-[10px] font-black text-purple-700 uppercase mb-2">Giving/Debt (10%)</div>
                      <div className="text-3xl font-black text-navy-900">${(income * 0.1).toFixed(0)}</div>
                      <p className="text-xs text-gray-500 mt-2 font-medium">Community & Structural repair.</p>
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
                        onClick={() => toggleCheck(idx)}
                        className={`w-full flex items-center p-5 rounded-2xl border transition-all text-left group ${
                          checkedItems.includes(idx) ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-white border-gray-100 hover:border-navy-200 text-gray-600'
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-lg mr-4 flex items-center justify-center border-2 transition-colors ${
                          checkedItems.includes(idx) ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-200 group-hover:border-navy-900'
                        }`}>
                          {checkedItems.includes(idx) && <CheckCircle2 className="w-4 h-4" />}
                        </div>
                        <span className="font-bold text-sm tracking-tight">{item}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeModal === 'vision' && (
                <div className="space-y-6 text-center">
                  <div className="w-20 h-20 bg-purple-50 text-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <FileText className="w-10 h-10" />
                  </div>
                  <h4 className="text-2xl font-black text-navy-900 uppercase">The Legacy Template</h4>
                  <p className="text-gray-500 font-medium">
                    This proprietary framework allows you to map your wealth across 5 dimensions: Physical, Emotional, Spiritual, Social, and Financial.
                  </p>
                  <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100 text-left space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-xs font-black">1</div>
                      <span className="text-sm font-bold text-navy-900">Download the PDF Framework</span>
                    </div>
                    <div className="flex items-center gap-3 opacity-50">
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-xs font-black">2</div>
                      <span className="text-sm font-bold text-navy-900">Schedule Your Design Session</span>
                    </div>
                  </div>
                  <Button className="w-full h-16 bg-navy-900 text-white rounded-2xl text-sm font-black uppercase tracking-widest mt-6">
                    Get Template Now <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
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
                <button onClick={() => scrollTo('resources-section')} className="text-[11px] font-black uppercase tracking-widest text-navy-900 border-b-2 border-gold-500">Resources</button>
                <button onClick={() => scrollTo('ai-preview')} className="text-[11px] font-black uppercase tracking-widest text-gray-500 hover:text-navy-900 transition-colors">AI Mentor</button>
              </div>
            </div>
            <div className="flex gap-4">
              <Button onClick={() => window.open(book.amazonLink, '_blank')} className="bg-navy-900 hover:bg-navy-950 text-white rounded-xl px-6 py-2.5 h-auto text-[10px] font-black uppercase tracking-widest shadow-xl shadow-navy-900/10">
                Buy Now
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="pt-44 pb-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-gold-50 text-gold-700 text-[10px] font-black uppercase tracking-widest mb-8 border border-gold-100">
                <TrendingUp className="w-3.5 h-3.5 mr-2" /> Financial Architect HQ
              </div>
              <h1 className="text-5xl lg:text-7xl font-black text-navy-900 font-serif leading-tight tracking-tight mb-8 uppercase">
                {book.title}: <br/>
                <span className="text-gold-500 italic lowercase font-sans font-medium block">{book.subtitle}</span>
              </h1>
              <p className="text-xl text-gray-500 max-w-2xl leading-relaxed mb-10 font-medium">{book.description}</p>
              <div className="flex flex-wrap gap-5">
                <Button onClick={() => window.open(book.amazonLink, '_blank')} className="px-10 h-16 text-xs font-black uppercase tracking-widest bg-navy-900 text-white rounded-2xl shadow-2xl">
                  Order Blueprint <ExternalLink className="ml-2 w-4 h-4" />
                </Button>
                <Button onClick={() => scrollTo('resources-section')} className="px-10 h-16 text-xs font-black uppercase tracking-widest border-2 border-gray-100 text-navy-900 hover:bg-gray-50 rounded-2xl">
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
            <h3 className="text-4xl lg:text-5xl font-black text-navy-900 font-serif uppercase tracking-tight leading-none mb-6">
              Architect Your <span className="text-gold-500 lowercase italic font-sans font-medium">Resources</span>
            </h3>
            <p className="text-lg text-gray-500 font-medium max-w-2xl">
              Designing wealth requires functional instruments. Use these live tools to start implementing the Seven Laws today.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
            {resources.map((res, idx) => (
              <div key={idx} className="group bg-white p-10 rounded-[2.5rem] border border-gray-100 hover:border-gold-300 transition-all hover:shadow-2xl flex flex-col items-start h-full">
                <div className={`w-14 h-14 ${res.color} rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform`}>
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

          {/* CUSTOM ARCHITECT TOOL (IN-PAGE) */}
          <div className="bg-navy-900 rounded-[3.5rem] p-8 md:p-16 relative overflow-hidden shadow-2xl">
            <div className="relative z-10 lg:flex gap-16 items-center">
              <div className="lg:w-2/5 mb-12 lg:mb-0">
                <div className="w-12 h-12 bg-gold-500 text-navy-900 rounded-2xl flex items-center justify-center mb-6">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-3xl font-black text-white font-serif uppercase tracking-tight mb-6">Wealth <span className="text-gold-400 italic lowercase font-sans">Blueprint</span> AI</h3>
                <p className="text-navy-200 font-medium mb-8">Input your objective and the AI will architect a 3-phase structural blueprint based on the book's core laws.</p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-gold-400">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="text-xs font-black uppercase tracking-widest">Instant Personalization</span>
                  </div>
                </div>
              </div>
              <div className="lg:w-3/5">
                <div className="bg-white/5 backdrop-blur-md rounded-[2.5rem] border border-white/10 p-8">
                  <form onSubmit={handleArchitectSubmit} className="space-y-6">
                    <div className="relative">
                      <input 
                        type="text" 
                        value={architectGoal}
                        onChange={(e) => setArchitectGoal(e.target.value)}
                        placeholder="e.g. Retire at 50 with passive income..."
                        className="w-full bg-white/10 border border-white/10 rounded-2xl px-6 py-5 text-white placeholder-white/20 outline-none focus:border-gold-500 transition-colors font-medium"
                      />
                    </div>
                    <Button isLoading={isArchitectLoading} disabled={!architectGoal.trim()} className="w-full h-16 bg-gold-500 hover:bg-gold-400 text-navy-900 rounded-2xl font-black uppercase text-xs tracking-widest">
                      Generate Blueprint <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </form>
                  {architectResult && (
                    <div className="mt-8 p-6 bg-white/5 rounded-2xl border border-white/10 animate-in fade-in slide-in-from-bottom-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Lightbulb className="w-4 h-4 text-gold-400" />
                          <span className="text-[10px] font-black uppercase text-white tracking-widest">Architect's Report</span>
                        </div>
                        <button onClick={() => {navigator.clipboard.writeText(architectResult); alert('Blueprint Copied!')}} className="text-white/50 hover:text-gold-400">
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-sm text-navy-100 leading-relaxed font-medium whitespace-pre-wrap max-h-48 overflow-y-auto scrollbar-hide">
                        {architectResult}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
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
