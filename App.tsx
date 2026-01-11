import React, { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { MarketingDashboard } from './components/MarketingDashboard';
import { BookDetails } from './types';
import { Settings, Eye, Share2, ShieldCheck } from 'lucide-react';

const initialBook: BookDetails = {
  title: "RICH BY DESIGN",
  subtitle: "Money Made Easy",
  author: "Morgan Haze",
  description: "Stop leaving your financial future to chance. This book is a masterclass in architecting wealth through intentional design and strategic systems. It is a roadmap built on high-stakes stories and actionable laws. You will stop surviving and start designing, because nobody gets rich by accident—they get rich by design.",
  targetAudience: "Individuals looking for a structural system to build lasting, holistic wealth.",
  keyTakeaways: [
    "Law 1. Invest at least one-tenth of all you earn.",
    "Law 2. Live within your means. Budget your lifestyle.",
    "Law 3. Make your money multiply. Invest wisely.",
    "Law 4. Guard your investments from loss.",
    "Law 5. Own your home. Build equity.",
    "Law 6. Ensure a future income for retirement.",
    "Law 7. Increase your ability to earn via skills."
  ],
  amazonLink: "https://www.amazon.com/Rich-Design-Money-Made-Easy/dp/B0FN334YXZ"
};

const App: React.FC = () => {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [book] = useState<BookDetails>(initialBook);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert("Marketing HQ Link copied to clipboard!");
    }
  };

  return (
    <div className="relative selection:bg-gold-200 selection:text-navy-900 bg-white min-h-screen">
      {/* Floating HQ Controls */}
      <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-4 items-end">
        {!isAdminMode && (
          <button
            onClick={handleShare}
            className="bg-white hover:bg-gray-50 text-navy-900 p-4 rounded-full shadow-2xl transition-all border border-gray-100 group"
            title="Share Launchpad"
          >
            <Share2 className="w-5 h-5 group-hover:text-gold-600 transition-colors" />
          </button>
        )}
        
        <button
          onClick={() => setIsAdminMode(!isAdminMode)}
          className={`${
            isAdminMode ? 'bg-navy-900 text-white' : 'bg-gold-500 text-navy-900'
          } p-4 rounded-3xl shadow-2xl transition-all flex items-center gap-3 pr-8 border-2 border-white/50 group`}
        >
          {isAdminMode ? (
            <>
              <Eye className="w-6 h-6" />
              <span className="font-black text-[10px] uppercase tracking-widest">Public Site</span>
            </>
          ) : (
            <>
              <Settings className="w-6 h-6 group-hover:rotate-90 transition-transform" />
              <span className="font-black text-[10px] uppercase tracking-widest">Author Dashboard</span>
            </>
          )}
        </button>
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
