
import React, { useState, useMemo } from 'react';
import { TenseRule } from '../types';
import { ChevronDown, Search, ArrowLeft, BookCheck } from 'lucide-react';

interface GrammarGuideViewProps {
  rules: TenseRule[];
  onBack: () => void;
  theme: 'LIGHT' | 'DARK' | 'PARCHMENT';
}

const TenseCard: React.FC<{ rule: TenseRule, theme: GrammarGuideViewProps['theme'] }> = ({ rule, theme }) => {
  const [isOpen, setIsOpen] = useState(false);

  const cardBg = theme === 'DARK' ? 'bg-gray-800' : (theme === 'PARCHMENT' ? 'bg-[#FFFDF5]' : 'bg-white');
  const textColor = theme === 'DARK' ? 'text-gray-200' : (theme === 'PARCHMENT' ? 'text-[#5C4033]' : '#1A2238');
  const borderColor = theme === 'DARK' ? 'border-gray-700' : (theme === 'PARCHMENT' ? 'border-[#E8DCC4]' : 'border-gray-200');

  return (
    <div className={`rounded-xl border ${borderColor} shadow-sm overflow-hidden transition-all duration-300 ${isOpen ? 'shadow-lg' : ''}`} style={{ backgroundColor: cardBg }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-5 text-left flex items-center justify-between"
      >
        <div className="flex-1">
          <h3 className="text-lg font-serif font-bold" style={{ color: textColor }}>{rule.name}</h3>
        </div>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="px-5 pb-6 pt-2 animate-fade-in border-t" style={{ borderColor: borderColor }}>
          <p className="font-serif italic text-sm mb-6" style={{ color: textColor, opacity: 0.7 }}>{rule.description}</p>
          <div className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <span className="font-bold w-16 text-emerald-500 uppercase text-[10px] tracking-wider mt-1">Olumlu:</span>
              <div className="flex-1">
                <p style={{ color: textColor }}>{rule.positive.example}</p>
                <p className="text-gray-400 italic">"{rule.positive.translation}"</p>
              </div>
            </div>
             <div className="flex items-start gap-3">
              <span className="font-bold w-16 text-red-500 uppercase text-[10px] tracking-wider mt-1">Olumsuz:</span>
              <div className="flex-1">
                <p style={{ color: textColor }}>{rule.negative.example}</p>
                <p className="text-gray-400 italic">"{rule.negative.translation}"</p>
              </div>
            </div>
             <div className="flex items-start gap-3">
              <span className="font-bold w-16 text-blue-500 uppercase text-[10px] tracking-wider mt-1">Soru:</span>
              <div className="flex-1">
                <p style={{ color: textColor }}>{rule.question.example}</p>
                <p className="text-gray-400 italic">"{rule.question.translation}"</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


const GrammarGuideView: React.FC<GrammarGuideViewProps> = ({ rules, onBack, theme }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredRules = useMemo(() => {
    if (!searchTerm) return rules;
    return rules.filter(rule => 
      rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [rules, searchTerm]);

  const groupedRules = useMemo(() => {
    return filteredRules.reduce((acc, rule) => {
      (acc[rule.category] = acc[rule.category] || []).push(rule);
      return acc;
    }, {} as Record<string, TenseRule[]>);
  }, [filteredRules]);

  const categories = ['Present', 'Past', 'Future', 'Modals'];

  return (
    <div className="animate-fade-in pb-24">
      {/* Header */}
      <header className={`sticky top-0 z-20 backdrop-blur-md border-b ${theme === 'DARK' ? 'bg-[#111827]/80 border-gray-800' : 'bg-white/80 border-gray-100'}`}>
        <div className="max-w-md mx-auto px-4 h-16 flex items-center gap-4">
            <button onClick={onBack} className="p-2 -ml-2 text-gray-400 hover:text-[#C19A6B]"><ArrowLeft className="w-6 h-6" /></button>
            <h1 className={`font-serif font-bold text-xl ${theme === 'DARK' ? 'text-white' : 'text-[#1A2238]'}`}>Gramer Rehberi</h1>
        </div>
      </header>
      
      <div className="max-w-md mx-auto px-5 py-6">
        {/* Search Bar */}
        <div className="relative mb-8">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
           <input 
             type="text" 
             placeholder="Zamanları veya kuralları ara..." 
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             className={`w-full h-14 pl-12 pr-4 rounded-xl border-2 text-lg focus:border-[#C19A6B] focus:outline-none ${theme === 'DARK' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200'}`}
           />
        </div>

        {/* Rules */}
        <div className="space-y-10">
          {categories.map(category => (
             groupedRules[category] && (
               <section key={category}>
                 <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-[#C19A6B]/10 flex items-center justify-center">
                        <BookCheck className="w-4 h-4 text-[#C19A6B]" />
                    </div>
                    <h2 className="text-sm font-bold text-[#C19A6B] uppercase tracking-[0.2em]">{category} Zamanlar</h2>
                 </div>
                 <div className="space-y-3">
                    {groupedRules[category].map(rule => <TenseCard key={rule.id} rule={rule} theme={theme} />)}
                 </div>
               </section>
             )
          ))}
          
          {filteredRules.length === 0 && (
             <div className="text-center py-20">
                <p className="text-gray-400 font-serif italic">"{searchTerm}" için sonuç bulunamadı.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GrammarGuideView;
