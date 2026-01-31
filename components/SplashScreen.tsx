
import React, { useEffect, useState } from 'react';
import { Feather, Sparkles } from 'lucide-react';

interface SplashScreenProps {
  theme: 'LIGHT' | 'DARK' | 'PARCHMENT';
}

const QUOTES = [
  "Dil, kültürün haritasıdır.",
  "Kelimeler, düşüncelerin kıyafetleridir.",
  "Bir dil, bir insan.",
  "Sözcüklerin gücü, sessizliğin müziğidir.",
  "Her kelime bir dünyadır.",
  "Sınırlarını dilin çizer."
];

const SplashScreen: React.FC<SplashScreenProps> = ({ theme }) => {
  const [quote, setQuote] = useState("");

  useEffect(() => {
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  }, []);

  // Theme-specific glass configurations
  const themeConfig = {
    LIGHT: {
      bg: 'bg-[#FAFAFA]',
      text: 'text-[#1A2238]',
      accent: '#C19A6B',
      orb1: 'bg-blue-200',
      orb2: 'bg-[#C19A6B]',
      glass: 'bg-white/30 border-white/60 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]',
      subText: 'text-gray-500'
    },
    DARK: {
      bg: 'bg-[#0F172A]',
      text: 'text-[#F3E5AB]',
      accent: '#C19A6B',
      orb1: 'bg-indigo-900',
      orb2: 'bg-[#C19A6B]',
      glass: 'bg-[#1A2238]/30 border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]',
      subText: 'text-gray-400'
    },
    PARCHMENT: {
      bg: 'bg-[#FDF6E3]',
      text: 'text-[#5C4033]',
      accent: '#8C7060',
      orb1: 'bg-[#E8DCC4]',
      orb2: 'bg-[#C19A6B]',
      glass: 'bg-[#FFFDF5]/40 border-[#8C7060]/20 shadow-[0_8px_32px_0_rgba(92,64,51,0.1)]',
      subText: 'text-[#8C7060]'
    }
  };

  const current = themeConfig[theme];

  return (
    <div className={`fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden transition-colors duration-700 ${current.bg}`}>
      
      {/* --- Ambient Background Orbs (For Depth) --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[100px] opacity-40 animate-float-slow ${current.orb1}`} />
        <div className={`absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full blur-[120px] opacity-30 animate-float-delayed ${current.orb2}`} />
      </div>

      {/* --- Glass Card --- */}
      <div className={`relative z-10 p-12 rounded-[3rem] backdrop-blur-xl border flex flex-col items-center max-w-sm w-full mx-4 animate-fade-in-up ${current.glass}`}>
        
        {/* Logo Section */}
        <div className="relative mb-10 group">
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-current opacity-20 blur-2xl rounded-full group-hover:opacity-40 transition-opacity duration-1000" style={{ color: current.accent }} />
          
          <div className={`relative w-28 h-28 rounded-[2rem] border flex items-center justify-center shadow-2xl transform rotate-45 transition-transform duration-700 group-hover:rotate-[225deg] ${theme === 'DARK' ? 'bg-white/5 border-white/10' : 'bg-white/40 border-white/60'}`}>
            <div className="transform -rotate-45 group-hover:-rotate-[225deg] transition-transform duration-700">
               <Feather 
                 className="w-12 h-12 drop-shadow-lg" 
                 style={{ color: current.accent }} 
               />
            </div>
          </div>
          
          <Sparkles className="absolute -top-6 -right-6 w-8 h-8 animate-pulse" style={{ color: current.accent }} />
        </div>

        {/* Typography */}
        <div className="text-center space-y-2 mb-12">
          <h1 className={`text-5xl font-serif font-bold tracking-tight ${current.text}`}>
            Lexicon
          </h1>
          <div className="flex items-center justify-center gap-3 opacity-70">
             <div className={`h-px w-6 ${theme === 'DARK' ? 'bg-white' : 'bg-black'}`} />
             <p className={`text-[10px] font-bold uppercase tracking-[0.4em] ${current.text}`}>Sözlük & Gramer</p>
             <div className={`h-px w-6 ${theme === 'DARK' ? 'bg-white' : 'bg-black'}`} />
          </div>
        </div>

        {/* Loading Bar */}
        <div className="w-full max-w-[160px] h-1 rounded-full overflow-hidden bg-gray-400/20 mb-10">
           <div 
             className="h-full rounded-full animate-progress-indeterminate"
             style={{ backgroundColor: current.accent }}
           />
        </div>

        {/* Footer Quote */}
        <div className="relative">
          <span className="absolute -top-4 -left-2 text-4xl font-serif opacity-20" style={{ color: current.accent }}>"</span>
          <p className={`font-serif italic text-sm text-center max-w-[240px] leading-relaxed ${current.subText}`}>
            {quote}
          </p>
          <span className="absolute -bottom-6 -right-2 text-4xl font-serif opacity-20 transform rotate-180" style={{ color: current.accent }}>"</span>
        </div>

      </div>

      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, -50px) scale(1.1); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-40px, 40px) scale(1.05); }
        }
        @keyframes progress-indeterminate {
          0% { width: 0%; margin-left: 0%; }
          50% { width: 50%; margin-left: 25%; }
          100% { width: 100%; margin-left: 0%; } 
        }
        .animate-float-slow { animation: float-slow 15s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 18s ease-in-out infinite reverse; }
        .animate-progress-indeterminate { animation: progress-indeterminate 2s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
        .animate-fade-in-up { animation: fade-in-up 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};

export default SplashScreen;
