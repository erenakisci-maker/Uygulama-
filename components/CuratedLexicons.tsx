
import React, { useState, useEffect } from 'react';
import { Collection } from '../types';
import { BookCopy, Plus, Sparkles, Loader2, X, Palette, Type, Check, Layers, RefreshCw, Lock } from 'lucide-react';

interface CuratedLexiconsProps {
  collections: Collection[];
  onSelect: (collection: Collection) => void;
  onGenerate?: (theme: string, options?: { image?: string; color?: string }) => Promise<void>;
  onGeneratorStateChange?: (isOpen: boolean) => void;
  theme?: 'LIGHT' | 'DARK' | 'PARCHMENT';
  isPremium?: boolean;
}

// Textures for the book cover
const TEXTURES = [
  { id: 'leather', name: 'Antik Deri', url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=1000' },
  { id: 'linen', name: 'Ham Keten', url: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&q=80&w=1000' },
  { id: 'marble', name: 'Mermer', url: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?auto=format&fit=crop&q=80&w=1000' },
  { id: 'cosmos', name: 'Kozmik', url: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop&q=80&w=1000' },
  { id: 'noir', name: 'Obsidiyen', url: 'https://images.unsplash.com/photo-1621252179027-94459d27d3ee?auto=format&fit=crop&q=80&w=1000' },
];

// Pigments for the overlay
const PIGMENTS = [
  { id: 'none', color: 'transparent', name: 'Doğal' },
  { id: 'ruby', color: '#742A2A', name: 'Yakut' },
  { id: 'sapphire', color: '#1A2238', name: 'Safir' },
  { id: 'emerald', color: '#064E3B', name: 'Zümrüt' },
  { id: 'gold', color: '#C19A6B', name: 'Altın' },
  { id: 'slate', color: '#374151', name: 'Arduvaz' },
  { id: 'violet', color: '#4C1D95', name: 'Menekşe' },
];

const CuratedLexicons: React.FC<CuratedLexiconsProps> = ({ collections, onSelect, onGenerate, onGeneratorStateChange, theme = 'LIGHT', isPremium = false }) => {
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const [themeInput, setThemeInput] = useState(''); // This is the prompt for AI
  const [title, setTitle] = useState(''); // Display title
  const [selectedTexture, setSelectedTexture] = useState(TEXTURES[0]);
  const [selectedColor, setSelectedColor] = useState(PIGMENTS[2]); // Default Sapphire
  const [isGenerating, setIsGenerating] = useState(false);

  const modalBg = theme === 'DARK' ? '#1A2238' : '#FFFDF5';
  const textColor = theme === 'DARK' ? '#F3E5AB' : '#1A2238';
  const inputBg = theme === 'DARK' ? 'rgba(0,0,0,0.2)' : '#F9FAFB';

  useEffect(() => {
    if (onGeneratorStateChange) {
      onGeneratorStateChange(isPromptOpen);
    }
    return () => {
      if (onGeneratorStateChange) onGeneratorStateChange(false);
    };
  }, [isPromptOpen, onGeneratorStateChange]);

  const handleSummon = async () => {
    if (!themeInput.trim() || !onGenerate) return;
    setIsGenerating(true);
    
    // We pass the texture URL as the main image, but we also pass the color to be stored
    await onGenerate(themeInput, { 
      image: selectedTexture.url,
      color: selectedColor.color
    });
    
    setIsGenerating(false);
    setIsPromptOpen(false);
    setThemeInput('');
    setTitle('');
    setSelectedTexture(TEXTURES[0]);
    setSelectedColor(PIGMENTS[2]);
  };

  const handleOpenGenerator = () => {
      setIsPromptOpen(true);
  }

  const getRandomConcept = () => {
    const concepts = ["Kayıp Duygular", "Viktorya Dönemi", "Denizcilik Terimleri", "Felsefi Kavramlar", "Unutulmuş Sanatlar"];
    setThemeInput(concepts[Math.floor(Math.random() * concepts.length)]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <h3 className="text-xs font-bold text-[#C19A6B] uppercase tracking-[0.25em]">Sonsuz Kütüphane</h3>
        <div className="h-px flex-1 bg-gradient-to-r from-[#C19A6B]/30 to-transparent" />
      </div>

      <div className="flex space-x-5 overflow-x-auto pb-8 -mx-5 px-5 scrollbar-hide pt-2 snap-x">
        {/* Generator Card */}
        <button 
          onClick={handleOpenGenerator}
          className="flex-shrink-0 w-36 h-56 rounded-xl border-2 border-dashed border-[#C19A6B]/30 hover:border-[#C19A6B] hover:bg-[#C19A6B]/5 transition-all flex flex-col items-center justify-center gap-3 group relative overflow-hidden snap-center"
        >
          {!isPremium && (
              <div className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full z-10">
                  <Lock className="w-3 h-3 text-[#C19A6B]" />
              </div>
          )}
          <div className={`w-14 h-14 rounded-full shadow-sm border border-[#C19A6B]/10 flex items-center justify-center group-hover:scale-110 transition-transform ${theme === 'DARK' ? 'bg-gray-800' : 'bg-[#FFFDF5]'}`}>
             <Plus className="w-6 h-6 text-[#C19A6B]" />
          </div>
          <span className={`text-[10px] font-bold group-hover:text-[#C19A6B] uppercase tracking-wider text-center leading-relaxed ${theme === 'DARK' ? 'text-gray-400' : 'text-[#4A5568]'}`}>Yeni Cilt<br/>Çağır</span>
        </button>

        {/* Existing Collections */}
        {collections.map(collection => {
          // Use stored theme color or fallback to default dark blue
          const overlayColor = collection.themeColor || '#1A2238';
          
          return (
            <button 
              key={collection.id} 
              onClick={() => onSelect(collection)}
              className="flex-shrink-0 w-36 h-56 rounded-r-xl rounded-l-[2px] overflow-hidden relative group shadow-[5px_5px_15px_rgba(0,0,0,0.15)] hover:shadow-[8px_8px_25px_rgba(0,0,0,0.2)] transition-all transform hover:-translate-y-1 snap-center border-l-2 border-white/10"
              style={{ backgroundColor: overlayColor }}
            >
              {/* Background Image with Blend Mode */}
              <img 
                src={collection.imageUrl} 
                alt={collection.title} 
                className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 mix-blend-overlay ${collection.isCustom ? 'grayscale' : ''}`} 
              />
              
              {/* If it's a custom collection with a specific color, we add a solid color layer with mix-blend-multiply */}
              {collection.isCustom && collection.themeColor && (
                <div 
                  className="absolute inset-0 mix-blend-multiply opacity-80" 
                  style={{ backgroundColor: collection.themeColor }} 
                />
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10" />
              
              {/* Spine Effect */}
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-r from-white/30 to-transparent z-20" />

              {/* Custom Indicator */}
              {collection.isCustom && (
                <div className="absolute top-3 right-3 z-20">
                  <Sparkles className="w-3 h-3 text-[#C19A6B] drop-shadow-md" />
                </div>
              )}

              <div className="absolute inset-0 p-4 flex flex-col justify-end text-white text-left z-10">
                <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center mb-3 border border-white/10">
                   <BookCopy className="w-4 h-4 text-[#F3E5AB]" />
                </div>
                <h4 className="font-serif font-bold text-lg leading-5 mb-2 line-clamp-3 text-[#F3E5AB]">{collection.title}</h4>
                <p className="text-[9px] text-white/60 uppercase tracking-widest font-bold">{collection.words.length} Yazıt</p>
              </div>
            </button>
          )
        })}
      </div>

      {/* Generator Prompt Modal */}
      {isPromptOpen && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
            {/* Modal Container */}
            <div className="w-full max-w-5xl h-[85vh] rounded-[2.5rem] shadow-2xl relative border border-[#C19A6B]/30 overflow-hidden flex flex-col md:flex-row" style={{ backgroundColor: modalBg }}>
                
                {/* Close Button */}
                <button 
                  onClick={() => !isGenerating && setIsPromptOpen(false)} 
                  className="absolute top-6 right-6 z-50 p-2 rounded-full bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20 transition-colors backdrop-blur-sm"
                >
                  <X className="w-5 h-5" style={{ color: textColor }} />
                </button>

                {/* Left: The Book Preview (Visual) */}
                <div className="relative w-full md:w-1/2 h-64 md:h-full bg-[#0F172A] flex flex-col items-center justify-center p-8 overflow-hidden flex-shrink-0 border-b md:border-b-0 md:border-r border-white/10">
                    {/* Background Elements */}
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-[#1A2238]/50 to-[#0F172A]"></div>
                    
                    {/* The Book */}
                    <div className="relative z-10 transform transition-transform duration-500 hover:scale-105 group perspective-1000">
                        <div 
                            className="relative w-40 md:w-64 aspect-[2/3] rounded-r-lg rounded-l-[2px] shadow-[20px_20px_50px_rgba(0,0,0,0.5)] transition-all duration-700 transform rotate-y-[-15deg] group-hover:rotate-y-[-5deg] group-hover:shadow-[10px_10px_30px_rgba(0,0,0,0.4)]"
                            style={{ backgroundColor: selectedColor.color }}
                        >
                             {/* Texture & Effects */}
                             <img src={selectedTexture.url} className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60 grayscale" alt="cover" />
                             <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-transparent to-white/10 pointer-events-none" />
                             <div className="absolute left-0 top-0 bottom-0 w-3 md:w-4 bg-gradient-to-r from-white/30 via-white/5 to-transparent z-20" /> {/* Spine Highlight */}

                             {/* Book Content */}
                             <div className="absolute inset-0 p-4 md:p-8 flex flex-col items-center text-center z-30 border-2 border-[#F3E5AB]/10 m-2 md:m-3 rounded-sm">
                                <div className="flex-1 flex flex-col justify-center items-center gap-4">
                                    <div className="w-12 h-12 md:w-16 md:h-16 border-2 border-[#F3E5AB]/40 rounded-full flex items-center justify-center">
                                        <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-[#F3E5AB]" />
                                    </div>
                                    <div>
                                        <h2 className="font-serif font-bold text-lg md:text-2xl text-[#F3E5AB] leading-tight drop-shadow-md break-words line-clamp-3">
                                            {title || themeInput || "Koleksiyon Adı"}
                                        </h2>
                                        <div className="w-8 md:w-12 h-px bg-[#C19A6B] mx-auto mt-3 md:mt-4 mb-2" />
                                        <span className="text-[8px] md:text-[9px] font-bold text-[#F3E5AB]/60 uppercase tracking-[0.3em]">Lexicon Elite</span>
                                    </div>
                                </div>
                                <div className="text-[#F3E5AB]/40 pb-2">
                                    <BookCopy className="w-4 h-4 md:w-5 md:h-5" />
                                </div>
                             </div>
                        </div>
                        {/* 3D Pages Effect */}
                        <div className="absolute top-[3px] right-0 h-[calc(100%-6px)] w-4 md:w-6 bg-[#F3E5AB] transform translate-x-4 md:translate-x-5 translate-z-[-20px] rounded-r-md bg-[linear-gradient(90deg,#ded0b6_1px,transparent_1px)] bg-[length:3px_100%] shadow-xl border-l border-[#ded0b6]" />
                    </div>

                    <p className="mt-6 md:mt-8 text-[9px] md:text-[10px] font-bold text-[#C19A6B] uppercase tracking-[0.3em] flex items-center gap-2 opacity-80">
                        <Palette className="w-3 h-3" /> Canlı Önizleme
                    </p>
                </div>

                {/* Right: Controls (Scrollable) */}
                <div className="relative w-full md:w-1/2 h-full flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-6 md:p-12 space-y-8 md:space-y-10">
                        
                        <div className="space-y-2">
                            <span className="text-[10px] font-bold text-[#C19A6B] uppercase tracking-widest border-b border-[#C19A6B] pb-1 inline-block">Atölye</span>
                            <h2 className="text-2xl md:text-4xl font-serif font-bold leading-tight" style={{ color: textColor }}>
                                Yeni Bir Cilt Tasarla
                            </h2>
                            <p className="text-xs md:text-sm opacity-60 max-w-sm" style={{ color: textColor }}>
                                Kütüphaneniz için özel olarak küratörlüğünü yapacağımız kelimelerin temasını belirleyin.
                            </p>
                        </div>

                        {/* Input Group */}
                        <div className="space-y-6">
                            <div className="group relative">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block group-focus-within:text-[#C19A6B] transition-colors">
                                    Konsept / Tema
                                </label>
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        value={themeInput}
                                        onChange={(e) => setThemeInput(e.target.value)}
                                        placeholder="Örn: 'Yağmurun isimleri', 'Viktorya Dönemi'"
                                        className="w-full bg-transparent border-b-2 border-gray-200 dark:border-gray-700 py-3 pr-10 text-lg md:text-xl font-serif focus:border-[#C19A6B] focus:outline-none transition-colors placeholder:text-gray-300 dark:placeholder:text-gray-700"
                                        style={{ color: textColor }}
                                        autoFocus
                                    />
                                    <button 
                                        onClick={getRandomConcept}
                                        className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-[#C19A6B] transition-colors"
                                        title="Rastgele Fikir"
                                    >
                                        <RefreshCw className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="group">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block group-focus-within:text-[#C19A6B] transition-colors">
                                    Kapak Başlığı (Opsiyonel)
                                </label>
                                <input 
                                    type="text" 
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder={themeInput || "Otomatik oluşturulur..."}
                                    className="w-full bg-transparent border-b border-gray-200 dark:border-gray-700 py-2 text-sm focus:border-[#C19A6B] focus:outline-none transition-colors"
                                    style={{ color: textColor }}
                                />
                            </div>
                        </div>

                        {/* Visual Customization */}
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                    <Layers className="w-3 h-3" /> Doku Seçimi
                                </span>
                                <div className="grid grid-cols-5 gap-2 md:gap-3">
                                    {TEXTURES.map((tex) => (
                                        <button
                                            key={tex.id}
                                            onClick={() => setSelectedTexture(tex)}
                                            className={`relative aspect-square rounded-lg overflow-hidden transition-all duration-300 group ${selectedTexture.id === tex.id ? 'ring-2 ring-[#C19A6B] ring-offset-2 ring-offset-transparent scale-105 shadow-md' : 'opacity-60 hover:opacity-100'}`}
                                        >
                                            <img src={tex.url} className="absolute inset-0 w-full h-full object-cover" alt={tex.name} />
                                            {selectedTexture.id === tex.id && (
                                                <div className="absolute inset-0 bg-[#C19A6B]/20 flex items-center justify-center">
                                                    <Check className="w-5 h-5 text-white drop-shadow-md" />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                    <Palette className="w-3 h-3" /> Pigment
                                </span>
                                <div className="flex flex-wrap gap-2 md:gap-3">
                                    {PIGMENTS.map((pig) => (
                                        <button
                                            key={pig.id}
                                            onClick={() => setSelectedColor(pig)}
                                            className={`w-10 h-10 md:w-12 md:h-12 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${selectedColor.id === pig.id ? 'border-[#C19A6B] scale-110 shadow-lg' : 'border-transparent hover:scale-105'}`}
                                            style={{ backgroundColor: pig.color === 'transparent' ? '#fff' : pig.color }}
                                            title={pig.name}
                                        >
                                            {pig.color === 'transparent' && <div className="w-px h-6 bg-red-400 rotate-45 transform" />}
                                            {selectedColor.id === pig.id && <Check className={`w-5 h-5 ${pig.color === 'transparent' || pig.color === '#fff' ? 'text-black' : 'text-white'}`} />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Action */}
                    <div className="p-6 md:p-8 border-t border-gray-100 dark:border-gray-800 bg-opacity-50 backdrop-blur-sm">
                        <button 
                            onClick={handleSummon}
                            disabled={isGenerating || !themeInput.trim()}
                            className="w-full py-4 md:py-5 rounded-2xl bg-[#1A2238] text-white font-bold uppercase tracking-[0.2em] text-xs md:text-sm shadow-xl hover:shadow-2xl hover:bg-[#232d4b] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 relative overflow-hidden group"
                        >   
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                            {isGenerating ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" /> Hattatlar Çalışıyor...
                                </>
                            ) : (
                                <>
                                    {isPremium ? <Sparkles className="w-5 h-5 text-[#C19A6B]" /> : <Lock className="w-4 h-4 text-gray-400" />}
                                    Koleksiyonu Oluştur
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}

      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .rotate-y-[-10deg] { transform: rotateY(-10deg); }
        .rotate-y-[-15deg] { transform: rotateY(-15deg); }
        .rotate-y-[-5deg] { transform: rotateY(-5deg); }
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default CuratedLexicons;
