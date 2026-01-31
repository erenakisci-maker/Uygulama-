
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { X, Trophy, RefreshCw, Sparkles, ShieldCheck, ShieldX, Swords } from 'lucide-react';
import { WordData } from '../types';

interface WordDuelProps {
  wordPool: WordData[];
  onFinish: (finalScore: number) => void;
}

type GameState = 'START' | 'PLAYING' | 'ROUND_RESULT' | 'END';
type AnswerStatus = 'PENDING' | 'CORRECT' | 'INCORRECT';

interface DuelQuestion {
  word: string;
  correctDefinition: string;
  choices: string[];
}

const ROUNDS = 10;
const TIME_PER_ROUND = 15;

function shuffleArray<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

const WordDuel: React.FC<WordDuelProps> = ({ wordPool, onFinish }) => {
  const [gameState, setGameState] = useState<GameState>('START');
  const [questions, setQuestions] = useState<DuelQuestion[]>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(TIME_PER_ROUND);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answerStatus, setAnswerStatus] = useState<AnswerStatus>('PENDING');

  const generateQuestions = useCallback(() => {
    // Explicitly type the shuffled pool to ensure WordData properties are correctly recognized
    const shuffledPool: WordData[] = shuffleArray<WordData>(wordPool);
    const newQuestions: DuelQuestion[] = [];

    for (let i = 0; i < ROUNDS; i++) {
      if (i >= shuffledPool.length) break;

      // Access current question word and ensure it is defined
      const questionWord = shuffledPool[i];
      if (!questionWord) continue;

      const correctDefinition = questionWord.definitions[0];

      // Get 3 incorrect definitions with explicit typing for the filter and map callbacks
      const distractors = shuffledPool
        .filter((w: WordData) => w.word !== questionWord.word)
        .slice(i + 1, i + 4)
        .map((w: WordData) => w.definitions[0]);
      
      const choices = shuffleArray<string>([correctDefinition, ...distractors]);
      newQuestions.push({ word: questionWord.word, correctDefinition, choices });
    }
    setQuestions(newQuestions);
  }, [wordPool]);

  useEffect(() => {
    generateQuestions();
  }, [generateQuestions]);
  
  useEffect(() => {
    if (gameState !== 'PLAYING' || selectedAnswer) return;

    if (timer > 0) {
      const interval = setInterval(() => setTimer(t => t - 1), 1000);
      return () => clearInterval(interval);
    } else {
      handleAnswerSelect("Süre doldu!"); // Timeout counts as incorrect
    }
  }, [gameState, timer, selectedAnswer]);

  const handleStartDuel = () => {
    setScore(0);
    setCurrentRound(0);
    setGameState('PLAYING');
    setTimer(TIME_PER_ROUND);
    setSelectedAnswer(null);
    setAnswerStatus('PENDING');
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    const question = questions[currentRound];
    const isCorrect = answer === question.correctDefinition;

    if (isCorrect) {
      const points = 100 + (timer * 10);
      setScore(prev => prev + points);
      setAnswerStatus('CORRECT');
    } else {
      setAnswerStatus('INCORRECT');
    }

    setGameState('ROUND_RESULT');
    setTimeout(() => {
      if (currentRound + 1 < ROUNDS) {
        setCurrentRound(prev => prev + 1);
        setTimer(TIME_PER_ROUND);
        setSelectedAnswer(null);
        setAnswerStatus('PENDING');
        setGameState('PLAYING');
      } else {
        setGameState('END');
      }
    }, 2000);
  };
  
  const getRank = (finalScore: number) => {
    if (finalScore < 500) return { name: 'Acemi', color: 'text-gray-400' };
    if (finalScore < 1000) return { name: 'Çırak', color: 'text-emerald-400' };
    if (finalScore < 1500) return { name: 'Katip', color: 'text-blue-400' };
    if (finalScore < 2000) return { name: 'Bilgin', color: 'text-purple-400' };
    return { name: 'Sözlükbilimci', color: 'text-[#C19A6B]' };
  };

  const renderContent = () => {
    switch (gameState) {
      case 'START': return <StartScreen onStart={handleStartDuel} />;
      case 'PLAYING':
      case 'ROUND_RESULT':
        const question = questions[currentRound];
        if (!question) return <p>Yükleniyor...</p>;
        return (
          <PlayScreen
            question={question}
            round={currentRound + 1}
            timer={timer}
            onAnswer={handleAnswerSelect}
            selectedAnswer={selectedAnswer}
            answerStatus={answerStatus}
          />
        );
      case 'END':
        const rank = getRank(score);
        return (
          <EndScreen 
            score={score} 
            rank={rank}
            onPlayAgain={() => {
              generateQuestions();
              handleStartDuel();
            }} 
            onFinish={() => onFinish(score)}
          />
        );
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-[#09090b] flex flex-col items-center justify-center p-4 text-white animate-fade-in overflow-hidden">
       {/* Ambient Arena Lighting */}
       <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[60vh] bg-indigo-900/20 blur-[120px] pointer-events-none" />
       
       {gameState !== 'START' && (
         <button onClick={() => onFinish(score)} className="absolute top-6 right-6 p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors z-50">
           <X size={20} className="text-gray-400 hover:text-white" />
         </button>
       )}
      {renderContent()}
    </div>
  );
};

const StartScreen: React.FC<{ onStart: () => void }> = ({ onStart }) => (
  <div className="text-center animate-fade-in p-8 bg-[#18181b] rounded-[2rem] border border-white/5 shadow-2xl relative overflow-hidden w-full max-w-sm">
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#C19A6B] to-transparent" />
    
    <div className="w-20 h-20 bg-[#C19A6B]/10 rounded-full flex items-center justify-center mx-auto mb-6 ring-1 ring-[#C19A6B]/30">
        <Swords className="w-10 h-10 text-[#C19A6B]" />
    </div>
    
    <h1 className="text-4xl font-serif font-bold mb-3 tracking-tight">Arena</h1>
    <p className="text-gray-400 mb-10 font-serif italic">"Zeka kılıçtan keskindir."</p>
    
    <div className="grid grid-cols-3 gap-2 mb-10 text-xs font-bold text-gray-500 uppercase tracking-wider">
      <div className="p-3 rounded-xl bg-black/40 border border-white/5">
        <span className="block text-[#C19A6B] text-lg mb-1">10</span>
        Tur
      </div>
      <div className="p-3 rounded-xl bg-black/40 border border-white/5">
        <span className="block text-[#C19A6B] text-lg mb-1">{TIME_PER_ROUND}s</span>
        Süre
      </div>
      <div className="p-3 rounded-xl bg-black/40 border border-white/5">
        <span className="block text-[#C19A6B] text-lg mb-1">+</span>
        Bonus
      </div>
    </div>

    <button onClick={onStart} className="w-full h-16 rounded-2xl bg-[#C19A6B] hover:bg-[#B0895B] text-[#18181b] font-bold text-sm uppercase tracking-[0.2em] shadow-lg shadow-[#C19A6B]/20 active:scale-95 transition-all">
      Düelloyu Başlat
    </button>
  </div>
);

const PlayScreen: React.FC<{
  question: DuelQuestion;
  round: number;
  timer: number;
  onAnswer: (answer: string) => void;
  selectedAnswer: string | null;
  answerStatus: AnswerStatus;
}> = ({ question, round, timer, onAnswer, selectedAnswer, answerStatus }) => {
  const timerPercentage = (timer / TIME_PER_ROUND) * 100;
  
  const getButtonClass = (choice: string) => {
    if (!selectedAnswer) return 'bg-[#27272a] border-transparent hover:bg-[#3f3f46] hover:border-[#C19A6B]/50';
    if (choice === question.correctDefinition) return 'bg-emerald-900/30 border-emerald-500/50 text-emerald-100 ring-1 ring-emerald-500';
    if (choice === selectedAnswer && answerStatus === 'INCORRECT') return 'bg-red-900/30 border-red-500/50 text-red-100 ring-1 ring-red-500';
    return 'bg-[#27272a] border-transparent opacity-40';
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center animate-fade-in">
      {/* Progress & Timer */}
      <div className="w-full flex items-center justify-between mb-8 px-2">
         <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Tur {round}/{ROUNDS}</span>
         <div className="flex items-center gap-2">
            <span className={`text-xs font-bold font-mono ${timer < 5 ? 'text-red-400 animate-pulse' : 'text-[#C19A6B]'}`}>{timer.toFixed(1)}s</span>
            <div className="w-24 h-1.5 bg-gray-800 rounded-full overflow-hidden">
               <div className="h-full bg-[#C19A6B] transition-all duration-1000 ease-linear" style={{ width: `${timerPercentage}%` }} />
            </div>
         </div>
      </div>
      
      {/* Card */}
      <div className="w-full mb-8 relative">
         <div className="absolute -inset-1 bg-gradient-to-r from-[#C19A6B]/20 to-indigo-500/20 rounded-3xl blur-lg opacity-50" />
         <div className="relative bg-[#18181b] p-8 rounded-2xl border border-white/10 text-center shadow-2xl">
            <h2 className="text-4xl font-serif font-bold mb-2 tracking-tight text-white">{question.word}</h2>
            <div className="h-1 w-8 bg-[#C19A6B] mx-auto rounded-full" />
         </div>
      </div>
      
      <div className="w-full space-y-3">
        {question.choices.map((choice, i) => (
          <button
            key={i}
            onClick={() => onAnswer(choice)}
            disabled={!!selectedAnswer}
            className={`w-full text-left p-5 rounded-xl border transition-all duration-200 font-serif text-lg leading-snug ${getButtonClass(choice)}`}
          >
            {choice}
          </button>
        ))}
      </div>
    </div>
  );
};

const EndScreen: React.FC<{
  score: number;
  rank: { name: string; color: string };
  onPlayAgain: () => void;
  onFinish: () => void;
}> = ({ score, rank, onPlayAgain, onFinish }) => (
  <div className="text-center animate-fade-in p-8 bg-[#18181b] rounded-[2rem] border border-white/5 shadow-2xl w-full max-w-sm relative overflow-hidden">
    <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-[#C19A6B]/10 to-transparent pointer-events-none" />
    
    <div className="relative z-10">
      <Trophy className="w-16 h-16 text-[#C19A6B] mx-auto mb-6 drop-shadow-[0_0_15px_rgba(193,154,107,0.5)]" />
      <h1 className="text-2xl font-serif font-bold text-gray-400 mb-2">Müsabaka Bitti</h1>
      <p className="text-7xl font-serif font-bold text-white mb-2 tracking-tighter">{score}</p>
      <div className={`inline-block px-4 py-1 rounded-full bg-white/5 border border-white/5 text-sm font-bold uppercase tracking-widest ${rank.color} mb-8`}>
        {rank.name}
      </div>
      
      <div className="flex gap-3">
        <button onClick={onFinish} className="flex-1 h-14 rounded-2xl bg-[#27272a] hover:bg-[#3f3f46] text-gray-300 font-bold text-xs uppercase tracking-wider transition-colors">
          Çıkış
        </button>
        <button onClick={onPlayAgain} className="flex-[2] h-14 rounded-2xl bg-[#C19A6B] hover:bg-[#B0895B] text-[#18181b] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#C19A6B]/20 active:scale-95 transition-all">
          <RefreshCw size={16} /> Tekrar Oyna
        </button>
      </div>
    </div>
  </div>
);

export default WordDuel;
