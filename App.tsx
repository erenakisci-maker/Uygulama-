
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Book, Heart, ArrowLeft, WifiOff, Settings as SettingsIcon, User, Search as SearchIcon, Home as HomeIcon, BookUser, Sparkles, Feather, Lock, Crown, BookCheck } from 'lucide-react';
import { WordData, UserStats, UserSettings, Achievement, Collection, JournalEntry, DailyUsage } from './types';
import { getGeminiDefinition, generateCustomCollection } from './services/geminiService';
import SearchBar from './components/SearchBar';
import DefinitionView from './components/DefinitionView';
import WordCard from './components/WordCard';
import FavoritesList from './components/FavoritesList';
import StudySession from './components/StudySession';
import ProfileView from './components/ProfileView';
import SettingsView from './components/SettingsView';
import WordOfTheDayModal from './components/WordOfTheDayModal';
import CuratedLexicons from './components/CuratedLexicons';
import LexiconDetailView from './components/LexiconDetailView';
import JournalEditor from './components/JournalEditor';
import WordDuel from './components/WordDuel';
import WordDuelLaunchpad from './components/WordDuelLaunchpad';
import TheOracle from './components/TheOracle';
import MuseAtelier from './components/MuseAtelier';
import PremiumModal from './components/PremiumModal';
import SplashScreen from './components/SplashScreen';
import EpiphanyCard from './components/EpiphanyCard';
import GrammarGuideView from './components/GrammarGuideView';
import { ToastContainer, ToastData, ToastType } from './components/ToastNotification';
import { WORD_OF_THE_DAY } from './data/wordOfTheDay';
import { CURATED_COLLECTIONS } from './data/collections';
import { GRAMMAR_RULES } from './data/grammarData';

type ViewState = 'HOME' | 'DEFINITION' | 'FAVORITES' | 'STUDY' | 'PROFILE' | 'SETTINGS' | 'LEXICON_DETAIL' | 'JOURNAL_EDITOR' | 'DUEL' | 'ORACLE' | 'MUSE' | 'GRAMMAR';
type Tab = 'HOME' | 'FAVORITES' | 'PROFILE';

const LIMITS = {
  SEARCH_FREE: 5,
  MUSE_FREE: 1,
  ANALYSIS_FREE: 1, 
};

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: '1', name: 'Antikacı', description: 'Latince kökenli 5 kelimeyi keşfet.', unlocked: true, type: 'DISCOVERY' },
  { id: '2', name: 'Kelime Mimarı', description: '50 akademik terimde ustalaş.', unlocked: false, type: 'MASTER', progress: (42/50)*100, goal: 50 },
  { id: '3', name: 'Dil Bilgesi', description: '7 günlük arama serisini koru.', unlocked: true, type: 'STREAK' },
  { id: '4', name: 'Hezarfen', description: 'En yüksek karmaşıklık seviyesinin kilidini aç.', unlocked: false, type: 'DISCOVERY' },
];

const VOCABULARY_DATABASE: WordData[] = [
  {
    word: "Petrichor",
    phonetic: "/ˈpeˌtrīkôr/",
    partOfSpeech: "İsim",
    definitions: ["Uzun süreli sıcak ve kuru havanın ardından gelen ilk yağmura sıklıkla eşlik eden hoş koku."],
    examples: ["Yaz fırtınasından sonra hava petrichor kokusuyla doluydu."],
    etymology: "Yunanca petra 'taş' + ichōr 'ilahi sıvı' kelimelerinden.",
  },
  {
    word: "Ineffable",
    phonetic: "/inˈefəb(ə)l/",
    partOfSpeech: "Sıfat",
    definitions: ["Kelimelerle ifade edilemeyecek veya tarif edilemeyecek kadar büyük veya aşırı."],
    examples: ["Gün doğumunun tarif edilemez güzelliği onları suskun bıraktı."],
    etymology: "Latince ineffabilis kelimesinden.",
  }
];

const DEFAULT_SETTINGS: UserSettings = {
  theme: 'LIGHT',
  dialect: 'UK',
  notifications: true,
  offlineEnabled: true,
  complexity: 'STANDARD'
};

const App: React.FC = () => {
  const [isInitializing, setIsInitializing] = useState(true);
  const [currentView, setCurrentView] = useState<ViewState>('HOME');
  const [activeTab, setActiveTab] = useState<Tab>('HOME');
  const [previousView, setPreviousView] = useState<ViewState>('HOME');
  const [currentWord, setCurrentWord] = useState<WordData | null>(null);
  const [favorites, setFavorites] = useState<WordData[]>([]);
  const [wordCache, setWordCache] = useState<Map<string, WordData>>(new Map());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scrolledPastTitle, setScrolledPastTitle] = useState(false);
  const [showWotdModal, setShowWotdModal] = useState(false);
  const [selectedLexicon, setSelectedLexicon] = useState<Collection | null>(null);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [editingJournalEntry, setEditingJournalEntry] = useState<JournalEntry | { word: string } | null>(null);
  const [customCollections, setCustomCollections] = useState<Collection[]>([]);
  const [studyQueue, setStudyQueue] = useState<WordData[]>([]);
  const [isNavHidden, setIsNavHidden] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const [settings, setSettings] = useState<UserSettings>(() => {
    try {
      const saved = localStorage.getItem('lexicon_settings');
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch (e) {
      return DEFAULT_SETTINGS;
    }
  });

  const [stats, setStats] = useState<UserStats>({
    username: 'Gezgin Bilgin',
    avatar: 'default',
    bio: 'Kelimelerin izinde...',
    rank: 'Filolog',
    plan: 'FREE', 
    usage: { searches: 0, muse: 0, oracle: 0, images: 0, analysis: 0, lastReset: new Date().toISOString() },
    wordsMastered: 42,
    streak: 7,
    lexicalDepth: 840,
    recentWords: ['Eloquent', 'Obsequious', 'Paradigm'],
    dailyProgress: 3,
    dailyGoal: 5,
    achievements: INITIAL_ACHIEVEMENTS,
    highScore: 0,
  });

  const addToast = (message: string, type: ToastType = 'INFO') => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const checkAccess = (feature: 'SEARCH' | 'MUSE' | 'ORACLE' | 'IMAGE' | 'CUSTOM_COLLECTION' | 'ANALYSIS'): boolean => {
    if (stats.plan === 'PREMIUM') return true;
    const lastReset = new Date(stats.usage.lastReset).toDateString();
    const today = new Date().toDateString();
    if (lastReset !== today) {
        setStats(prev => ({ ...prev, usage: { searches: 0, muse: 0, oracle: 0, images: 0, analysis: 0, lastReset: new Date().toISOString() } }));
        return true; 
    }
    switch (feature) {
        case 'SEARCH':
            if (stats.usage.searches >= LIMITS.SEARCH_FREE) { setShowPremiumModal(true); return false; }
            setStats(prev => ({ ...prev, usage: { ...prev.usage, searches: prev.usage.searches + 1 } }));
            return true;
        case 'MUSE':
            if (stats.usage.muse >= LIMITS.MUSE_FREE) { setShowPremiumModal(true); return false; }
            setStats(prev => ({ ...prev, usage: { ...prev.usage, muse: prev.usage.muse + 1 } }));
            return true;
        case 'ANALYSIS':
            if (stats.usage.analysis >= LIMITS.ANALYSIS_FREE) { setShowPremiumModal(true); return false; }
            setStats(prev => ({ ...prev, usage: { ...prev.usage, analysis: prev.usage.analysis + 1 } }));
            return true;
        default:
            setShowPremiumModal(true);
            return false;
    }
  };

  const handleUpgrade = () => {
      setStats(prev => ({ ...prev, plan: 'PREMIUM', rank: 'Hezarfen' }));
      setShowPremiumModal(false);
      addToast("Hezarfen paketine hoş geldiniz!", "ACHIEVEMENT");
  };

  const changeView = (newView: ViewState) => {
    setPreviousView(currentView);
    setCurrentView(newView);
    window.scrollTo(0, 0);
  };
  
  const handleTabChange = (tab: Tab) => {
    if (navigator.vibrate) navigator.vibrate(5);
    setActiveTab(tab);
    changeView(tab);
  };

  const handleBack = () => {
    const backMap: Record<string, ViewState> = {
      'SETTINGS': 'PROFILE',
      'GRAMMAR': 'HOME',
    };
    changeView(backMap[currentView] || activeTab);
  };

  useEffect(() => {
    const timer = setTimeout(() => { setIsInitializing(false); }, 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('lexicon_settings', JSON.stringify(settings));
    document.documentElement.classList.remove('dark', 'light', 'parchment');
    if (settings.theme === 'DARK') document.documentElement.classList.add('dark');
    else if (settings.theme === 'PARCHMENT') document.documentElement.classList.add('parchment');
    else document.documentElement.classList.add('light');
  }, [settings.theme]);

  const handleSearch = useCallback(async (term: string) => {
    if (!term.trim()) return;
    if (!checkAccess('SEARCH')) return;
    
    changeView('DEFINITION');
    setIsLoading(true);
    setError(null);
    try {
      const data = await getGeminiDefinition(term);
      setCurrentWord(data);
    } catch (err: any) {
      setError("Tanım bulunamadı.");
    } finally {
      setIsLoading(false);
    }
  }, [checkAccess, settings.complexity]);

  const handleToggleFavorite = useCallback((word: WordData) => {
    setFavorites(prev => {
      const exists = prev.some(f => f.word.toLowerCase() === word.word.toLowerCase());
      if (exists) {
        addToast("Koleksiyondan çıkarıldı.", "INFO");
        return prev.filter(f => f.word.toLowerCase() !== word.word.toLowerCase());
      } else {
        addToast("Koleksiyona eklendi.", "SUCCESS");
        return [{...word, srsLevel: 0, nextReviewDate: new Date().toISOString()}, ...prev];
      }
    });
  }, []);

  const getThemeColors = () => {
    switch (settings.theme) {
      case 'DARK': return { bg: '#111827', text: '#FFFFFF', headerBg: 'bg-[#0F172A]/90' };
      case 'PARCHMENT': return { bg: '#FDF6E3', text: '#5C4033', headerBg: 'bg-[#FDF6E3]/90 text-white' };
      default: return { bg: '#FAFAFA', text: '#1A2238', headerBg: 'bg-white/90' };
    }
  };
  
  const navStyles = {
    LIGHT: { container: 'bg-white/80 border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.12)]', inactive: 'text-gray-400', activeBg: 'bg-[#C19A6B]/10' },
    DARK: { container: 'bg-[#0F172A]/80 border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.5)]', inactive: 'text-gray-500', activeBg: 'bg-[#C19A6B]/10' },
    PARCHMENT: { container: 'bg-[#FFFDF5]/90 border-[#E8DCC4] shadow-[0_8px_30px_rgba(92,64,51,0.1)]', inactive: 'text-[#8C7060]/60', activeBg: 'bg-[#C19A6B]/10' }
  };
  
  const themeColors = getThemeColors();
  const activeNav = navStyles[settings.theme];
  const showHeader = !['GRAMMAR'].includes(currentView);


  if (isInitializing) return <SplashScreen theme={settings.theme} />;

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: themeColors.bg, color: themeColors.text }}>
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
      <PremiumModal isOpen={showPremiumModal} onClose={() => setShowPremiumModal(false)} onUpgrade={handleUpgrade} stats={stats} />
      
      {showHeader && (
         <header className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md shadow-sm transition-all h-16 ${themeColors.headerBg}`}>
          <div className="max-w-md mx-auto px-4 h-full flex items-center justify-between">
            <div className="w-10">
              {['DEFINITION', 'SETTINGS'].includes(currentView) && <button onClick={handleBack} className="p-2 hover:opacity-70"><ArrowLeft className="w-6 h-6" /></button>}
            </div>
            <h1 className="font-serif font-bold text-2xl">{currentView === 'DEFINITION' && currentWord ? currentWord.word : 'Lexicon'}</h1>
            <div className="w-10 flex justify-end">
              {currentView === 'PROFILE' && <button onClick={() => changeView('SETTINGS')} className="p-2 hover:text-[#C19A6B]"><SettingsIcon className="w-6 h-6" /></button>}
            </div>
          </div>
        </header>
      )}

      <main className={`max-w-md mx-auto pb-32 ${showHeader ? 'pt-20' : ''}`}>
        {currentView === 'HOME' && (
          <div className="px-5 py-8 space-y-8 animate-fade-in">
             <div className="space-y-4 text-center">
              <span className="text-[10px] font-bold text-[#C19A6B] uppercase tracking-[0.4em]">Türkçe-İngilizce Sözlük</span>
              <h2 className="text-4xl font-serif font-medium leading-tight px-4">Anlamı keşfet.</h2>
              <div className="pt-2"> <SearchBar onSearch={handleSearch} /> </div>
            </div>
            
            <button onClick={() => changeView('GRAMMAR')} className="w-full p-6 bg-gradient-to-br from-[#1A2238] to-[#2C354B] rounded-2xl text-white shadow-xl flex items-center justify-between group active:scale-[0.98] transition-all hover:shadow-[#C19A6B]/10">
              <div className="flex flex-col items-start gap-1">
                <div className="flex items-center gap-2">
                  <BookCheck className="w-4 h-4 text-[#C19A6B]" />
                  <h2 className="text-xl font-serif font-bold">Gramer Rehberi</h2>
                </div>
                <p className="text-xs text-gray-400 mt-1">İngilizce zamanlar ve dil kuralları.</p>
              </div>
            </button>
            
            <EpiphanyCard theme={settings.theme} />
            <WordDuelLaunchpad highScore={stats.highScore} onStart={() => changeView('DUEL')} />
          </div>
        )}
        {currentView === 'DEFINITION' && <DefinitionView data={currentWord} isLoading={isLoading} error={error} isFavorite={currentWord ? favorites.some(f => f.word.toLowerCase() === currentWord.word.toLowerCase()) : false} onToggleFavorite={() => currentWord && handleToggleFavorite(currentWord)} onSynonymClick={handleSearch} onOpenJournal={() => {}} onLaunchOracle={() => {}} onCheckLimit={checkAccess} theme={settings.theme} />}
        {currentView === 'FAVORITES' && <FavoritesList favorites={favorites} onSelect={(w) => { setCurrentWord(w); changeView('DEFINITION'); }} onStartStudy={() => {}} theme={settings.theme} />}
        {currentView === 'PROFILE' && <ProfileView stats={stats} journalEntries={journalEntries} onWordClick={handleSearch} onEditJournalEntry={() => {}} onUpdateStats={setStats} theme={settings.theme} />}
        {currentView === 'SETTINGS' && <SettingsView settings={settings} stats={stats} favorites={favorites} onUpdateSettings={setSettings} onUpdateStats={setStats} onBack={handleBack} onTriggerPremium={() => setShowPremiumModal(true)} />}
        {currentView === 'GRAMMAR' && <GrammarGuideView rules={GRAMMAR_RULES} onBack={handleBack} theme={settings.theme} />}
        {currentView === 'DUEL' && <WordDuel wordPool={VOCABULARY_DATABASE} onFinish={(score) => { setStats(prev => ({...prev, highScore: Math.max(prev.highScore, score)})); changeView('HOME'); }} />}
      </main>

      {['HOME', 'FAVORITES', 'PROFILE'].includes(currentView) && !isNavHidden && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
          <nav className={`flex items-center gap-1 p-1.5 rounded-full border backdrop-blur-xl transition-all duration-300 ${activeNav.container}`}>
            {[{tab: 'HOME', icon: HomeIcon}, {tab: 'FAVORITES', icon: Heart}, {tab: 'PROFILE', icon: BookUser}].map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.tab;
                return (
                    <button key={item.tab} onClick={() => handleTabChange(item.tab as Tab)} className={`relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 group ${isActive ? activeNav.activeBg : ''}`}>
                        <div className={`transition-all duration-300 ${isActive ? 'text-[#C19A6B] -translate-y-1 scale-110' : activeNav.inactive}`}>
                            <Icon size={22} strokeWidth={isActive ? 2.5 : 2} className={isActive && item.tab === 'FAVORITES' ? 'fill-current' : ''} />
                        </div>
                        {isActive && <span className="absolute bottom-3 w-1 h-1 rounded-full bg-[#C19A6B] animate-fade-in" />}
                    </button>
                )
            })}
          </nav>
        </div>
      )}
    </div>
  );
};

export default App;
