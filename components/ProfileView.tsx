
import React, { useState, useEffect } from 'react';
import { Award, Zap, BookOpen, Clock, ChevronRight, Sparkles, User, Medal, Crown, LayoutDashboard, Feather, Swords, Edit2, Camera, Check, X, Leaf } from 'lucide-react';
import { UserStats, JournalEntry } from '../types';
import JournalList from './JournalList';

interface ProfileViewProps {
  stats: UserStats;
  journalEntries: JournalEntry[];
  onWordClick: (word: string) => void;
  onEditJournalEntry: (entry: JournalEntry) => void;
  onUpdateStats: (newStats: UserStats) => void;
  onEditStateChange?: (isOpen: boolean) => void;
  theme?: 'LIGHT' | 'DARK' | 'PARCHMENT';
}

type ProfileTab = 'DASHBOARD' | 'JOURNAL';

const AVATARS = [
  { id: 'default', icon: User, color: 'from-gray-500 to-gray-700', name: 'Gezgin' },
  { id: 'academic', icon: Feather, color: 'from-[#C19A6B] to-[#8B5A2B]', name: 'Bilgin' },
  { id: 'nature', icon: Leaf, color: 'from-emerald-500 to-teal-700', name: 'Doğa' },
  { id: 'mystic', icon: Sparkles, color: 'from-purple-500 to-indigo-700', name: 'Mistik' },
  { id: 'warrior', icon: Swords, color: 'from-red-500 to-orange-700', name: 'Savaşçı' },
];

const ProfileView: React.FC<ProfileViewProps> = ({ stats, journalEntries, onWordClick, onEditJournalEntry, onUpdateStats, onEditStateChange, theme = 'LIGHT' }) => {
  const [activeTab, setActiveTab] = useState<ProfileTab>('DASHBOARD');
  const [showEditModal, setShowEditModal] = useState(false);
  
  // Explicit text colors
  const textColor = theme === 'DARK' ? 'text-white' : (theme === 'PARCHMENT' ? 'text-[#5C4033]' : 'text-[#1A2238]');
  const subTextColor = theme === 'DARK' ? 'text-gray-400' : (theme === 'PARCHMENT' ? 'text-[#8C7060]' : 'text-gray-600');
  const cardBg = theme === 'DARK' ? 'bg-gray-800 border-gray-700' : (theme === 'PARCHMENT' ? 'bg-[#F9F2E6] border-[#E8DCC4]' : 'bg-gray-50 border-gray-100');
  
  // Temporary state for editing
  const [tempUsername, setTempUsername] = useState(stats.username);
  const [tempBio, setTempBio] = useState(stats.bio);
  const [tempAvatar, setTempAvatar] = useState(stats.avatar);

  useEffect(() => {
    if (onEditStateChange) {
      onEditStateChange(showEditModal);
    }
    return () => {
      if (onEditStateChange) onEditStateChange(false);
    };
  }, [showEditModal, onEditStateChange]);

  const percentage = Math.min(100, (stats.dailyProgress / stats.dailyGoal) * 100);
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const currentAvatar = AVATARS.find(a => a.id === stats.avatar) || AVATARS[0];
  const AvatarIcon = currentAvatar.icon;

  const handleSaveProfile = () => {
    onUpdateStats({
      ...stats,
      username: tempUsername,
      bio: tempBio,
      avatar: tempAvatar
    });
    setShowEditModal(false);
  };

  const openEditModal = () => {
    setTempUsername(stats.username);
    setTempBio(stats.bio);
    setTempAvatar(stats.avatar);
    setShowEditModal(true);
  }

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <div className="px-5 py-8 text-center relative">
        <div className="relative w-40 h-40 mx-auto group cursor-pointer" onClick={openEditModal}>
          <svg className="w-full h-full transform -rotate-90 drop-shadow-xl" viewBox="0 0 128 128">
            <defs>
              <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#C19A6B" />
                <stop offset="50%" stopColor="#F3E5AB" />
                <stop offset="100%" stopColor="#996515" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
                <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            <circle cx="64" cy="64" r={radius} stroke="currentColor" strokeWidth="2" fill="transparent" className="text-gray-200 dark:text-gray-700 opacity-60" />
            <circle cx="64" cy="64" r={radius} stroke="url(#goldGradient)" strokeWidth="5" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" fill="transparent" className="transition-all duration-1000 ease-out" filter="url(#glow)" />
          </svg>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`w-[88px] h-[88px] rounded-full flex items-center justify-center shadow-inner border overflow-hidden relative ${theme === 'DARK' ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-100'}`}>
              <div className={`w-full h-full bg-gradient-to-br ${currentAvatar.color} flex items-center justify-center opacity-90`}>
                <AvatarIcon className="w-10 h-10 text-white drop-shadow-md" />
              </div>
              
              {/* Edit Overlay */}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                 <Camera className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className={`absolute bottom-3 right-3 w-10 h-10 rounded-full border-[3px] flex items-center justify-center shadow-lg z-10 hover:scale-110 transition-transform ${theme === 'DARK' ? 'bg-[#1A2238] border-[#1A2238]' : 'bg-white border-white'}`}>
             <div className="w-full h-full rounded-full bg-[#C19A6B] flex items-center justify-center">
                <Edit2 className="w-4 h-4 text-white" />
             </div>
          </div>
        </div>

        <div className="mt-4 space-y-2">
           <div>
             <h1 onClick={openEditModal} className={`text-2xl font-serif font-bold cursor-pointer hover:text-[#C19A6B] transition-colors ${textColor}`}>{stats.username}</h1>
             <p className={`text-sm font-serif italic max-w-xs mx-auto ${subTextColor}`}>{stats.bio}</p>
           </div>
           
           <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border shadow-sm mt-2 ${theme === 'DARK' ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-200'}`}>
            <Crown className="w-3 h-3 text-[#C19A6B]" />
            <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${theme === 'DARK' ? 'text-gray-300' : 'text-[#4A5568]'}`}>{stats.rank}</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className={`sticky top-16 z-30 backdrop-blur-md border-b ${theme === 'DARK' ? 'bg-[#111827]/80 border-gray-800' : 'bg-white/80 border-gray-100'}`}>
        <div className="max-w-md mx-auto px-5 flex">
          <button onClick={() => setActiveTab('DASHBOARD')} className={`flex-1 py-4 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${activeTab === 'DASHBOARD' ? 'border-[#C19A6B] text-[#C19A6B]' : `border-transparent ${subTextColor} hover:text-[#1A2238]`}`}>
            <LayoutDashboard className="w-4 h-4" /> Panel
          </button>
          <button onClick={() => setActiveTab('JOURNAL')} className={`flex-1 py-4 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${activeTab === 'JOURNAL' ? 'border-[#C19A6B] text-[#C19A6B]' : `border-transparent ${subTextColor} hover:text-[#1A2238]`}`}>
            <Feather className="w-4 h-4" /> Günlük
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-5 py-8 space-y-10 pb-24">
        {activeTab === 'DASHBOARD' ? (
          <div className="space-y-10 animate-fade-in">
            <div className="flex flex-col items-center">
               <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-1">Günlük İlerleme</h2>
               <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-serif font-bold text-[#C19A6B]">{stats.dailyProgress}</span>
                  <span className="text-xs font-serif text-gray-400 uppercase tracking-wider">/</span>
                  <span className={`text-2xl font-serif font-bold ${textColor}`}>{stats.dailyGoal}</span>
                  <span className="text-xs font-serif text-gray-400 uppercase tracking-wider ml-1">Kelime</span>
               </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className={`p-4 rounded-2xl border shadow-sm flex flex-col items-center text-center ${cardBg}`}>
                <BookOpen className="w-5 h-5 text-gray-400 mb-2" />
                <span className={`text-2xl font-serif font-bold ${textColor}`}>{stats.wordsMastered}</span>
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.15em]">Öğrenildi</span>
              </div>
              <div className={`p-4 rounded-2xl border shadow-sm flex flex-col items-center text-center ${cardBg}`}>
                <Zap className="w-5 h-5 text-gray-400 mb-2" />
                <span className={`text-2xl font-serif font-bold ${textColor}`}>{stats.streak}</span>
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.15em]">Seri</span>
              </div>
               <div className={`p-4 rounded-2xl border shadow-sm flex flex-col items-center text-center ${cardBg}`}>
                <Swords className="w-5 h-5 text-gray-400 mb-2" />
                <span className={`text-2xl font-serif font-bold ${textColor}`}>{stats.highScore}</span>
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.15em]">En Yüksek</span>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                 <div className="h-[1px] bg-gradient-to-r from-transparent to-gray-200 dark:to-gray-800 flex-1" />
                 <h3 className="text-xs font-bold text-[#C19A6B] uppercase tracking-[0.2em] whitespace-nowrap">Akademik Onurlar</h3>
                 <div className="h-[1px] bg-gradient-to-l from-transparent to-gray-200 dark:to-gray-800 flex-1" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {stats.achievements.map((ach) => {
                  const hasProgress = ach.progress !== undefined && ach.progress > 0 && !ach.unlocked;
                  const isLocked = !ach.unlocked && !hasProgress;
                  const achCircumference = 2 * Math.PI * 22; // radius = 22 for 56x56 div
                  const strokeDashoffset = achCircumference - ((ach.progress || 0) / 100) * achCircumference;

                  return (
                    <div key={ach.id} className={`p-4 rounded-xl border flex flex-col items-center text-center gap-3 relative transition-all duration-300
                      ${ach.unlocked ? `bg-gradient-to-b border-[#C19A6B]/30 shadow-[0_4px_12px_rgba(193,154,107,0.1)] ${theme === 'DARK' ? 'from-gray-800 to-gray-900' : 'from-[#FFFDF5] to-white'}` : ''}
                      ${hasProgress ? cardBg : ''}
                      ${isLocked ? `${theme === 'DARK' ? 'bg-gray-800/50 border-gray-800' : 'bg-gray-50 border-gray-100'} opacity-60 grayscale` : ''}
                    `}>
                      {ach.unlocked && <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#C19A6B]/50 to-transparent" />}
                      
                      <div className="relative w-14 h-14">
                        {hasProgress && (
                          <svg className="absolute inset-0 transform -rotate-90" viewBox="0 0 56 56">
                            <circle cx="28" cy="28" r="22" stroke="currentColor" strokeWidth="2.5" fill="transparent" className="text-gray-200 dark:text-gray-700/50" />
                            <circle cx="28" cy="28" r="22" stroke="url(#goldGradient)" strokeWidth="2.5" strokeDasharray={achCircumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" fill="transparent" className="transition-all duration-1000 ease-out" />
                          </svg>
                        )}
                        <div className={`w-full h-full rounded-full flex items-center justify-center
                          ${ach.unlocked ? 'bg-gradient-to-br from-[#C19A6B] to-[#9C7A52] text-white shadow-lg' : `${theme === 'DARK' ? 'bg-gray-700/50' : 'bg-gray-200'}`}
                          ${hasProgress ? (theme === 'DARK' ? 'bg-gray-700' : 'bg-white') : ''}
                        `}>
                          <Medal className={`w-6 h-6 ${ach.unlocked ? 'text-white' : hasProgress ? 'text-[#C19A6B]' : 'text-gray-400'}`} />
                        </div>
                      </div>

                      <div>
                        <p className={`text-xs font-bold uppercase tracking-wider ${ach.unlocked ? (theme === 'DARK' ? 'text-[#E5D5B7]' : 'text-[#1A2238]') : isLocked ? 'text-gray-500' : subTextColor}`}>{ach.name}</p>
                        {hasProgress && ach.goal && (
                          <p className="text-[10px] font-bold text-[#C19A6B] mt-1">{stats.wordsMastered} / {ach.goal}</p>
                        )}
                        <p className="text-[9px] text-gray-400 leading-tight mt-1.5 px-2">{ach.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="space-y-4">
              <div className={`flex items-center justify-between border-b pb-2 ${theme === 'DARK' ? 'border-gray-800' : 'border-gray-100'}`}>
                 <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Son Kayıtlar</h3>
                 <Clock className="w-3 h-3 text-gray-300" />
              </div>
              <div className="space-y-2">
                {stats.recentWords.map((word, idx) => (
                  <button key={idx} onClick={() => onWordClick(word)} className={`w-full p-4 rounded-xl border flex items-center justify-between group shadow-sm hover:border-[#C19A6B]/30 ${theme === 'DARK' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                    <div className="flex flex-col items-start gap-1">
                       <span className={`font-serif font-bold text-lg group-hover:text-[#C19A6B] ${textColor}`}>{word}</span>
                       <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Yakın zamanda çalışıldı</span>
                    </div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center group-hover:bg-[#C19A6B]/10 ${theme === 'DARK' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                       <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#C19A6B]" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <JournalList entries={journalEntries} onEdit={onEditJournalEntry} />
        )}
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-fade-in">
          <div className={`w-full max-w-sm rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-slide-up border border-[#C19A6B]/20 ${theme === 'DARK' ? 'bg-[#1A2238]' : 'bg-white'}`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className={`text-lg font-serif font-bold ${theme === 'DARK' ? 'text-[#F3E5AB]' : 'text-[#1A2238]'}`}>Profili Düzenle</h3>
              <button onClick={() => setShowEditModal(false)} className={`p-2 rounded-full ${theme === 'DARK' ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Avatar Selection */}
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 block">Avatar Seç</label>
                <div className="flex justify-between gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {AVATARS.map(avatar => {
                    const Icon = avatar.icon;
                    const isSelected = tempAvatar === avatar.id;
                    return (
                      <button
                        key={avatar.id}
                        onClick={() => setTempAvatar(avatar.id)}
                        className={`flex flex-col items-center gap-2 min-w-[64px]`}
                      >
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isSelected ? 'ring-4 ring-[#C19A6B]/30 scale-110' : 'opacity-60 grayscale hover:opacity-100 hover:grayscale-0'}`}>
                           <div className={`w-full h-full rounded-full bg-gradient-to-br ${avatar.color} flex items-center justify-center`}>
                              <Icon className="w-6 h-6 text-white" />
                           </div>
                           {isSelected && <div className={`absolute top-0 right-0 w-5 h-5 bg-[#C19A6B] rounded-full flex items-center justify-center border-2 ${theme === 'DARK' ? 'border-[#1A2238]' : 'border-white'}`}><Check className="w-3 h-3 text-white" /></div>}
                        </div>
                        <span className={`text-[9px] font-bold uppercase tracking-wider ${isSelected ? 'text-[#C19A6B]' : 'text-gray-400'}`}>{avatar.name}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Text Fields */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">İsim</label>
                  <input 
                    type="text" 
                    value={tempUsername}
                    onChange={(e) => setTempUsername(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border focus:border-[#C19A6B] focus:outline-none font-serif ${theme === 'DARK' ? 'bg-black/20 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                    placeholder="Adınız"
                  />
                </div>
                 <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Biyografi</label>
                  <input 
                    type="text" 
                    value={tempBio}
                    onChange={(e) => setTempBio(e.target.value)}
                    maxLength={40}
                    className={`w-full px-4 py-3 rounded-xl border focus:border-[#C19A6B] focus:outline-none font-serif italic text-sm ${theme === 'DARK' ? 'bg-black/20 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                    placeholder="Kısa bir söz..."
                  />
                  <p className="text-[9px] text-right text-gray-400">{tempBio.length}/40</p>
                </div>
              </div>

              <button 
                onClick={handleSaveProfile}
                className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest text-xs shadow-lg hover:shadow-xl active:scale-[0.98] transition-all ${theme === 'DARK' ? 'bg-[#C19A6B] text-[#1A2238]' : 'bg-[#1A2238] text-white'}`}
              >
                Değişiklikleri Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileView;
