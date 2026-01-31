
import React, { useState, useEffect } from 'react';
import { X, GraduationCap, Flame, Check, BrainCircuit, ThumbsUp, ThumbsDown } from 'lucide-react';
import { WordData } from '../types';

interface StudySessionProps {
  words: WordData[];
  onClose: (updatedWords: WordData[]) => void;
}

const SRS_INTERVALS = [1, 3, 7, 14, 30, 90, 180, 365];

const getNextReviewDate = (currentLevel: number, response: 'hard' | 'good' | 'easy'): string => {
  const now = new Date();
  let nextLevel = currentLevel;

  if (response === 'hard') {
    nextLevel = Math.max(0, Math.floor(nextLevel / 2));
    now.setMinutes(now.getMinutes() + 5); // Review again very soon
    return now.toISOString();
  }
  
  if (response === 'good') {
    nextLevel = currentLevel + 1;
  }
  
  if (response === 'easy') {
    nextLevel = currentLevel + 2;
  }

  const daysToAdd = SRS_INTERVALS[Math.min(nextLevel, SRS_INTERVALS.length - 1)] || 1;
  now.setDate(now.getDate() + daysToAdd);
  return now.toISOString();
};


const StudySession: React.FC<StudySessionProps> = ({ words, onClose }) => {
  const [sessionWords, setSessionWords] = useState<WordData[]>(words);
  const [index, setIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  
  const word = sessionWords[index];
  const progress = (index / sessionWords.length) * 100;
  
  useEffect(() => {
    // Preload next image if any for smoother transitions (optional enhancement)
  }, [index, sessionWords]);

  const handleNextWord = (updatedWord: WordData) => {
    const newSessionWords = [...sessionWords];
    newSessionWords[index] = updatedWord;
    setSessionWords(newSessionWords);

    if (index < sessionWords.length - 1) {
      setIsRevealed(false);
      setIndex(prev => prev + 1);
    } else {
      // Last word, finish session
      handleClose(newSessionWords);
    }
  };
  
  const handleSrsChoice = (response: 'hard' | 'good' | 'easy') => {
    if (!word) return;
    const currentLevel = word.srsLevel || 0;
    const nextReviewDate = getNextReviewDate(currentLevel, response);
    
    let nextLevel = currentLevel;
    if (response === 'hard') nextLevel = Math.max(0, currentLevel -1);
    if (response === 'good') nextLevel = currentLevel + 1;
    if (response === 'easy') nextLevel = currentLevel + 2;

    const updatedWord: WordData = {
      ...word,
      srsLevel: nextLevel,
      nextReviewDate: nextReviewDate,
    };
    handleNextWord(updatedWord);
  };

  const handleClose = (finalWords: WordData[]) => {
    setIsFinishing(true);
    setTimeout(() => {
        onClose(finalWords);
    }, 400); // Allow exit animation
  }
  
  if (!word) {
    return (
        <div className="fixed inset-0 z-[60] bg-[#0B101B] flex flex-col items-center justify-center text-white">
            <p>Çalışma seansı tamamlandı!</p>
        </div>
    );
  }

  return (
    <div className={`fixed inset-0 z-[60] bg-[#0B101B] flex flex-col animate-fade-in text-white transition-opacity duration-300 ${isFinishing ? 'opacity-0' : 'opacity-100'}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(193,154,107,0.1),transparent_70%)]" />

      {/* Header */}
      <div className="relative z-10 h-24 px-6 flex items-center justify-between pt-6">
        <div className="flex items-center gap-3">
             <BrainCircuit className="w-5 h-5 text-[#C19A6B]" />
             <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                <div className="h-full bg-gradient-to-r from-[#C19A6B] to-[#F3E5AB] transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
             </div>
        </div>
        <button onClick={() => handleClose(sessionWords)} className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center transition-colors group">
          <X className="w-5 h-5 text-gray-400 group-hover:text-white" />
        </button>
      </div>

      {/* Card Arena */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-8 space-y-8">
        <div className="w-full max-w-sm text-center">
            <h2 className="text-5xl font-serif font-bold text-white mb-3 tracking-tight leading-tight transition-opacity duration-500">{word.word}</h2>
            <p className="text-2xl font-serif text-[#C19A6B] italic">{word.phonetic}</p>
        </div>

        <div className={`w-full max-w-sm p-8 bg-white/5 rounded-2xl border border-white/10 transition-all duration-500 ${isRevealed ? 'min-h-[160px] opacity-100' : 'min-h-[0px] h-0 opacity-0 p-0 border-none'}`}>
          {isRevealed && (
            <div className="animate-fade-in space-y-4">
              <p className="font-serif text-xl text-gray-200 leading-relaxed">{word.definitions[0]}</p>
              <p className="font-serif text-sm text-gray-400 italic">"{word.examples[0]}"</p>
            </div>
          )}
        </div>
      </div>

      {/* Control Deck */}
      <div className="relative z-20 px-6 pb-8 max-w-md mx-auto w-full space-y-4">
        {isRevealed ? (
          <div className="grid grid-cols-3 gap-3 animate-fade-in">
             <button onClick={() => handleSrsChoice('hard')} className="h-16 rounded-xl bg-[#27272a] border border-white/10 flex flex-col items-center justify-center gap-1.5 hover:border-red-500/50 text-gray-300 hover:text-red-400 transition-all">
                <ThumbsDown className="w-5 h-5" /><span className="text-[10px] font-bold uppercase tracking-widest">Zor</span>
             </button>
             <button onClick={() => handleSrsChoice('good')} className="h-16 rounded-xl bg-[#27272a] border border-white/10 flex flex-col items-center justify-center gap-1.5 hover:border-blue-500/50 text-gray-300 hover:text-blue-400 transition-all">
                <ThumbsUp className="w-5 h-5" /><span className="text-[10px] font-bold uppercase tracking-widest">Normal</span>
             </button>
             <button onClick={() => handleSrsChoice('easy')} className="h-16 rounded-xl bg-[#27272a] border border-white/10 flex flex-col items-center justify-center gap-1.5 hover:border-emerald-500/50 text-gray-300 hover:text-emerald-400 transition-all">
                <GraduationCap className="w-5 h-5" /><span className="text-[10px] font-bold uppercase tracking-widest">Kolay</span>
             </button>
          </div>
        ) : (
          <button 
            onClick={() => setIsRevealed(true)}
            className="w-full h-16 rounded-2xl bg-[#C19A6B] text-[#1A2238] font-bold uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(193,154,107,0.3)] hover:scale-[1.02] active:scale-95 transition-all"
          >
            Cevabı Göster
          </button>
        )}
        <p className="text-center text-[9px] font-bold text-gray-600 uppercase tracking-[0.2em]">{index + 1} / {sessionWords.length}</p>
      </div>
    </div>
  );
};

export default StudySession;
