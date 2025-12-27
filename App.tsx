import React, { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { MarketingDashboard } from './components/MarketingDashboard';
import { BookDetails } from './types';
import { Settings, Eye, Share2, Activity } from 'lucide-react';

const initialBook: BookDetails = {
  title: "RICH BY DESIGN",
  subtitle: "Money Made Easy",
  author: "Morgan Haze",
  description: "This book isn't about chasing wealth. It's about designing it with intention, clarity, and confidence. It's a roadmap built on stories, systems, setbacks, and comebacks. You'll stop surviving and start designing. Because the truth is: nobody gets rich by accident. They get rich from their decisions.",
  targetAudience: "Individuals who feel 'behind' financially and are looking for a structural system to build lasting, holistic wealth.",
  keyTakeaways: [
    "Law 1. Save at least one-tenth of all you earn. Pay yourself first, always.",
    "Law 2. Control your expenditures. Budget your lifestyle to ensure you save first.",
    "Law 3. Make your money multiple. Invest in ventures you understand.",
    "Law 4. Guard your treasures from loss. Seek wise counsel and avoid risky schemes.",
    "Law 5. Own your home. Build equity and security through property.",
    "Law 6. Ensure a future income. Plan for retirement and passive streams.",
    "Law 7. Increase your ability to earn. Continuously develop your skills and value."
  ],
  amazonLink: "https://www.amazon.com/Rich-Design-Money-Made-Easy/dp/B0FN334YXZ"
};

const App: React.FC = () => {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [book] = useState<BookDetails>(initialBook);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert("HQ Link copied to clipboard!");
    }
  };

  return (
    <div className="relative selection:bg-gold-200 selection:text-navy-900 bg-white min-h-screen">
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4 items-end">
        {!isAdminMode && (
          <button
            onClick={handleShare}
            className="bg-white hover:bg-gray-50 text-navy-900 p-4 rounded-full shadow-2xl transition-all transform hover:scale-110 border border-gray-100 group"
          >
            <Share2 className="w-5 h-5 group-hover:text-gold-500 transition-colors" />
          </button>
        )}
        
        <button
          onClick={() => setIsAdminMode(!isAdminMode)}
          className={`${
            isAdminMode ? 'bg-navy-900 text-white' : 'bg-gold-500 text-navy-900'
          } p-4 rounded-3xl shadow-2xl transition-all transform hover:scale-110 flex items-center gap-3 pr-8 border-2 border-white/50 group`}
        >
          {isAdminMode ? (
            <>
              <Eye className="w-6 h-6" />
              <span className="font-black text-[11px] uppercase tracking-widest">Live Site</span>
            </>
          ) : (
            <>
              <Settings className="w-6 h-6 group-hover:rotate-180 transition-transform duration-700" />
              <span className="font-black text-[11px] uppercase tracking-widest">HQ Dashboard</span>
            </>
          )}
        </button>
      </div>

      <div className="fixed bottom-6 left-6 z-[60] bg-white/90 backdrop-blur-md border border-gray-100 px-4 py-2 rounded-xl flex items-center gap-3 shadow-lg pointer-events-none">
        <Activity className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
        <span className="text-[9px] font-black text-navy-900 uppercase tracking-widest">v1.8.0 SYNCED</span>
      </div>

      <main>
        {isAdminMode ? (
          <MarketingDashboard book={book} />
        ) : (
          <LandingPage book={book} />
        )}
      </main>
    </div>
  );
};

export default App;
