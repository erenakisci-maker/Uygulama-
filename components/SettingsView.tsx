
import React from 'react';
import { Moon, Sun, Scroll, Volume2, Database, ArrowLeft, Download, Target, Brain, Crown, Zap, BarChart3, Lock, AlertTriangle } from 'lucide-react';
import { UserSettings, UserStats, WordData } from '../types';

interface SettingsViewProps {
  settings: UserSettings;
  stats: UserStats;
  favorites: WordData[];
  onUpdateSettings: (settings: UserSettings) => void;
  onUpdateStats: (stats: UserStats) => void;
  onBack: () => void;
  onTriggerPremium?: () => void;
  onDowngrade?: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ settings, stats, favorites, onUpdateSettings, onUpdateStats, onBack, onTriggerPremium, onDowngrade }) => {
  
  // Theme Color Palettes (Hardcoded to bypass Tailwind issues)
  const themeColors = {
    LIGHT: { text: '#1A2238', subText: '#4B5563', bg: '#FFFFFF', border: '#E5E7EB', cardBg: '#FFFFFF' },
    DARK: { text: '#FFFFFF', subText: '#9CA3AF', bg: '#1F2937', border: '#374151', cardBg: '#1F2937' },
    PARCHMENT: { text: '#5C4033', subText: '#8C7060', bg: '#F9F2E6', border: '#E8DCC4', cardBg: '#F9F2E6' }
  };

  const activeColors = themeColors[settings.theme];
  const isPremium = stats.plan === 'PREMIUM';

  const toggleSetting = (key: keyof UserSettings) => {
    if (typeof settings[key] === 'boolean') {
      onUpdateSettings({ ...settings, [key]: !settings[key] });
    }
  };

  const exportVault = () => {
    const dataStr = JSON.stringify(favorites, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = 'lexicon-elite-manuscript.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="px-5 py-6 animate-fade-in space-y-8 pb-24">
      <div className="flex items-center gap-4 mb-2">
         <button onClick={onBack} className="p-2 -ml-2 hover:text-[#C19A6B] transition-colors" style={{ color: activeColors.subText }}>
            <ArrowLeft className="w-6 h-6" />
         </button>
         <h2 className="text-2xl font-serif font-bold" style={{ color: activeColors.text }}>Elit Tercihler</h2>
      </div>

      {/* Membership & Quota Section */}
      <section className="space-y-4">
        <h3 className="text-[10px] font-bold text-[#C19A6B] uppercase tracking-[0.2em]">Üyelik & Kota</h3>
        <div className="rounded-2xl border overflow-hidden shadow-sm relative" style={{ backgroundColor: activeColors.cardBg, borderColor: activeColors.border }}>
           {isPremium && (
             <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#C19A6B] via-[#F3E5AB] to-[#C19A6B]" />
           )}
           
           <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                 <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isPremium ? 'bg-gradient-to-br from-[#C19A6B] to-[#996515]' : 'bg-gray-200 dark:bg-gray-700'}`}>
                       <Crown className={`w-6 h-6 ${isPremium ? 'text-[#1A2238]' : 'text-gray-500'}`} />
                    </div>
                    <div>
                       <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Mevcut Plan</p>
                       <h4 className="text-xl font-serif font-bold" style={{ color: activeColors.text }}>{isPremium ? 'Hezarfen' : 'Gezgin'}</h4>
                    </div>
                 </div>
                 {!isPremium && (
                   <button onClick={onTriggerPremium} className="px-4 py-2 rounded-lg bg-[#C19A6B] text-[#1A2238] text-xs font-bold uppercase tracking-wider shadow-lg hover:bg-[#B0895B] transition-colors">
                     Yükselt
                   </button>
                 )}
              </div>

              {/* Usage Stats */}
              <div className="space-y-4">
                 {isPremium ? (
                   <div className="flex items-center gap-2 text-[#C19A6B] p-3 rounded-lg bg-[#C19A6B]/10 border border-[#C19A6B]/20">
                      <Zap className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-wider">Sınırsız Erişim Aktif</span>
                   </div>
                 ) : (
                   <>
                     <UsageBar label="Günlük Arama" current={stats.usage.searches} max={3} color={activeColors.text} trackColor={settings.theme === 'DARK' ? '#374151' : '#E5E7EB'} />
                     <UsageBar label="İlham Atölyesi" current={stats.usage.muse} max={1} color={activeColors.text} trackColor={settings.theme === 'DARK' ? '#374151' : '#E5E7EB'} />
                     <UsageBar label="Akademik Analiz" current={stats.usage.analysis || 0} max={1} color={activeColors.text} trackColor={settings.theme === 'DARK' ? '#374151' : '#E5E7EB'} />
                     <div className="flex items-center justify-between opacity-50">
                        <span className="text-xs font-bold uppercase tracking-wider" style={{ color: activeColors.subText }}>Dil Kahini</span>
                        <Lock className="w-3 h-3 text-gray-400" />
                     </div>
                   </>
                 )}
              </div>
           </div>
        </div>
      </section>

      {/* Appearance Section */}
      <section className="space-y-4">
        <h3 className="text-[10px] font-bold text-[#C19A6B] uppercase tracking-[0.2em]">Görsel Ortam</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'LIGHT', icon: Sun, label: 'Kağıt' },
            { id: 'DARK', icon: Moon, label: 'Mürekkep' },
            { id: 'PARCHMENT', icon: Scroll, label: 'Parşömen' }
          ].map((theme) => (
            <button
              key={theme.id}
              onClick={() => onUpdateSettings({ ...settings, theme: theme.id as any })}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${settings.theme === theme.id ? 'bg-[#C19A6B]/5 border-[#C19A6B] ring-1 ring-[#C19A6B]' : 'shadow-sm'}`}
              style={{ 
                backgroundColor: settings.theme === theme.id ? undefined : activeColors.cardBg,
                borderColor: settings.theme === theme.id ? undefined : activeColors.border
              }}
            >
              <theme.icon className={`w-6 h-6 ${settings.theme === theme.id ? 'text-[#C19A6B]' : 'text-gray-400'}`} />
              <span className={`text-[10px] font-bold uppercase tracking-widest ${settings.theme === theme.id ? 'text-[#C19A6B]' : 'text-gray-400'}`}>{theme.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Linguistic Calibration */}
      <section className="space-y-4">
        <h3 className="text-[10px] font-bold text-[#C19A6B] uppercase tracking-[0.2em]">Dilbilimsel Kalibrasyon</h3>
        <div className="rounded-2xl border overflow-hidden shadow-sm" style={{ backgroundColor: activeColors.cardBg, borderColor: activeColors.border }}>
          
          {/* Complexity Slider */}
          <div className="p-5 space-y-4 border-b" style={{ borderColor: settings.theme === 'DARK' ? '#374151' : '#F3F4F6' }}>
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-4">
                 <Brain className="w-5 h-5 text-gray-400" />
                 <div>
                   <p className="font-medium" style={{ color: activeColors.text }}>Bilişsel Karmaşıklık</p>
                   <p className="text-xs" style={{ color: activeColors.subText }}>Tanımlar için analiz derinliği</p>
                 </div>
               </div>
            </div>
            <div className="grid grid-cols-2 gap-2 p-1 rounded-xl" style={{ backgroundColor: settings.theme === 'DARK' ? '#111827' : '#F9FAFB' }}>
              <button 
                onClick={() => onUpdateSettings({ ...settings, complexity: 'STANDARD' })}
                className={`py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${settings.complexity === 'STANDARD' ? 'bg-white shadow' : 'text-gray-400'}`}
                style={settings.complexity === 'STANDARD' ? { color: settings.theme === 'DARK' ? '#1A2238' : activeColors.text } : {}}
              >Standart</button>
              <button 
                onClick={() => onUpdateSettings({ ...settings, complexity: 'POLYMATH' })}
                className={`py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${settings.complexity === 'POLYMATH' ? 'bg-white shadow' : 'text-gray-400'}`}
                style={settings.complexity === 'POLYMATH' ? { color: settings.theme === 'DARK' ? '#1A2238' : activeColors.text } : {}}
              >Hezarfen</button>
            </div>
          </div>

          {/* Daily Goal Picker */}
          <div className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Target className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium" style={{ color: activeColors.text }}>Günlük Çaba</p>
                <p className="text-xs" style={{ color: activeColors.subText }}>Hedef kelime keşif amacı</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
               <button 
                 onClick={() => onUpdateStats({ ...stats, dailyGoal: Math.max(1, stats.dailyGoal - 1) })}
                 className="w-8 h-8 rounded-lg flex items-center justify-center font-bold"
                 style={{ backgroundColor: settings.theme === 'DARK' ? '#374151' : '#F3F4F6', color: activeColors.text }}
               >-</button>
               <span className="text-sm font-bold text-[#C19A6B] w-4 text-center">{stats.dailyGoal}</span>
               <button 
                 onClick={() => onUpdateStats({ ...stats, dailyGoal: Math.min(20, stats.dailyGoal + 1) })}
                 className="w-8 h-8 rounded-lg flex items-center justify-center font-bold"
                 style={{ backgroundColor: settings.theme === 'DARK' ? '#374151' : '#F3F4F6', color: activeColors.text }}
               >+</button>
            </div>
          </div>
        </div>
      </section>

      {/* Engine Toggles */}
      <section className="space-y-4">
        <h3 className="text-[10px] font-bold text-[#C19A6B] uppercase tracking-[0.2em]">Sistem Protokolleri</h3>
        <div className="rounded-2xl border overflow-hidden shadow-sm" style={{ backgroundColor: activeColors.cardBg, borderColor: activeColors.border }}>
          <div className="p-5 flex items-center justify-between border-b" style={{ borderColor: settings.theme === 'DARK' ? '#374151' : '#F3F4F6' }}>
            <div className="flex items-center gap-4">
              <Volume2 className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium" style={{ color: activeColors.text }}>Fonetik Lehçe</p>
                <p className="text-xs" style={{ color: activeColors.subText }}>Birleşik Krallık (Oxford) vs ABD (Atlantic)</p>
              </div>
            </div>
            <div className="flex rounded-lg p-1" style={{ backgroundColor: settings.theme === 'DARK' ? '#111827' : '#F9FAFB' }}>
              <button 
                onClick={() => onUpdateSettings({ ...settings, dialect: 'UK' })}
                className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${settings.dialect === 'UK' ? 'bg-white shadow' : 'text-gray-400'}`}
                style={settings.dialect === 'UK' ? { color: settings.theme === 'DARK' ? '#1A2238' : activeColors.text } : {}}
              >UK</button>
              <button 
                onClick={() => onUpdateSettings({ ...settings, dialect: 'US' })}
                className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${settings.dialect === 'US' ? 'bg-white shadow' : 'text-gray-400'}`}
                style={settings.dialect === 'US' ? { color: settings.theme === 'DARK' ? '#1A2238' : activeColors.text } : {}}
              >US</button>
            </div>
          </div>
          
          <div onClick={() => toggleSetting('offlineEnabled')} className="p-5 flex items-center justify-between cursor-pointer active:opacity-70 transition-opacity">
            <div className="flex items-center gap-4">
              <Database className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium" style={{ color: activeColors.text }}>Anlamsal Önbellek</p>
                <p className="text-xs" style={{ color: activeColors.subText }}>Hızlı yerel sözlük aramaları</p>
              </div>
            </div>
            <div className={`w-10 h-5 rounded-full transition-colors relative ${settings.offlineEnabled ? 'bg-[#C19A6B]' : ''}`} style={{ backgroundColor: settings.offlineEnabled ? '#C19A6B' : (settings.theme === 'DARK' ? '#374151' : '#E5E7EB') }}>
               <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${settings.offlineEnabled ? 'left-6' : 'left-1'}`} />
            </div>
          </div>
        </div>
      </section>

      {/* Data Management */}
      <section className="space-y-4">
        <h3 className="text-[10px] font-bold text-[#C19A6B] uppercase tracking-[0.2em]">El Yazması Yönetimi</h3>
        <button 
          onClick={exportVault}
          className="w-full p-5 bg-[#1A2238] text-white rounded-2xl flex items-center justify-between hover:bg-[#2C354B] transition-all shadow-xl active:scale-[0.98]"
        >
          <div className="flex items-center gap-4">
            <Download className="w-5 h-5 text-[#C19A6B]" />
            <div className="text-left">
              <p className="font-medium">Kasayı Dışa Aktar</p>
              <p className="text-[10px] opacity-60 uppercase tracking-widest">.JSON El Yazması Oluştur</p>
            </div>
          </div>
          <span className="bg-white/10 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">{favorites.length} Kelime</span>
        </button>
        
        {isPremium && onDowngrade && (
            <button 
                onClick={onDowngrade}
                className="w-full p-4 flex items-center justify-center gap-2 text-xs font-bold text-red-400 hover:bg-red-500/10 rounded-xl transition-colors mt-4"
            >
                <AlertTriangle className="w-4 h-4" /> Üyeliği İptal Et (Test)
            </button>
        )}
      </section>

      <div className="pt-8 text-center">
        <div className="flex justify-center gap-2 mb-2">
           <div className="w-1.5 h-1.5 rounded-full bg-[#C19A6B]" />
           <div className="w-1.5 h-1.5 rounded-full bg-[#C19A6B] opacity-50" />
           <div className="w-1.5 h-1.5 rounded-full bg-[#C19A6B] opacity-20" />
        </div>
        <p className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: activeColors.subText }}>Lexicon v2.5.0</p>
        <p className="text-[10px] italic" style={{ color: activeColors.subText }}>Akademik Topluluk için derlenmiştir</p>
      </div>
    </div>
  );
};

const UsageBar = ({ label, current, max, color, trackColor }: { label: string, current: number, max: number, color: string, trackColor: string }) => {
  const percentage = Math.min(100, (current / max) * 100);
  return (
    <div className="space-y-1.5">
       <div className="flex justify-between text-xs">
          <span className="font-medium" style={{ color }}>{label}</span>
          <span className="font-bold text-[#C19A6B]">{Math.max(0, max - current)}/{max} Hak</span>
       </div>
       <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: trackColor }}>
          <div className="h-full bg-[#C19A6B] transition-all duration-500" style={{ width: `${percentage}%` }} />
       </div>
    </div>
  )
}

export default SettingsView;
