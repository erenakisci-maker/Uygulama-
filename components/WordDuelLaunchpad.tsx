
import React from 'react';
import { Swords } from 'lucide-react';

interface WordDuelLaunchpadProps {
  highScore: number;
  onStart: () => void;
}

const WordDuelLaunchpad: React.FC<WordDuelLaunchpadProps> = ({ highScore, onStart }) => {
  return (
    <div className="space-y-4">
       <div className="flex items-center gap-3">
        <h3 className="text-xs font-bold text-[#C19A6B] uppercase tracking-[0.2em]">Cesaretini Test Et</h3>
        <div className="h-px flex-1 bg-gray-100 dark:bg-gray-800" />
      </div>
      <button 
        onClick={onStart}
        className="w-full p-6 bg-gradient-to-br from-[#1A2238] to-[#2C354B] rounded-2xl text-white shadow-xl flex items-center justify-between group active:scale-[0.98] transition-all hover:shadow-[#C19A6B]/10"
      >
        <div className="flex flex-col items-start gap-1">
          <div className="flex items-center gap-2">
            <Swords className="w-4 h-4 text-[#C19A6B]" />
            <h2 className="text-xl font-serif font-bold">Kelime Düellosu</h2>
          </div>
          <p className="text-xs text-gray-400 mt-1">Zamanlı bir zeka ve kelime hazinesi meydan okuması.</p>
        </div>
        <div className="text-right">
            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">En Yüksek Puan</span>
            <p className="text-2xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 to-amber-400">{highScore}</p>
        </div>
      </button>
    </div>
  );
};

export default WordDuelLaunchpad;
