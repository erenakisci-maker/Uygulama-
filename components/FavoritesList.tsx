
import React, { useState, useMemo } from 'react';
import { ArrowRight, BookOpen, ArrowDownAZ, Clock, GraduationCap, Archive, Search } from 'lucide-react';
import { WordData } from '../types';

interface FavoritesListProps {
  favorites: WordData[];
  onSelect: (word: WordData) => void;
  onStartStudy: () => void;
  theme: 'LIGHT' | 'DARK' | 'PARCHMENT';
}

type SortMode = 'RECENT' | 'ALPHA';

const FavoritesList: React.FC<FavoritesListProps> = ({ favorites, onSelect, onStartStudy, theme }) => {
  const [sortMode, setSortMode] = useState<SortMode>('RECENT');
  const [filter, setFilter] = useState('');

  const textColor = theme === 'DARK' ? '#FFFFFF' : (theme === 'PARCHMENT' ? '#5C4033' : '#1A2238');
  const cardBg = theme === 'DARK' ? '#1F2937' : '#FFFFFF';
  const borderColor = theme === 'DARK' ? '#374151' : '#F3F4F6';

  const reviewCount = useMemo(() => {
    const now = new Date();
    return favorites.filter(f => f.nextReviewDate && new Date(f.nextReviewDate) <= now).length;
  }, [favorites]);

  const sortedFavorites = useMemo(() => {
    let list = [...favorites];
    if (filter) {
      list = list.filter(w => w.word.toLowerCase().includes(filter.toLowerCase()));
    }
    if (sortMode === 'ALPHA') {
      return list.sort((a, b) => a.word.localeCompare(b.word));
    }
    // Sort by review date, overdue items first
    return list.sort((a, b) => (new Date(a.nextReviewDate || 0).getTime()) - (new Date(b.nextReviewDate || 0).getTime()));
  }, [favorites, sortMode, filter]);

  if (favorites.length === 0) {
    return (
      <div className="px-6 py-12 text-center h-[70vh] flex flex-col items-center justify-center animate-fade-in">
        <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-inner ${theme === 'DARK' ? 'bg-gray-800' : 'bg-gray-50'}`}>
          <Archive className="w-10 h-10 text-[#C19A6B] opacity-50" />
        </div>
        <h3 className="text-2xl font-serif font-bold mb-2" style={{ color: textColor }}>Arşiv Boş</h3>
        <p className="text-gray-400 max-w-[240px] font-serif italic">Henüz koleksiyonuna eklenen bir yazıt bulunmuyor.</p>
      </div>
    );
  }

  return (
    <div className="px-5 py-6 animate-fade-in pb-32">
      {/* Header Area */}
      <div className="mb-8">
        <h2 className="text-3xl font-serif font-bold mb-1" style={{ color: textColor }}>Kasa</h2>
        <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Küratörlü Koleksiyon • {favorites.length} Yazıt</p>
      </div>

      {/* Hero Action */}
      <button 
        onClick={onStartStudy}
        className="w-full mb-8 p-1 rounded-[1.5rem] bg-gradient-to-r from-[#C19A6B] to-[#8B5A2B] shadow-xl group active:scale-[0.98] transition-transform"
      >
        <div className="bg-[#1A2238] rounded-[1.3rem] p-6 flex items-center justify-between h-full">
          <div className="flex flex-col items-start gap-1">
            <span className="text-[9px] font-bold text-[#C19A6B] uppercase tracking-[0.2em] mb-1">Aktif Hatırlama</span>
            <h2 className="text-xl font-serif font-bold text-white">
              {reviewCount > 0 ? `Gözden Geçir (${reviewCount})` : "Çalışmayı Başlat"}
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              {reviewCount > 0 ? "Vadesi gelen kelimeleri tekrar et." : "Zihinsel kütüphaneni tazele."}
            </p>
          </div>
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#C19A6B] to-[#8B5A2B] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform text-[#1A2238]">
            <GraduationCap className="w-7 h-7" />
          </div>
        </div>
      </button>

      {/* Controls */}
      <div className={`sticky top-[72px] z-20 backdrop-blur-md py-2 mb-4 -mx-5 px-5 border-b flex gap-3 ${theme === 'DARK' ? 'bg-[#111827]/90 border-gray-800' : 'bg-[#FAFAFA]/90 border-gray-200'}`}>
        <div className="relative flex-1">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
           <input 
             type="text" 
             placeholder="Koleksiyonda ara..." 
             value={filter}
             onChange={(e) => setFilter(e.target.value)}
             className={`w-full h-10 pl-9 pr-4 rounded-xl border text-sm focus:border-[#C19A6B] focus:outline-none ${theme === 'DARK' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200'}`}
           />
        </div>
        <div className={`flex rounded-xl border p-1 ${theme === 'DARK' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <button onClick={() => setSortMode('RECENT')} className={`p-2 rounded-lg transition-all ${sortMode === 'RECENT' ? (theme === 'DARK' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-[#1A2238]') : 'text-gray-400'}`}><Clock className="w-4 h-4" /></button>
          <button onClick={() => setSortMode('ALPHA')} className={`p-2 rounded-lg transition-all ${sortMode === 'ALPHA' ? (theme === 'DARK' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-[#1A2238]') : 'text-gray-400'}`}><ArrowDownAZ className="w-4 h-4" /></button>
        </div>
      </div>

      {/* List - Styled as Archive Drawers */}
      <div className="space-y-3">
        {sortedFavorites.map((word, idx) => (
          <div 
            key={`${word.word}-${idx}`}
            onClick={() => onSelect(word)}
            className="relative p-5 rounded-xl border-l-4 border-l-[#C19A6B] border-y border-r shadow-sm flex items-center justify-between hover:shadow-md hover:translate-x-1 transition-all cursor-pointer group active:opacity-90"
            style={{ backgroundColor: cardBg, borderColor: borderColor }}
          >
            <div className="absolute inset-0 opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/cardboard.png')] pointer-events-none" />
            
            <div className="relative z-10">
              <h3 className="text-xl font-serif font-bold group-hover:text-[#C19A6B] transition-colors" style={{ color: textColor }}>{word.word}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${theme === 'DARK' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-500'}`}>{word.partOfSpeech}</span>
                <span className="text-[9px] text-gray-400 font-serif italic">{word.register}</span>
              </div>
            </div>
            
            <div className={`w-8 h-8 rounded-full flex items-center justify-center group-hover:bg-[#C19A6B] transition-colors ${theme === 'DARK' ? 'bg-gray-700' : 'bg-gray-50'}`}>
               <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-white transition-colors" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoritesList;
