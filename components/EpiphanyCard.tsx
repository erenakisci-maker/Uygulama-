
import React, { useState } from 'react';
import { Sparkles, Scroll, FlaskConical, Hourglass, RefreshCw, Loader2 } from 'lucide-react';
import { generateLinguisticTrivia } from '../services/geminiService';
import { LinguisticTrivia } from '../types';

interface EpiphanyCardProps {
  theme: 'LIGHT' | 'DARK' | 'PARCHMENT';
}

const EpiphanyCard: React.FC<EpiphanyCardProps> = ({ theme }) => {
  const [trivia, setTrivia] = useState<LinguisticTrivia | null>(null);
  const [loading, setLoading] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);

  // Initial load
  React.useEffect(() => {
    // Only load if not already loaded (to avoid API spam on re-renders)
    if (!trivia) {
        handleGenerate();
    }
  }, []);

  const handleGenerate = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setLoading(true);
    setIsRevealed(false);
    
    // Simulate slight delay for effect if API is too fast
    const data = await generateLinguisticTrivia();
    if (data) {
        setTrivia(data);
        setTimeout(() => setIsRevealed(true), 300);
    }
    setLoading(false);
  };

  const getIcon = () => {
    switch(trivia?.iconType) {
        case 'MAGIC': return <Sparkles className="w-5 h-5" />;
        case 'SCIENCE': return <FlaskConical className="w-5 h-5" />;
        default: return <Hourglass className="w-5 h-5" />;
    }
  };

  const cardStyles = {
    LIGHT: { bg: 'bg-white', border: 'border-gray-100', text: 'text-[#1A2238]', sub: 'text-gray-500' },
    DARK: { bg: 'bg-[#1F2937]', border: 'border-gray-700', text: 'text-[#F3E5AB]', sub: 'text-gray-400' },
    PARCHMENT: { bg: 'bg-[#F9F2E6]', border: 'border-[#E8DCC4]', text: 'text-[#5C4033]', sub: 'text-[#8C7060]' }
  };

  const s = cardStyles[theme];

  return (
    <div className="relative group w-full perspective-1000 h-40">
       {/* Background Glow */}
       <div className={`absolute -inset-0.5 bg-gradient-to-r from-[#C19A6B] to-[#F3E5AB] rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 ${loading ? 'animate-pulse' : ''}`} />
       
       <div 
         className={`relative w-full h-full rounded-2xl border shadow-lg flex flex-col items-center justify-center p-6 text-center transition-all duration-500 overflow-hidden ${s.bg} ${s.border}`}
       >
         {/* Texture Overlay */}
         <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />

         {!isRevealed || loading ? (
             <div className="flex flex-col items-center gap-3 animate-fade-in">
                <div className="w-12 h-12 rounded-full bg-[#C19A6B]/10 flex items-center justify-center text-[#C19A6B]">
                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Sparkles className="w-6 h-6 animate-pulse" />}
                </div>
                <div>
                    <h3 className={`font-serif font-bold text-lg ${s.text}`}>Aydınlanma Motoru</h3>
                    <p className={`text-xs uppercase tracking-widest ${s.sub}`}>{loading ? 'Kadim bilgi aranıyor...' : 'Günlük dil sırrı için bekle'}</p>
                </div>
             </div>
         ) : (
             <div className="w-full h-full flex flex-col animate-fade-in-up text-left">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-[#C19A6B]">
                        {getIcon()}
                        <span className="text-[9px] font-bold uppercase tracking-[0.2em]">{trivia?.title}</span>
                    </div>
                    <button onClick={handleGenerate} className={`p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${s.sub}`} title="Yeni Bilgi">
                        <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                </div>
                
                <p className={`font-serif text-sm leading-relaxed flex-1 ${s.text}`}>
                    "{trivia?.fact}"
                </p>
                
                <div className={`mt-2 pt-2 border-t border-dashed flex items-center gap-2 ${theme === 'DARK' ? 'border-gray-700' : 'border-gray-200'}`}>
                    <Scroll className={`w-3 h-3 ${s.sub}`} />
                    <span className={`text-[10px] font-bold ${s.sub}`}>{trivia?.connection}</span>
                </div>
             </div>
         )}
       </div>
    </div>
  );
};

export default EpiphanyCard;
