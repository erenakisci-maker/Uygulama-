
import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Loader2, Sparkles, X, Activity, Ear, ArrowRight } from 'lucide-react';
import { WordData, PronunciationResult } from '../types';
import { analyzePronunciation, getGeminiTTS } from '../services/geminiService';

interface ElocutionistProps {
  wordData: WordData;
  onClose: () => void;
  theme?: 'LIGHT' | 'DARK' | 'PARCHMENT';
  onCheckLimit: () => boolean;
}

const Elocutionist: React.FC<ElocutionistProps> = ({ wordData, onClose, theme = 'LIGHT', onCheckLimit }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<PronunciationResult | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isPlayingRef, setIsPlayingRef] = useState(false);

  // Theme Logic (Hardcoded to ensure consistency)
  const bg = theme === 'DARK' ? '#0F172A' : (theme === 'PARCHMENT' ? '#FDF6E3' : '#FFFFFF');
  const text = theme === 'DARK' ? '#F3E5AB' : '#1A2238';
  const subText = theme === 'DARK' ? '#94A3B8' : '#4B5563';
  const cardBg = theme === 'DARK' ? '#1E293B' : (theme === 'PARCHMENT' ? '#FFFDF5' : '#F8FAFC');
  const accent = '#C19A6B';

  const audioContextRef = useRef<AudioContext | null>(null);

  // Audio Playback Helper
  const playRefAudio = async () => {
    setIsPlayingRef(true);
    const base64 = await getGeminiTTS(wordData.word);
    if (base64) {
      const audio = new Audio(`data:audio/mp3;base64,${base64}`);
      audio.onended = () => setIsPlayingRef(false);
      audio.play();
    } else {
      setIsPlayingRef(false);
    }
  };

  const startRecording = async () => {
    // Check Limit First
    if (!onCheckLimit()) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      
      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => chunks.push(e.data);
      
      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm;codecs=opus' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = (reader.result as string).split(',')[1];
          setIsAnalyzing(true);
          const analysis = await analyzePronunciation(wordData.word, base64Audio);
          setResult(analysis);
          setIsAnalyzing(false);
        };
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setResult(null);
      setError(null);
    } catch (err) {
      setError("Mikrofon erişimi reddedildi.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center p-6 animate-fade-in" style={{ backgroundColor: bg }}>
      <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
        <X className="w-6 h-6 text-gray-400" />
      </button>

      {/* Header */}
      <div className="text-center space-y-4 mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#C19A6B]/30 bg-[#C19A6B]/5">
           <Activity className="w-3 h-3 text-[#C19A6B]" />
           <span className="text-[10px] font-bold text-[#C19A6B] uppercase tracking-widest">Diksiyon Koçu</span>
        </div>
        <h2 className="text-5xl font-serif font-bold tracking-tight" style={{ color: text }}>{wordData.word}</h2>
        <div className="flex items-center justify-center gap-3">
           <span className="text-2xl font-serif italic opacity-60" style={{ color: text }}>{wordData.phonetic}</span>
           <button onClick={playRefAudio} disabled={isPlayingRef} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
             <Ear className={`w-5 h-5 ${isPlayingRef ? 'text-[#C19A6B] animate-pulse' : 'text-gray-400'}`} />
           </button>
        </div>
      </div>

      {/* Main Interaction Area */}
      <div className="w-full max-w-sm relative min-h-[300px] flex flex-col items-center justify-center">
        
        {isAnalyzing ? (
          <div className="text-center space-y-4 animate-fade-in">
             <div className="relative w-20 h-20 mx-auto">
                <div className="absolute inset-0 border-4 border-[#C19A6B]/20 rounded-full" />
                <div className="absolute inset-0 border-4 border-[#C19A6B] rounded-full border-t-transparent animate-spin" />
                <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-[#C19A6B] animate-pulse" />
             </div>
             <p className="text-sm font-bold uppercase tracking-widest text-gray-500">Fonetik Analiz Yapılıyor...</p>
          </div>
        ) : result ? (
          <div className="w-full animate-slide-up space-y-6">
             {/* Score Ring */}
             <div className="flex justify-center">
                <div className="relative w-32 h-32 flex items-center justify-center">
                   <svg className="w-full h-full transform -rotate-90">
                      <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-gray-200 dark:text-gray-700" />
                      <circle 
                        cx="64" cy="64" r="60" 
                        stroke={result.score > 80 ? '#10B981' : (result.score > 50 ? '#F59E0B' : '#EF4444')} 
                        strokeWidth="4" 
                        strokeDasharray={2 * Math.PI * 60} 
                        strokeDashoffset={2 * Math.PI * 60 * (1 - result.score / 100)} 
                        strokeLinecap="round" 
                        fill="transparent" 
                        className="transition-all duration-1000 ease-out" 
                      />
                   </svg>
                   <div className="absolute flex flex-col items-center">
                      <span className="text-4xl font-serif font-bold" style={{ color: text }}>{result.score}</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest opacity-50" style={{ color: subText }}>Puan</span>
                   </div>
                </div>
             </div>
             
             {/* Feedback Card */}
             <div className="p-6 rounded-2xl border border-dashed text-left space-y-4" style={{ backgroundColor: cardBg, borderColor: theme === 'DARK' ? '#374151' : '#E5E7EB' }}>
                <div>
                   <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Algılanan</span>
                   <p className="font-serif text-lg italic" style={{ color: text }}>"/{result.detectedPhonemes}/"</p>
                </div>
                
                <div className="space-y-2">
                   {result.tips.map((tip, i) => (
                     <div key={i} className="flex gap-3 items-start">
                        <ArrowRight className="w-4 h-4 text-[#C19A6B] mt-0.5 flex-shrink-0" />
                        <p className="text-sm leading-relaxed" style={{ color: subText }}>{tip}</p>
                     </div>
                   ))}
                </div>

                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                   <p className="text-xs font-medium text-[#C19A6B] italic text-center">"{result.encouragement}"</p>
                </div>
             </div>

             <button onClick={() => { setResult(null); startRecording(); }} className="w-full py-4 rounded-xl bg-[#1A2238] text-white font-bold uppercase tracking-widest text-xs shadow-lg hover:shadow-xl active:scale-95 transition-all">
               Tekrar Dene
             </button>
          </div>
        ) : (
          /* Recording State */
          <div className="text-center">
             <button
               onMouseDown={startRecording}
               onMouseUp={stopRecording}
               onTouchStart={startRecording}
               onTouchEnd={stopRecording}
               className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${isRecording ? 'scale-110 shadow-[0_0_40px_rgba(193,154,107,0.5)]' : 'hover:scale-105 hover:shadow-lg'}`}
               style={{ backgroundColor: isRecording ? '#C19A6B' : cardBg, border: `1px solid ${isRecording ? '#C19A6B' : theme === 'DARK' ? '#374151' : '#E5E7EB'}` }}
             >
                {isRecording ? (
                  <div className="space-y-1">
                     <div className="w-8 h-1 bg-white rounded-full animate-[pulse_0.5s_infinite]" />
                     <div className="w-5 h-1 bg-white rounded-full animate-[pulse_0.5s_infinite_0.1s] mx-auto" />
                     <div className="w-8 h-1 bg-white rounded-full animate-[pulse_0.5s_infinite_0.2s]" />
                  </div>
                ) : (
                  <Mic className="w-8 h-8 text-[#C19A6B]" />
                )}
             </button>
             <p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] animate-pulse" style={{ color: subText }}>
               {isRecording ? "Dinleniyor... (Bırak)" : "Konuşmak için Basılı Tut"}
             </p>
             {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default Elocutionist;
