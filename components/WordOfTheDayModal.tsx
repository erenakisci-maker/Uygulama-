
import React from 'react';
import { X, BookOpen } from 'lucide-react';
import { WordData } from '../types';

interface WordOfTheDayModalProps {
  wordData: WordData;
  onClose: () => void;
  onExplore: () => void;
}

const WordOfTheDayModal: React.FC<WordOfTheDayModalProps> = ({ wordData, onClose, onExplore }) => {
  return (
    <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-md flex items-center justify-center animate-fade-in p-4">
      <div className="relative max-w-sm w-full bg-[#1A2238] rounded-3xl border border-[#C19A6B]/20 shadow-2xl p-8 text-white text-center animate-slide-up overflow-hidden">
        {/* Background Glow */}
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-[#C19A6B]/10 rounded-full blur-3xl" />
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors group z-20"
        >
          <X className="w-5 h-5 text-gray-400 group-hover:text-white" />
        </button>

        <div className="relative z-10">
          <span className="block text-[10px] font-bold text-[#C19A6B] uppercase tracking-[0.3em] mb-6">
            Günün Yazıtı
          </span>
          
          <h1 className="text-6xl font-serif font-bold tracking-tight leading-none mb-2">
            {wordData.word}
          </h1>
          <p className="text-xl text-[#E5D5B7] font-serif italic mb-8">
            {wordData.phonetic}
          </p>

          <div className="h-px bg-gradient-to-r from-transparent via-[#C19A6B]/50 to-transparent my-8" />
          
          <p className="text-lg font-serif leading-relaxed text-gray-300 mb-10">
            {wordData.definitions[0]}
          </p>
          
          <button
            onClick={onExplore}
            className="w-full h-14 rounded-full bg-gradient-to-br from-[#C19A6B] to-[#996515] text-[#1A2238] font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg hover:shadow-[#C19A6B]/20 active:scale-95 transition-all"
          >
            <BookOpen className="w-4 h-4" />
            Bu Kelimeyi Keşfet
          </button>
        </div>
      </div>
    </div>
  );
};

export default WordOfTheDayModal;
