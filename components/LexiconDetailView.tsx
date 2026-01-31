
import React, { useState, useEffect } from 'react';
import { Collection, WordData } from '../types';
import { ArrowRight, BookCopy, ArrowLeft, Play, Sparkles, BookOpen, MoreVertical, Share2, Trash2, Palette } from 'lucide-react';

interface LexiconDetailViewProps {
  lexicon: Collection;
  onWordSelect: (word: WordData) => void;
  onStartStudy: () => void;
  onBack: () => void;
  onDelete?: () => void;
  theme?: 'LIGHT' | 'DARK' | 'PARCHMENT';
  onShowToast?: (message: string, type?: 'SUCCESS' | 'INFO' | 'ACHIEVEMENT') => void;
}

// Default texture if none provided (Antique Leather)
const DEFAULT_TEXTURE = 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=1000';

const LexiconDetailView: React.FC<LexiconDetailViewProps> = ({ lexicon, onWordSelect, onStartStudy, onBack, onDelete, theme = 'LIGHT', onShowToast }) => {
  const [scrollY, setScrollY] = useState(0);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Use theme color if available, otherwise fallback to dark gradient
  const themeColor = lexicon.themeColor || '#1A2238';
  const textureUrl = lexicon.texture || lexicon.imageUrl || DEFAULT_TEXTURE;

  // Calculate opacity/scale for scroll effects
  const headerOpacity = Math.min(1, scrollY / 200);
  const bookScale = Math.max(0.8, 1 - scrollY * 0.001);
  const bookOpacity = Math.max(0, 1 - scrollY * 0.003);
  const bookTranslateY = scrollY * 0.5;

  const sheetBg = theme === 'DARK' ? '#111827' : '#F9FAFB'; // Slightly gray/dark bg for contrast
  const cardBg = theme === 'DARK' ? '#1F2937' : '#FFFFFF';
  const textColor = theme === 'DARK' ? '#F3E5AB' : '#1A2238';
  const subTextColor = theme === 'DARK' ? '#D1D5DB' : '#6B7280';
  const borderColor = theme === 'DARK' ? '#374151' : '#E5E7EB';

  const handleShare = async () => {
    setShowMenu(false);
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Lexicon Elite: ${lexicon.title}`,
          text: `"${lexicon.description}" - Lexicon Elite'de bu kelime koleksiyonunu keşfet.`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      if (onShowToast) {
          onShowToast("Bağlantı panoya kopyalandı", "SUCCESS");
      } else {
          alert("Panoya kopyalandı");
      }
    }
  };

  const handleDelete = () => {
    if (window.confirm("Bu cildi kütüphaneden kalıcı olarak silmek istediğine emin misin?")) {
      if (onDelete) onDelete();
    }
  };

  return (
    <div className="animate-fade-in relative min-h-screen overflow-hidden" style={{ backgroundColor: sheetBg }}>
      
      {/* 1. Ambient Background (Fixed) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
         <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-gray-800" /> {/* Base dark layer */}
         {/* Theme color ambient glow */}
         <div 
            className="absolute top-[-20%] left-[-20%] w-[140%] h-[80%] opacity-40 blur-[100px] transition-colors duration-1000"
            style={{ backgroundColor: themeColor }}
         />
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10" />
      </div>

      {/* 2. Navigation Bar (Sticky) */}
      <div 
        className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-4 transition-all duration-300"
        style={{ 
          backgroundColor: `rgba(15, 23, 42, ${headerOpacity * 0.8})`,
          backdropFilter: headerOpacity > 0.2 ? 'blur(12px)' : 'none',
          borderBottom: headerOpacity > 0.8 ? '1px solid rgba(255,255,255,0.05)' : 'none'
        }}
      >
        <button 
          onClick={onBack} 
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white transition-colors active:scale-90"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        
        <span 
          className="text-white font-serif font-bold text-lg transition-all duration-300 transform"
          style={{ opacity: headerOpacity, transform: `translateY(${headerOpacity === 1 ? 0 : 10}px)` }}
        >
          {lexicon.title}
        </span>
        
        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white transition-colors active:scale-90"
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {/* Context Menu */}
          {showMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 top-12 z-50 w-48 rounded-xl shadow-2xl border overflow-hidden animate-fade-in-down origin-top-right bg-white dark:bg-gray-800" style={{ borderColor: borderColor }}>
                 <button onClick={handleShare} className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors" style={{ color: textColor }}>
                    <Share2 className="w-4 h-4" /> Paylaş
                 </button>
                 {lexicon.isCustom && onDelete && (
                   <button onClick={handleDelete} className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors border-t" style={{ borderColor: borderColor }}>
                      <Trash2 className="w-4 h-4" /> Cildi Yak
                   </button>
                 )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* 3. The 3D Book Showcase (Scrolls but slower) */}
      <div 
        className="relative z-10 w-full pt-28 pb-12 flex flex-col items-center justify-center pointer-events-none"
        style={{ 
            opacity: bookOpacity,
            transform: `translateY(${bookTranslateY}px) scale(${bookScale})`,
            transition: 'opacity 0.1s, transform 0.1s'
        }}
      >
        <div className="relative group perspective-1000">
             {/* Book Object */}
             <div 
                className="relative w-48 aspect-[2/3] rounded-r-lg rounded-l-[2px] shadow-[20px_20px_60px_rgba(0,0,0,0.5)] transition-transform duration-700 transform rotate-y-[-10deg] group-hover:rotate-y-0"
                style={{ backgroundColor: themeColor }}
            >
                    {/* Cover Texture */}
                    <img 
                        src={textureUrl} 
                        className={`absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60 ${lexicon.isCustom ? 'grayscale' : ''}`} 
                        alt="cover" 
                    />
                    
                    {/* Lighting & Effects */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-transparent to-white/10 pointer-events-none" />
                    <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-white/30 via-white/5 to-transparent z-20" /> {/* Spine Highlight */}

                    {/* Book Cover Content */}
                    <div className="absolute inset-0 p-6 flex flex-col items-center text-center z-30 border-2 border-[#F3E5AB]/10 m-3 rounded-sm">
                        <div className="flex-1 flex flex-col justify-center items-center gap-4">
                            <div className="w-14 h-14 border-2 border-[#F3E5AB]/40 rounded-full flex items-center justify-center">
                                <BookCopy className="w-6 h-6 text-[#F3E5AB]" />
                            </div>
                            <div>
                                <h2 className="font-serif font-bold text-xl text-[#F3E5AB] leading-tight drop-shadow-md line-clamp-3">
                                    {lexicon.title}
                                </h2>
                                <div className="w-10 h-px bg-[#C19A6B] mx-auto mt-3 mb-2" />
                                <span className="text-[9px] font-bold text-[#F3E5AB]/60 uppercase tracking-[0.3em]">Lexicon Elite</span>
                            </div>
                        </div>
                    </div>
            </div>

            {/* 3D Pages Side Effect */}
            <div className="absolute top-[3px] right-0 h-[calc(100%-6px)] w-5 bg-[#F3E5AB] transform translate-x-4 translate-z-[-20px] rounded-r-md bg-[linear-gradient(90deg,#ded0b6_1px,transparent_1px)] bg-[length:2px_100%] shadow-xl border-l border-[#ded0b6]" />
            
            {/* Back Cover Hint */}
            <div className="absolute top-0 left-0 w-full h-full bg-[#000] transform translate-z-[-20px] rounded-lg -z-10 shadow-2xl" />
        </div>

        {/* Floating Metadata below book */}
        <div className="mt-8 text-center space-y-1">
            <p className="text-[#F3E5AB] text-xs font-serif italic opacity-80 max-w-xs mx-auto leading-relaxed">"{lexicon.description}"</p>
            <div className="flex items-center justify-center gap-2 mt-2">
                <span className="px-2 py-0.5 rounded bg-white/10 text-[10px] font-bold text-[#C19A6B] uppercase tracking-widest">{lexicon.words.length} Yazıt</span>
                {lexicon.isCustom && <span className="px-2 py-0.5 rounded bg-[#C19A6B]/20 text-[10px] font-bold text-[#C19A6B] uppercase tracking-widest flex items-center gap-1"><Sparkles className="w-2 h-2"/> Özel</span>}
            </div>
        </div>
      </div>

      {/* 4. Scrollable Content Area */}
      <div className="relative z-20 pb-32 -mt-4">
           {/* "Table of Contents" Sheet */}
           <div 
             className="mx-4 rounded-[2rem] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] overflow-hidden min-h-[50vh] border-t border-white/20 backdrop-blur-xl"
             style={{ backgroundColor: theme === 'DARK' ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)' }}
           >
              {/* Header inside sheet */}
              <div className="p-6 pb-2 border-b" style={{ borderColor: theme === 'DARK' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
                  <h3 className="text-xs font-bold text-[#C19A6B] uppercase tracking-[0.25em]">İçindekiler</h3>
              </div>

              {/* List */}
              <div className="p-4 space-y-3">
                  {lexicon.words.map((word, idx) => (
                    <button 
                      key={`${word.word}-${idx}`}
                      onClick={() => {
                        if (navigator.vibrate) navigator.vibrate(10);
                        onWordSelect(word);
                      }}
                      className="w-full p-4 rounded-xl border flex items-center justify-between group active:scale-[0.99] transition-all hover:shadow-md hover:border-[#C19A6B]/30 relative overflow-hidden text-left"
                      style={{ 
                          backgroundColor: cardBg, 
                          borderColor: borderColor,
                          opacity: 0,
                          animation: `slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards ${idx * 50}ms`
                      }}
                    >
                       <div className="flex items-start gap-4">
                           <span className="text-xs font-bold text-gray-300 mt-1 font-mono">{String(idx + 1).padStart(2, '0')}</span>
                           <div>
                                <h3 className="text-lg font-serif font-bold group-hover:text-[#C19A6B] transition-colors" style={{ color: textColor }}>
                                {word.word}
                                </h3>
                                <p className="text-xs line-clamp-1 opacity-70 mt-0.5" style={{ color: subTextColor }}>
                                {word.definitions[0]}
                                </p>
                           </div>
                       </div>
                       
                       <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${theme === 'DARK' ? 'bg-gray-700 group-hover:bg-[#C19A6B]' : 'bg-gray-100 group-hover:bg-[#C19A6B]'}`}>
                            <BookOpen className="w-3.5 h-3.5 text-gray-400 group-hover:text-white" />
                       </div>
                    </button>
                  ))}

                  {lexicon.words.length === 0 && (
                    <div className="text-center py-12">
                       <p className="text-gray-400 font-serif italic text-sm">Bu cilt henüz boş.</p>
                    </div>
                  )}
              </div>
           </div>
      </div>

      {/* Floating Action Button (Study) */}
      <div className="fixed bottom-8 right-5 z-40 animate-slide-up delay-300">
        <button 
          onClick={() => {
            if (navigator.vibrate) navigator.vibrate(20);
            onStartStudy();
          }}
          className="group relative flex items-center gap-3 pl-6 pr-8 py-4 rounded-full text-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] transition-all hover:scale-105 active:scale-95 overflow-hidden ring-2 ring-white/10"
          style={{ backgroundColor: themeColor }}
        >
           <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
           <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
             <Play className="w-4 h-4 fill-current ml-0.5" />
           </div>
           <div className="text-left">
              <span className="block text-[9px] font-bold uppercase tracking-widest opacity-80">Başla</span>
              <span className="block font-bold text-sm uppercase tracking-widest">Çalış</span>
           </div>
        </button>
      </div>

      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .rotate-y-[-10deg] { transform: rotateY(-10deg); }
        .rotate-y-0 { transform: rotateY(0deg); }
        .translate-z-\[-20px\] { transform: translateZ(-20px); }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default LexiconDetailView;
