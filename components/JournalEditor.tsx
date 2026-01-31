
import React, { useState } from 'react';
import { X, Save, Feather, Sparkles, Loader2, Award, Lightbulb } from 'lucide-react';
import { JournalEntry, UserSettings, JournalAnalysis } from '../types';
import { analyzeJournalEntry } from '../services/geminiService';

interface JournalEditorProps {
  entry: JournalEntry | { word: string };
  onSave: (entry: JournalEntry) => void;
  onClose: () => void;
  theme: UserSettings['theme'];
  onCheckLimit: () => boolean;
}

const JournalEditor: React.FC<JournalEditorProps> = ({ entry, onSave, onClose, theme, onCheckLimit }) => {
  const [content, setContent] = useState('content' in entry ? entry.content : '');
  const [analysis, setAnalysis] = useState<JournalAnalysis | undefined>('analysis' in entry ? entry.analysis : undefined);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const handleSave = () => {
    const newEntry: JournalEntry = {
      id: 'id' in entry ? entry.id : new Date().toISOString(),
      word: entry.word,
      date: new Date().toISOString(),
      content: content,
      analysis: analysis
    };
    onSave(newEntry);
  };

  const handleAnalyze = async () => {
    if (!content.trim() || content.length < 20) return;
    
    // Check Limits (This triggers the modal in App.tsx if limit reached)
    if (!onCheckLimit()) return;

    setIsAnalyzing(true);
    const result = await analyzeJournalEntry(content, entry.word);
    if (result) {
      setAnalysis(result);
      setShowAnalysis(true);
    }
    setIsAnalyzing(false);
  };

  const themeClasses = {
    LIGHT: 'bg-white text-gray-900',
    DARK: 'bg-[#111827] text-white',
    PARCHMENT: 'bg-[#FDF6E3] text-[#5C4033]',
  };
  
  const textAreaThemeClasses = {
    LIGHT: 'bg-gray-50/50 focus:bg-white placeholder-gray-400',
    DARK: 'bg-gray-800/50 focus:bg-gray-900 placeholder-gray-500',
    PARCHMENT: 'bg-[#F9F2E6] focus:bg-white placeholder-[#967259]/60',
  }

  return (
    <div className={`fixed inset-0 z-[70] flex flex-col animate-fade-in ${themeClasses[theme]}`}>
      {/* Header */}
      <header className="flex-shrink-0 h-20 px-5 flex items-center justify-between border-b border-black/5 dark:border-white/5">
        <div className="flex items-center gap-3">
          <Feather className="w-5 h-5 text-[#C19A6B]" />
          <div>
            <span className="text-xs text-gray-400 dark:text-gray-500">Günlük Girişi:</span>
            <h2 className="font-serif font-bold text-xl">{entry.word}</h2>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="h-10 px-4 rounded-full text-sm font-bold flex items-center justify-center transition-colors hover:bg-black/5 dark:hover:bg-white/5"
          >
            İptal
          </button>
          <button
            onClick={handleSave}
            className="h-10 px-5 rounded-full bg-[#1A2238] text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg hover:bg-[#2C354B] active:scale-95 transition-all"
          >
            <Save className="w-4 h-4" />
            Kaydet
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative flex flex-col">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Bu kelime, anlamı üzerine düşün veya bir hikayeye doku..."
          className={`flex-1 w-full resize-none p-6 font-serif text-lg leading-relaxed focus:outline-none transition-all ${textAreaThemeClasses[theme]}`}
        />
        
        {/* Analysis Panel (Sliding Up) */}
        {showAnalysis && analysis && (
           <div className="absolute bottom-0 left-0 right-0 bg-[#1A2238] text-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.3)] animate-slide-up max-h-[60%] overflow-y-auto border-t border-[#C19A6B]/30">
              <div className="sticky top-0 bg-[#1A2238]/95 backdrop-blur-md p-4 flex items-center justify-between border-b border-white/10 z-10">
                 <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#C19A6B]" />
                    <h3 className="text-sm font-bold uppercase tracking-widest text-[#C19A6B]">Katibin Eleştirisi</h3>
                 </div>
                 <button onClick={() => setShowAnalysis(false)} className="p-2 hover:bg-white/10 rounded-full"><X className="w-4 h-4 text-gray-400" /></button>
              </div>
              
              <div className="p-6 space-y-6">
                 <div className="flex items-center justify-between bg-black/20 p-4 rounded-xl border border-white/5">
                    <div>
                       <span className="block text-[10px] text-gray-400 uppercase tracking-widest mb-1">Belagat Puanı</span>
                       <span className="text-3xl font-serif font-bold text-white">{analysis.eloquenceScore}/100</span>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#C19A6B] to-[#996515] flex items-center justify-center shadow-lg">
                       <Award className="w-6 h-6 text-[#1A2238]" />
                    </div>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                       <span className="block text-[9px] text-gray-500 uppercase tracking-widest mb-1">Ton</span>
                       <span className="text-sm font-medium text-[#E5D5B7]">{analysis.tone}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                       <span className="block text-[9px] text-gray-500 uppercase tracking-widest mb-1">Zenginlik</span>
                       <span className="text-sm font-medium text-[#E5D5B7]">{analysis.vocabularyRichness}</span>
                    </div>
                 </div>

                 <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Analiz</h4>
                    <p className="font-serif italic text-gray-300 leading-relaxed text-sm border-l-2 border-[#C19A6B] pl-4">{analysis.critique}</p>
                 </div>

                 <div className="bg-[#C19A6B]/10 p-4 rounded-xl border border-[#C19A6B]/20">
                    <div className="flex items-center gap-2 mb-2 text-[#C19A6B]">
                       <Lightbulb className="w-4 h-4" />
                       <h4 className="text-xs font-bold uppercase tracking-widest">Öneri</h4>
                    </div>
                    <p className="text-sm text-[#E5D5B7]">{analysis.suggestion}</p>
                 </div>
              </div>
           </div>
        )}
      </main>

       {/* Footer Toolbar */}
       <footer className="flex-shrink-0 h-14 px-5 flex items-center justify-between border-t border-black/5 dark:border-white/5 bg-white/50 dark:bg-black/20 backdrop-blur-sm">
         <p className="text-xs text-gray-400 dark:text-gray-500 font-medium font-serif italic">
           {content.split(/\s+/).filter(Boolean).length} kelime yazıldı
         </p>
         <div className="flex items-center gap-2">
           {analysis && !showAnalysis && (
              <button 
                onClick={() => setShowAnalysis(true)}
                className="text-xs font-bold text-[#C19A6B] hover:text-[#996515] uppercase tracking-wider px-3 py-1"
              >
                 Eleştiriyi Gör
              </button>
           )}
           <button
             onClick={handleAnalyze}
             disabled={isAnalyzing || content.length < 20}
             className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#C19A6B]/10 hover:bg-[#C19A6B]/20 text-[#C19A6B] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
           >
             {isAnalyzing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
             <span className="text-[10px] font-bold uppercase tracking-wider">Analiz Et</span>
           </button>
         </div>
      </footer>
    </div>
  );
};

export default JournalEditor;
