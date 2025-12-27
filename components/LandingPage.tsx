import React, { useState } from 'react';
import { BookDetails, ChatMessage } from '../types';
import { chatWithBook } from '../services/geminiService';
import { Button } from './ui/Button';
import { 
  TrendingUp, 
  Send, 
  ExternalLink, 
  ArrowRight
} from 'lucide-react';

interface LandingPageProps {
  book: BookDetails;
}

export const LandingPage: React.FC<LandingPageProps> = ({ book }) => {
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { role: 'model', text: `Hi! I'm the AI mentor for "${book.title}". You're not behind. You're just starting. Ask me anything about building your financial architecture!` }
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setChatInput('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsChatLoading(true);

    const apiHistory = chatHistory.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    const response = await chatWithBook(book, userMsg, apiHistory);
    
    setChatHistory(prev => [...prev, { role: 'model', text: response }]);
    setIsChatLoading(false);
  };

  const handleBuyClick = () => {
    if (book.amazonLink) {
      window.open(book.amazonLink, '_blank');
    }
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Official Amazon Image URL for B0FN334YXZ
  const asin = "B0FN334YXZ";
  const coverImageUrl = `https://m.media-amazon.com/images/P/${asin}.01.20.LZZZZZZZ.jpg`;

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-gold-200">
      {/* Premium Navigation */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-8">
              <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="text-xl font-black text-navy-900 tracking-tighter font-serif uppercase">
                Rich By Design<span className="text-gold-500">HQ</span>
              </button>
              <div className="hidden lg:flex items-center space-x-8">
                <button className="text-[11px] font-black uppercase tracking-widest text-navy-900 border-b-2 border-gold-500">Home</button>
                <button onClick={() => scrollTo('book-section')} className="text-[11px] font-black uppercase tracking-widest text-gray-500 hover:text-navy-900 transition-colors">Book</button>
                <button className="text-[11px] font-black uppercase tracking-widest text-gray-500 hover:text-navy-900 transition-colors">Resources</button>
                <button className="text-[11px] font-black uppercase tracking-widest text-gray-500 hover:text-navy-900 transition-colors">Giving Back</button>
              </div>
            </div>
            <div className="flex gap-4">
                <Button onClick={handleBuyClick} className="bg-navy-900 hover:bg-navy-950 text-white rounded-xl px-6 py-2.5 h-auto text-xs font-black uppercase tracking-widest shadow-xl shadow-navy-900/10">
                  Buy the Book
                </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-44 pb-24 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full opacity-5 pointer-events-none">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
            <div className="lg:col-span-7 z-10 relative">
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-gold-50 text-gold-700 text-[10px] font-black uppercase tracking-widest mb-8 border border-gold-100 shadow-sm">
                <TrendingUp className="w-3.5 h-3.5 mr-2" />
                Wealth Architecture Revealed
              </div>
              <h1 className="text-5xl lg:text-7xl font-black text-navy-900 font-serif leading-[1.05] tracking-tight mb-8 uppercase">
                {book.title}: <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-navy-900 via-navy-700 to-gold-600 italic font-medium font-sans block mt-2 normal-case">
                  {book.subtitle}
                </span>
              </h1>
              <p className="text-xl text-gray-500 max-w-2xl leading-relaxed mb-10 font-medium">
                {book.description.split('.')[0]}. {book.description.split('.')[1]}.
              </p>
              <div className="flex flex-col sm:flex-row gap-5">
                <Button onClick={handleBuyClick} className="px-10 h-16 text-sm font-black uppercase tracking-widest bg-navy-900 hover:bg-navy-950 shadow-2xl shadow-navy-900/20 rounded-2xl">
                  Order on Amazon <ExternalLink className="ml-3 w-4 h-4" />
                </Button>
                <Button onClick={() => scrollTo('ai-preview')} variant="outline" className="px-10 h-16 text-sm font-black uppercase tracking-widest border-2 border-gray-200 text-navy-900 hover:bg-gray-50 rounded-2xl">
                  Consult the AI
                </Button>
              </div>
            </div>
            
            <div className="mt-20 lg:mt-0 lg:col-span-5 flex justify-center lg:justify-end perspective-1000">
              <div className="relative group transition-all duration-700 hover:scale-105" style={{ transform: 'rotateY(-22deg) rotateX(4deg)' }}>
                {/* Book Glow */}
                <div className="absolute -inset-10 bg-gold-400/10 blur-[100px] rounded-full opacity-50 group-hover:opacity-80 transition-opacity"></div>
                
                {/* 3D Book Container */}
                <div className="relative w-72 h-[450px] shadow-[25px_35px_80px_rgba(0,0,0,0.5)] rounded-r-lg flex overflow-hidden border-r-2 border-white/10">
                  {/* Spine Effect */}
                  <div className="absolute left-0 top-0 bottom-0 w-3.5 bg-gradient-to-r from-black/40 via-transparent to-white/10 z-20"></div>
                  
                  {/* Actual Amazon Cover */}
                  <img 
                    src={coverImageUrl} 
                    alt="Rich By Design Book Cover" 
                    className="w-full h-full object-cover z-10"
                    onError={(e) => {
                       (e.target as any).src = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=720';
                    }}
                  />
                  
                  {/* Premium Glossy Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none z-30"></div>
                </div>

                {/* Status Badge */}
                <div className="absolute -bottom-6 -right-6 bg-gold-500 text-navy-900 px-6 py-4 rounded-2xl shadow-2xl font-black text-xs uppercase tracking-widest transform -rotate-12 border-4 border-white z-40">
                  Best Seller
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section id="book-section" className="py-32 bg-gray-50 relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-20">
            <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-gold-600 mb-4">The Blueprint</h2>
            <h3 className="text-4xl lg:text-5xl font-black text-navy-900 font-serif uppercase tracking-tight">The Seven Laws of Money</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {book.keyTakeaways.map((law, idx) => (
              <div key={idx} className="bg-white p-10 rounded-[2.5rem] border border-gray-100 hover:border-gold-300 transition-all hover:shadow-2xl hover:-translate-y-2 group">
                <div className="w-14 h-14 bg-navy-900 text-gold-400 rounded-2xl flex items-center justify-center mb-8 font-black text-2xl group-hover:bg-gold-500 group-hover:text-navy-900 transition-colors shadow-lg">
                  {idx + 1}
                </div>
                <h4 className="text-xl font-black text-navy-900 mb-4 leading-tight uppercase tracking-tight">{law.split('.')[0]}</h4>
                <p className="text-gray-500 leading-relaxed font-medium">{law.split('.')[1]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Mentor */}
      <section id="ai-preview" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="lg:w-1/2">
                <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-navy-400 mb-4">Interactive Intelligence</h2>
                <h3 className="text-5xl font-black text-navy-900 font-serif leading-tight mb-8 uppercase tracking-tighter">
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
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
                      <div className={`max-w-[85%] rounded-3xl px-6 py-4 text-sm font-medium leading-relaxed ${
                        msg.role === 'user' 
                          ? 'bg-gold-500 text-navy-900 rounded-br-none shadow-xl' 
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
                <div className="p-6 bg-navy-900 border-t border-white/5">
                  <form onSubmit={handleChatSubmit} className="flex gap-3">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Ask the Wealth AI..."
                      className="flex-1 bg-white/5 border border-white/10 text-white rounded-2xl px-6 py-4 outline-none focus:border-gold-500 transition-colors"
                    />
                    <button type="submit" disabled={isChatLoading || !chatInput.trim()} className="bg-gold-500 hover:bg-gold-400 text-navy-900 font-black p-4 rounded-2xl transition-all shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50">
                      <Send className="w-5 h-5" />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 bg-navy-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-navy-900 via-navy-950 to-navy-900 opacity-50"></div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <h2 className="text-4xl lg:text-6xl font-black text-white font-serif uppercase tracking-tighter mb-8 leading-tight">
                Stop Surviving. <br/>
                <span className="text-gold-500 italic">Start Designing.</span>
            </h2>
            <Button onClick={handleBuyClick} variant="secondary" className="h-20 px-16 text-lg rounded-3xl shadow-2xl hover:scale-105 transition-transform flex gap-3">
                Secure Your Copy <ArrowRight className="w-6 h-6" />
            </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-sm font-black text-navy-900 tracking-tighter uppercase">
                Rich By Design<span className="text-gold-500">HQ</span>
            </div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                © 2025 {book.author}. All Rights Reserved.
            </p>
        </div>
      </footer>
    </div>
  );
};
