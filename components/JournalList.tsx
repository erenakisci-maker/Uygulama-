
import React from 'react';
import { JournalEntry } from '../types';
import { Feather, Edit3, Calendar } from 'lucide-react';

interface JournalListProps {
  entries: JournalEntry[];
  onEdit: (entry: JournalEntry) => void;
  theme?: 'LIGHT' | 'DARK' | 'PARCHMENT';
}

const JournalList: React.FC<JournalListProps> = ({ entries, onEdit, theme = 'LIGHT' }) => {

  const emptyText = theme === 'DARK' ? 'text-white' : '#1A2238';
  const emptySubText = theme === 'DARK' ? 'text-gray-300' : 'text-gray-600';
  
  // Card styles
  const cardBg = theme === 'DARK' ? '#1A2238' : '#FFFDF5';
  const titleColor = theme === 'DARK' ? '#E5D5B7' : '#1A2238';
  const bodyColor = theme === 'DARK' ? '#D1D5DB' : '#4A5568';
  const borderColor = theme === 'DARK' ? '#374151' : '#E5E7EB';

  if (entries.length === 0) {
    return (
      <div className="py-8 h-full flex flex-col items-center justify-center animate-fade-in">
        <div className={`relative w-full max-w-xs p-8 rounded-3xl border-2 border-dashed flex flex-col items-center text-center backdrop-blur-sm ${theme === 'DARK' ? 'bg-gray-800/40 border-gray-700' : 'bg-gray-50/80 border-gray-200'}`}>
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-5 border shadow-sm ${theme === 'DARK' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-100'}`}>
            <Feather className="w-8 h-8 text-gray-400 dark:text-gray-300" />
          </div>
          <h3 className="text-xl font-serif font-bold mb-3" style={{ color: emptyText }}>Mürekkep Kurudu</h3>
          <p className="font-serif italic text-sm leading-relaxed" style={{ color: emptySubText }}>
            Kişisel düşünceleriniz burada görünecek.<br/>
            Başlamak için herhangi bir kelime tanımında <span className="text-[#C19A6B] font-bold not-italic bg-[#C19A6B]/10 px-1 rounded">'Günlüğe Yaz'</span> seçeneğini kullanın.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {entries.map(entry => (
        <div 
          key={entry.id} 
          onClick={() => onEdit(entry)}
          className="relative p-6 rounded-[2px] shadow-md border group cursor-pointer hover:-rotate-1 transition-transform duration-300"
          style={{
            backgroundColor: cardBg,
            borderColor: borderColor,
            backgroundImage: `linear-gradient(${theme === 'DARK' ? '#374151' : '#E5E7EB'} 1px, transparent 1px)`,
            backgroundSize: '100% 2rem',
            backgroundPosition: '0 1.5rem'
          }}
        >
          {/* Paper Edge Effect */}
          <div className={`absolute top-0 left-0 bottom-0 w-8 border-r border-double ${theme === 'DARK' ? 'border-red-900/30 bg-black/20' : 'border-red-200/30 bg-black/5'}`} />
          <div className={`absolute -top-1 -right-1 w-0 h-0 border-t-[16px] border-r-[16px] shadow-sm`} 
               style={{ 
                 borderTopColor: theme === 'DARK' ? '#111827' : 'white',
                 borderRightColor: theme === 'DARK' ? '#4B5563' : '#D1D5DB' 
               }} 
          />

          <div className="relative z-10 pl-10">
            <div className="flex items-center justify-between mb-4">
               <span className="font-serif font-bold text-2xl border-b-2 border-[#C19A6B] pb-1" style={{ color: titleColor }}>
                 {entry.word}
               </span>
               <div className={`flex items-center gap-1.5 text-[9px] font-bold text-gray-400 uppercase tracking-widest px-2 py-1 rounded ${theme === 'DARK' ? 'bg-black/40' : 'bg-white'}`}>
                 <Calendar className="w-3 h-3" />
                 {new Date(entry.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
               </div>
            </div>
            
            <p className="font-serif italic text-lg leading-[2rem] line-clamp-3" style={{ color: bodyColor }}>
              {entry.content}
            </p>

            <div className="mt-4 flex justify-end">
               <div className="w-8 h-8 rounded-full bg-[#1A2238] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                  <Edit3 className="w-3 h-3 text-white" />
               </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default JournalList;
