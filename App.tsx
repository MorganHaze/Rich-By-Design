import React, { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { MarketingDashboard } from './components/MarketingDashboard';
import { BookDetails } from './types';
import { Settings, Eye, Share2, ShieldCheck, Lock, X, ArrowRight, ShieldAlert } from 'lucide-react';

const initialBook: BookDetails = {
  title: "RICH BY DESIGN",
  subtitle: "Money Made Easy",
  author: "Morgan Haze",
  description: "Stop leaving your financial future to chance. This book is a masterclass in architecting wealth through intentional design and strategic systems. It is a roadmap built on high-stakes stories and actionable laws. You will stop surviving and start designing, because nobody gets rich by accident—they get rich by design.",
  targetAudience: "Individuals looking for a structural system to build lasting, holistic wealth.",
  keyTakeaways: [
    "Law 1. Invest at least one-tenth of all you earn.",
    "Law 2. Live within your means. Budget your lifestyle.",
    "Law 3. Make your money multiple. Invest wisely.",
    "Law 4. Guard your investments from loss.",
    "Law 5. Own your home. Build equity.",
    "Law 6. Ensure a future income for retirement.",
    "Law 7. Increase your ability to earn via skills."
  ],
  amazonLink: "https://www.amazon.com/Rich-Design-Money-Made-Easy/dp/B0FN334YXZ"
};

const App: React.FC = () => {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [passkey, setPasskey] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [book] = useState<BookDetails>(initialBook);

  // Check for existing authorization on load
  useEffect(() => {
    const auth = localStorage.getItem('rbd_hq_authorized');
    if (auth === 'true') {
      setIsAuthorized(true);
    }
  }, []);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert("Marketing HQ Link copied to clipboard!");
    }
  };

  const handleToggleMode = () => {
    if (isAdminMode) {
      // Exit Admin Mode
      setIsAdminMode(false);
    } else {
      // Try to Enter Admin Mode
      if (isAuthorized) {
        setIsAdminMode(true);
      } else {
        setShowLogin(true);
      }
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // THE PASSKEY IS: designwealth
    // You can change this string to whatever secret key you prefer.
    if (passkey.toLowerCase() === 'designwealth') {
      setIsAuthorized(true);
      setIsAdminMode(true);
      setShowLogin(false);
      setLoginError(false);
      localStorage.setItem('rbd_hq_authorized', 'true');
    } else {
      setLoginError(true);
    }
  };

  return (
    <div className="relative selection:bg-gold-200 selection:text-navy-900 bg-white min-h-screen">
      
      {/* AUTHORIZATION MODAL */}
      {showLogin && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-navy-950/95 backdrop-blur-xl" onClick={() => setShowLogin(false)}></div>
          <div className="relative bg-white w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20">
            <div className="p-10 text-center">
              <div className="w-20 h-20 bg-gold-500 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl">
                <Lock className="w-10 h-10 text-navy-900" />
              </div>
              <h3 className="text-2xl font-black text-navy-900 uppercase tracking-tighter mb-2 font-serif">Command Center Login</h3>
              <p className="text-gray-500 text-sm font-medium mb-8">Access restricted to RichByDesignHQ authorized personnel.</p>
              
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="relative">
                  <input 
                    type="password" 
                    value={passkey}
                    onChange={(e) => {
                      setPasskey(e.target.value);
                      if (loginError) setLoginError(false);
                    }}
                    placeholder="Enter Security Passkey"
                    className={`w-full bg-gray-50 border-2 rounded-2xl px-6 py-5 outline-none font-bold text-center transition-all ${
                      loginError ? 'border-rose-500 bg-rose-50 text-rose-900' : 'border-gray-100 focus:border-navy-900'
                    }`}
                  />
                  {loginError && (
                    <div className="flex items-center justify-center gap-1.5 mt-2 text-rose-600">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Unauthorized Access Denied</span>
                    </div>
                  )}
                </div>
                <button 
                  type="submit" 
                  className="w-full h-16 bg-navy-900 text-gold-400 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl hover:bg-gold-500 hover:text-navy-900 transition-all flex items-center justify-center gap-3"
                >
                  Verify Authorization <ArrowRight className="w-4 h-4" />
                </button>
              </form>
              
              <button 
                onClick={() => setShowLogin(false)}
                className="mt-8 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-navy-900 transition-colors"
              >
                Return to Public Site
              </button>
            </div>
            <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
               <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Secured by Wealth Architecture Protocols</span>
            </div>
          </div>
        </div>
      )}

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
          onClick={handleToggleMode}
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
              {isAuthorized ? <Settings className="w-6 h-6 group-hover:rotate-90 transition-transform" /> : <Lock className="w-6 h-6" />}
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
