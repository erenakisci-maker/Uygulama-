
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { WordData } from '../types';

interface WordCardProps {
  wordData: WordData;
  onClick: () => void;
  theme?: 'LIGHT' | 'DARK' | 'PARCHMENT';
}

const WordCard: React.FC<WordCardProps> = ({ wordData, onClick, theme = 'LIGHT' }) => {
  const cardBg = theme === 'DARK' ? '#1F2937' : (theme === 'PARCHMENT' ? '#FFFDF5' : '#FFFDF5');
  const textColor = theme === 'DARK' ? '#F3E5AB' : '#1A2238';
  const subTextColor = theme === 'DARK' ? '#D1D5DB' : '#4A5568';
  const borderColor = theme === 'DARK' ? '#374151' : '#E5E7EB';

  return (
    <div 
      onClick={onClick}
      className="group relative overflow-hidden rounded-[2rem] p-7 shadow-lg border cursor-pointer transition-all duration-500 hover:shadow-xl hover:scale-[1.01]"
      style={{ backgroundColor: cardBg, borderColor: borderColor }}
    >
      {/* Texture & Decor */}
      <div className="absolute inset-0 opacity-[0.4] bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] mix-blend-multiply dark:mix-blend-overlay pointer-events-none" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#C19A6B]/10 to-transparent rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-125 duration-700" />

      <div className="relative z-10 flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <h3 className="text-3xl font-serif font-bold tracking-tight group-hover:text-[#C19A6B] transition-colors" style={{ color: textColor }}>
            {wordData.word}
          </h3>
          <span className={`px-3 py-1 backdrop-blur-sm border border-[#C19A6B]/20 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm ${theme === 'DARK' ? 'bg-gray-800/80 text-gray-300' : 'bg-white/80 text-[#4A5568]'}`}>
            {wordData.partOfSpeech}
          </span>
        </div>
        
        <div className="h-px w-12 bg-[#C19A6B]/40 group-hover:w-full transition-all duration-700" />

        <p className="line-clamp-3 leading-relaxed font-serif text-lg italic opacity-90" style={{ color: subTextColor }}>
          "{wordData.definitions[0]}"
        </p>

        <div className="mt-2 flex items-center justify-end">
          <span className="text-xs font-bold text-[#C19A6B] uppercase tracking-widest group-hover:mr-2 transition-all">İncele</span>
          <div className="w-8 h-8 rounded-full bg-[#1A2238] text-white flex items-center justify-center transform group-hover:rotate-45 transition-transform duration-300 shadow-md">
             <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordCard;
