
import React, { useState, useEffect } from 'react';
import { Volume2, Heart, BookOpen, GitBranch, ArrowUpRight, Share2, Loader2, Sparkles, Image as ImageIcon, ChevronDown, ChevronUp, Quote, History, BadgeInfo, ExternalLink, Newspaper, Scroll, Feather, Network, MapPin, Map, Globe, Timer, Mic, Lock } from 'lucide-react';
import { WordData, PolyglotInsight, MeaningShift } from '../types';
import { getGeminiTTS, generateWordImage, getWordNuance, getWordCitations, getSemanticNeighbors, getGeographicProvenance, getPolyglotMirror, getEtymologicalChronology } from '../services/geminiService';
import Elocutionist from './Elocutionist';

interface DefinitionViewProps {
  data: WordData | null;
  isLoading: boolean;
  error: string | null;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onSynonymClick: (word: string) => void;
  onOpenJournal: () => void;
  onLaunchOracle: () => void;
  theme?: 'LIGHT' | 'DARK' | 'PARCHMENT';
  onCheckLimit: (feature: 'IMAGE' | 'ANALYSIS') => boolean;
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const InteractiveText: React.FC<{ text: string; onWordClick: (word: string) => void }> = ({ text, onWordClick }) => {
  return (
    <span className="leading-relaxed">
      {text.split(' ').map((word, index) => (
        <React.Fragment key={index}>
          <span 
            onClick={() => onWordClick(word.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g,""))}
            className="cursor-pointer border-b border-transparent hover:border-[#C19A6B] hover:text-[#C19A6B] transition-all duration-200"
          >
            {word}
          </span>
          {' '}
        </React.Fragment>
      ))}
    </span>
  );
};

const DefinitionView: React.FC<DefinitionViewProps> = ({ 
  data, isLoading, error, isFavorite, onToggleFavorite, onSynonymClick, onOpenJournal, onLaunchOracle, theme = 'LIGHT', onCheckLimit
}) => {
  const [audioLoading, setAudioLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [nuanceText, setNuanceText] = useState<string | null>(null);
  const [nuanceLoading, setNuanceLoading] = useState(false);
  const [citations, setCitations] = useState<any>(null);
  const [citationsLoading, setCitationsLoading] = useState(false);
  const [semanticNeighbors, setSemanticNeighbors] = useState<string[]>([]);
  const [semanticLoading, setSemanticLoading] = useState(false);
  const [provenance, setProvenance] = useState<any>(null);
  const [provenanceLoading, setProvenanceLoading] = useState(false);
  const [polyglotInsights, setPolyglotInsights] = useState<PolyglotInsight[]>([]);
  const [polyglotLoading, setPolyglotLoading] = useState(false);
  const [chronology, setChronology] = useState<MeaningShift[]>([]);
  const [chronologyLoading, setChronologyLoading] = useState(false);
  const [showElocutionist, setShowElocutionist] = useState(false);

  // Theme Colors
  const textColor = theme === 'DARK' ? '#F3E5AB' : '#1A2238';
  const bodyColor = theme === 'DARK' ? '#E5E7EB' : '#1F2937';
  const cardBg = theme === 'DARK' ? '#1F2937' : '#FFFFFF';
  const borderColor = theme === 'DARK' ? '#374151' : '#F3F4F6';

  const hasAdvancedData = data?.etymology || data?.phonetic;

  useEffect(() => {
    if (data && !isLoading && hasAdvancedData) {
      handleInitialFetch();
    } else {
      resetState();
    }
  }, [data?.word, isLoading]);

  const resetState = () => {
    setCitations(null);
    setImageUrl(null);
    setNuanceText(null);
    setSemanticNeighbors([]);
    setProvenance(null);
    setPolyglotInsights([]);
    setChronology([]);
  };

  const handleInitialFetch = async () => {
    if (!data) return;
    setCitationsLoading(true);
    setSemanticLoading(true);
    setProvenanceLoading(true);
    setPolyglotLoading(true);
    setChronologyLoading(true);
    
    const [citRes, semRes, provRes, polyRes, chronRes] = await Promise.all([
      getWordCitations(data.word),
      getSemanticNeighbors(data.word),
      getGeographicProvenance(data.word),
      getPolyglotMirror(data.word),
      getEtymologicalChronology(data.word)
    ]);
    
    setCitations(citRes);
    setSemanticNeighbors(semRes);
    setProvenance(provRes);
    setPolyglotInsights(polyRes);
    setChronology(chronRes);
    
    setCitationsLoading(false);
    setSemanticLoading(false);
    setProvenanceLoading(false);
    setPolyglotLoading(false);
    setChronologyLoading(false);
  };

  const handleGenerateImage = async () => {
    if (!data || imageLoading) return;
    if (!onCheckLimit('IMAGE')) return;
    setImageLoading(true);
    const result = await generateWordImage(data.word);
    setImageUrl(result);
    setImageLoading(false);
  };

  const handlePlayAudio = async () => {
    if (!data) return;
    setAudioLoading(true);
    const base64 = await getGeminiTTS(data.word);
    if (base64) {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const bytes = decode(base64);
      const audioBuffer = await decodeAudioData(bytes, audioContext, 24000, 1);
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.start();
    }
    setAudioLoading(false);
  };

  if (isLoading) return <SkeletonLoader />;
  if (error || !data) return <div className="p-20 text-center text-gray-400 font-serif italic">{error || "Veri yok"}</div>;

  return (
    <div className="px-5 pt-8 pb-32 animate-slide-up">
      <div className="relative mb-12">
        <div className="absolute top-0 -left-10 w-48 h-48 bg-[#C19A6B]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
             <span className="px-3 py-1 bg-[#1A2238] text-white text-[10px] font-bold uppercase rounded-full tracking-[0.2em] shadow-md border border-[#C19A6B]/30">
               {data.partOfSpeech}
             </span>
            
            <div className="flex gap-2">
              <button onClick={handlePlayAudio} className={`w-10 h-10 rounded-full border flex items-center justify-center hover:bg-[#C19A6B]/5 transition-all shadow-sm group ${theme === 'DARK' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                {audioLoading ? <Loader2 className="w-4 h-4 animate-spin text-[#C19A6B]" /> : <Volume2 className="w-4 h-4 text-gray-400 group-hover:text-[#C19A6B]" />}
              </button>
              <button onClick={onToggleFavorite} className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all shadow-sm ${isFavorite ? 'bg-[#C19A6B]/10 border-[#C19A6B]/30' : (theme === 'DARK' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100 hover:bg-gray-50')}`}>
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-[#C19A6B] text-[#C19A6B]' : 'text-gray-300'}`} />
              </button>
            </div>
          </div>

          <h1 className="text-7xl font-serif font-bold leading-tight tracking-tight" style={{ color: textColor }}>
            {data.word}
          </h1>
          {data.phonetic && (
            <div className="flex items-baseline gap-3 mt-2">
              <p className="text-2xl text-[#C19A6B] font-serif italic opacity-90">{data.phonetic}</p>
              <div className="h-px bg-[#C19A6B]/30 flex-1" />
            </div>
          )}
        </div>
      </div>
      
      {data.translation && (
        <section className="mb-10 text-center">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Çeviri</span>
            <p className="text-4xl font-serif text-[#C19A6B] mt-1">{data.translation}</p>
        </section>
      )}

      <section className="mb-12 relative">
        <div className="pl-2 border-l-2 border-[#C19A6B]/30 space-y-6">
           {data.definitions.map((def, i) => (
            <div key={i} className="group pl-4">
              <p className="text-xl leading-relaxed font-serif" style={{ color: bodyColor }}>
                <InteractiveText text={def} onWordClick={onSynonymClick} />
              </p>
              {data.examples[i] && (
                <div className={`mt-4 p-4 rounded-r-xl border-l-4 border-[#C19A6B] italic font-serif ${theme === 'DARK' ? 'bg-gray-800/50 text-gray-400' : 'bg-gray-50 text-gray-600'}`}>
                  "{data.examples[i]}"
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
      
      {hasAdvancedData && (
        <>
            <section className="mb-12">
                <div className="flex items-center gap-4 mb-4">
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-[0.25em]">Görsel Öz</h2>
                <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
                </div>
                {imageUrl ? (
                <div className={`relative group overflow-hidden rounded-[2rem] border shadow-2xl aspect-square flex items-center justify-center p-3 animate-fade-in ${theme === 'DARK' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-100'}`}>
                    <img src={`data:image/png;base64,${imageUrl}`} alt={`Visual of ${data.word}`} className="w-full h-full object-contain transition-transform duration-[1.5s] group-hover:scale-105" />
                </div>
                ) : (
                <button onClick={handleGenerateImage} disabled={imageLoading} className={`w-full aspect-square rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center gap-4 hover:border-[#C19A6B]/40 hover:bg-[#C19A6B]/5 transition-all group disabled:opacity-50 relative ${theme === 'DARK' ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="absolute top-4 right-4 bg-black/50 p-1 rounded-full"><Lock className="w-3 h-3 text-[#C19A6B]" /></div>
                    {imageLoading ? <Loader2 className="w-10 h-10 text-[#C19A6B] animate-spin" /> : <><div className={`w-16 h-16 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm ${theme === 'DARK' ? 'bg-gray-800' : 'bg-gray-100'}`}><ImageIcon className="w-7 h-7 text-gray-400 group-hover:text-[#C19A6B]" /></div><div className="text-center"><span className="block text-base font-bold" style={{ color: bodyColor }}>Görselleştir</span><span className="text-[10px] text-gray-400 uppercase tracking-widest">YZ Destekli Sanat (Premium)</span></div></>}
                </button>
                )}
            </section>

            {data.etymology && (
                <section className="mb-12">
                    <div className="flex items-center gap-4 mb-6">
                        <h2 className="text-xs font-bold text-[#C19A6B] uppercase tracking-[0.25em]">Altın İplik</h2>
                        <div className="h-px flex-1 bg-gradient-to-r from-[#C19A6B]/30 to-transparent" />
                    </div>
                    <div className="relative pl-2">
                        <div className="absolute left-[13px] top-3 bottom-0 w-0.5 bg-gradient-to-b from-[#C19A6B] via-[#F3E5AB] to-transparent" />
                        <div className="space-y-8">
                            <div className="relative pl-10">
                            <div className="absolute left-0 top-1 w-7 h-7 rounded-full bg-[#1A2238] border-[2px] border-[#C19A6B] flex items-center justify-center z-10 shadow-lg"><History className="w-3.5 h-3.5 text-white" /></div>
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Köken</p>
                            <p className="text-xl font-serif italic" style={{ color: textColor }}>"{data.etymology}"</p>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {data.synonyms && data.synonyms.length > 0 && (
                <section>
                    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-[0.25em] mb-6">Eş Anlamlılar</h2>
                    <div className="flex flex-wrap gap-3">
                    {data.synonyms.map((syn, i) => (
                        <button key={i} onClick={() => onSynonymClick(syn)} className={`px-5 py-3 border rounded-xl text-sm font-medium hover:border-[#C19A6B] hover:text-[#C19A6B] transition-all flex items-center gap-2 group shadow-sm ${theme === 'DARK' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}>
                        {syn} <ArrowUpRight className="w-3 h-3 text-gray-300 group-hover:text-[#C19A6B]" />
                        </button>
                    ))}
                    </div>
                </section>
            )}
        </>
      )}

    </div>
  );
};

const SkeletonLoader = () => (
  <div className="px-5 py-6 animate-pulse space-y-8">
    <div className="flex justify-between items-center"><div className="h-6 w-24 bg-gray-100 rounded-full" /><div className="flex gap-2"><div className="h-10 w-10 bg-gray-100 rounded-full" /><div className="h-10 w-10 bg-gray-100 rounded-full" /></div></div>
    <div className="space-y-4"><div className="h-16 w-3/4 bg-gray-100 rounded-xl" /><div className="h-6 w-1/4 bg-gray-100 rounded" /></div>
  </div>
);

export default DefinitionView;
