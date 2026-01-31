
import React, { useState, useEffect } from 'react';
import { Feather, RefreshCw, Send, X, Sparkles, Scroll, PenTool, Award, Clock } from 'lucide-react';
import { WordData, CreativePrompt, CreativeCritique } from '../types';
import { generateCreativePrompt, evaluateCreativeWriting } from '../services/geminiService';

interface MuseAtelierProps {
  favorites: WordData[];
  onClose: () => void;
  theme?: 'LIGHT' | 'DARK' | 'PARCHMENT';
  onCheckLimit?: () => boolean;
}

const STYLES = [
  { id: 'gothic', name: 'Gotik', desc: 'Karanlık, melankolik, atmosferik.' },
  { id: 'haiku', name: 'Haiku', desc: 'Doğa odaklı, kısa, anlık.' },
  { id: 'modernist', name: 'Modernist', desc: 'Bilinç akışı, parçalı, içsel.' },
  { id: 'noir', name: 'Noir', desc: 'Sinik, gölgeli, dedektif tarzı.' },
  { id: 'fable', name: 'Masal', desc: 'Ahlaki ders veren, fantastik.' },
  { id: 'romantic', name: 'Romantik', desc: 'Duygusal, doğaya hayran.' },
];

const MuseAtelier: React.FC<MuseAtelierProps> = ({ favorites, onClose, theme = 'LIGHT', onCheckLimit }) => {
  const [step, setStep] = useState<'STYLE' | 'WRITING' | 'CRITIQUE'>('STYLE');
  const [selectedStyle, setSelectedStyle] = useState(STYLES[0]);
  const [prompt, setPrompt] = useState<CreativePrompt | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState('');
  const [critique, setCritique] = useState<CreativeCritique | null>(null);

  // Colors
  const bg = theme === 'DARK' ? '#0F172A' : (theme === 'PARCHMENT' ? '#FDF6E3' : '#FFFFFF');
  const text = theme === 'DARK' ? '#F3E5AB' : '#1A2238';
  const subText = theme === 'DARK' ? '#94A3B8' : '#4B5563';
  const cardBg = theme === 'DARK' ? '#1E293B' : (theme === 'PARCHMENT' ? '#FFFDF5' : '#F8FAFC');
  const border = theme === 'DARK' ? '#334155' : '#E2E8F0';

  const handleGeneratePrompt = async () => {
    if (onCheckLimit && !onCheckLimit()) return;

    setIsLoading(true);
    const newPrompt = await generateCreativePrompt(selectedStyle.name, favorites);
    if (newPrompt) {
      setPrompt(newPrompt);
      setStep('WRITING');
    }
    setIsLoading(false);
  };

  const handleSubmitWriting = async () => {
    if (!prompt || !content.trim()) return;
    setIsLoading(true);
    const result = await evaluateCreativeWriting(content, prompt);
    if (result) {
      setCritique(result);
      setStep('CRITIQUE');
    }
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[80] flex flex-col animate-fade-in overflow-hidden" style={{ backgroundColor: bg, color: text }}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: border }}>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#C19A6B]/10">
            <Feather className="w-6 h-6 text-[#C19A6B]" />
          </div>
          <div>
            <h2 className="font-serif font-bold text-xl">İlham Atölyesi</h2>
            <p className="text-xs uppercase tracking-widest opacity-60">Lexicon Elite Creative Suite</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
          <X className="w-6 h-6 opacity-60" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center">
        
        {step === 'STYLE' && (
          <div className="w-full max-w-md space-y-8 animate-slide-up">
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-serif font-bold">Tarzını Seç</h3>
              <p className="text-sm opacity-70">İlham perisi hangi tonda fısıldasın?</p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {STYLES.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(style)}
                  className={`p-4 rounded-xl border-2 text-left transition-all group ${selectedStyle.id === style.id ? 'border-[#C19A6B] bg-[#C19A6B]/5' : 'border-transparent bg-black/5 dark:bg-white/5 hover:border-[#C19A6B]/30'}`}
                >
                  <div className="flex justify-between items-center">
                    <span className={`font-serif font-bold text-lg ${selectedStyle.id === style.id ? 'text-[#C19A6B]' : ''}`}>{style.name}</span>
                    {selectedStyle.id === style.id && <Sparkles className="w-4 h-4 text-[#C19A6B]" />}
                  </div>
                  <p className="text-xs opacity-60 mt-1">{style.desc}</p>
                </button>
              ))}
            </div>

            <button 
              onClick={handleGeneratePrompt}
              disabled={isLoading}
              className="w-full py-4 rounded-xl bg-[#1A2238] text-white font-bold uppercase tracking-widest text-xs shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <PenTool className="w-4 h-4" />}
              {isLoading ? "İlham Çağrılıyor..." : "Meydan Okumayı Başlat"}
            </button>
          </div>
        )}

        {step === 'WRITING' && prompt && (
          <div className="w-full max-w-lg space-y-6 animate-slide-up h-full flex flex-col">
            {/* Prompt Card */}
            <div className="p-6 rounded-2xl border-l-4 border-l-[#C19A6B] shadow-sm relative overflow-hidden" style={{ backgroundColor: cardBg }}>
               <div className="absolute top-0 right-0 p-4 opacity-10"><Scroll className="w-12 h-12" /></div>
               <div className="relative z-10 space-y-4">
                  <div>
                    <span className="text-[10px] font-bold text-[#C19A6B] uppercase tracking-widest">Hedef Kelime</span>
                    <h3 className="text-3xl font-serif font-bold">{prompt.targetWord}</h3>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Senaryo</span>
                    <p className="font-serif italic text-lg leading-relaxed opacity-90">"{prompt.scenario}"</p>
                  </div>
                  <div className="pt-2 border-t border-black/5 dark:border-white/5">
                    <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Kısıtlama: {prompt.constraint}</span>
                  </div>
               </div>
            </div>

            {/* Writing Area */}
            <div className="flex-1 relative">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Kalemini konuştur..."
                className="w-full h-full p-6 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-[#C19A6B]/50 transition-all font-serif text-lg leading-relaxed bg-transparent border-2 border-dashed"
                style={{ borderColor: border }}
                spellCheck={false}
              />
              <div className="absolute bottom-4 right-4 text-xs font-bold opacity-40 pointer-events-none">
                {content.split(/\s+/).filter(Boolean).length} Kelime
              </div>
            </div>

            <button 
              onClick={handleSubmitWriting}
              disabled={isLoading || !content.trim()}
              className="w-full py-4 rounded-xl bg-[#C19A6B] text-[#1A2238] font-bold uppercase tracking-widest text-xs shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {isLoading ? "Eleştirmen Okuyor..." : "Eleştiriye Gönder"}
            </button>
          </div>
        )}

        {step === 'CRITIQUE' && critique && (
          <div className="w-full max-w-md space-y-8 animate-slide-up">
             <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full border-4 border-[#C19A6B] mb-4 bg-gradient-to-br from-[#C19A6B]/20 to-transparent">
                   <span className="text-3xl font-serif font-bold text-[#C19A6B]">{critique.creativityScore}</span>
                </div>
                <h3 className="text-2xl font-serif font-bold">Yaratıcılık Puanı</h3>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border bg-opacity-50 text-center space-y-1" style={{ backgroundColor: cardBg, borderColor: border }}>
                   <span className="text-[10px] uppercase tracking-widest opacity-60">Stil Uyumu</span>
                   <p className="font-bold text-[#C19A6B]">{critique.styleMatch}</p>
                </div>
                <div className="p-4 rounded-xl border bg-opacity-50 text-center space-y-1" style={{ backgroundColor: cardBg, borderColor: border }}>
                   <span className="text-[10px] uppercase tracking-widest opacity-60">Edebi Sanat</span>
                   <p className="font-bold text-[#C19A6B]">{critique.literaryDeviceUsed}</p>
                </div>
             </div>

             <div className="p-6 rounded-2xl border relative overflow-hidden" style={{ backgroundColor: cardBg, borderColor: border }}>
                <Award className="absolute top-4 right-4 w-6 h-6 text-[#C19A6B] opacity-20" />
                <h4 className="text-xs font-bold text-[#C19A6B] uppercase tracking-widest mb-3">Eleştiri Notu</h4>
                <p className="font-serif italic leading-relaxed opacity-90 text-sm">
                  "{critique.feedback}"
                </p>
             </div>

             <button 
                onClick={() => { setStep('STYLE'); setContent(''); setPrompt(null); }}
                className="w-full py-4 rounded-xl border-2 border-[#1A2238] dark:border-white/20 font-bold uppercase tracking-widest text-xs hover:bg-black/5 dark:hover:bg-white/5 transition-all"
             >
               Yeni Bir Eser Yarat
             </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default MuseAtelier;
