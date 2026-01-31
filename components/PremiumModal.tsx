
import React from 'react';
import { X, Crown, Check, Sparkles, Infinity, Zap, Lock } from 'lucide-react';
import { UserStats } from '../types';

interface PremiumModalProps {
  onClose: () => void;
  onUpgrade: () => void;
  isOpen: boolean;
  stats: UserStats;
}

const PremiumModal: React.FC<PremiumModalProps> = ({ onClose, onUpgrade, isOpen, stats }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[#1A2238] w-full max-w-md rounded-3xl overflow-hidden shadow-2xl relative border border-[#C19A6B]/30 flex flex-col max-h-[90vh]">
        
        {/* Background FX */}
        <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-[#C19A6B]/20 to-transparent pointer-events-none" />
        <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-[#C19A6B]/10 blur-3xl pointer-events-none" />

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-black/20 text-gray-400 hover:text-white hover:bg-black/40 transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 text-center relative z-10">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-[#C19A6B] to-[#8B5A2B] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(193,154,107,0.4)] mb-6">
            <Crown className="w-10 h-10 text-[#1A2238]" />
          </div>
          
          <h2 className="text-3xl font-serif font-bold text-white mb-2">Lexicon <span className="text-[#C19A6B]">Hezarfen</span></h2>
          <p className="text-gray-400 text-sm">Dilin sınırlarını kaldırın. Sınırsız erişim.</p>
        </div>

        <div className="flex-1 overflow-y-auto px-6 space-y-4 mb-6">
            {/* Limit Info */}
            <div className="bg-black/20 rounded-xl p-4 border border-white/5 flex items-center justify-between">
                <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider">Mevcut Plan</p>
                    <p className="text-white font-bold">Gezgin (Ücretsiz)</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-gray-400 uppercase tracking-wider">Kalan Haklar</p>
                    <p className="text-[#C19A6B] font-bold">
                        {3 - stats.usage.searches <= 0 ? 0 : 3 - stats.usage.searches} / 3 Arama
                    </p>
                </div>
            </div>

            <div className="space-y-3">
                <FeatureRow icon={Infinity} text="Sınırsız Kelime Analizi" isPremium />
                <FeatureRow icon={Zap} text="Dil Kahini (Canlı Sesli Sohbet)" isPremium />
                <FeatureRow icon={Sparkles} text="Görselleştirme & Cilt Yaratma" isPremium />
                <FeatureRow icon={Lock} text="Gelişmiş Etimoloji Haritaları" isPremium />
            </div>
        </div>

        <div className="p-6 bg-black/20 border-t border-white/5">
            <div className="text-center mb-4">
                <span className="text-3xl font-bold text-white">₺149.99</span>
                <span className="text-gray-400 text-sm"> / ay</span>
            </div>
            <button 
                onClick={onUpgrade}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#C19A6B] to-[#996515] text-[#1A2238] font-bold uppercase tracking-widest text-sm shadow-lg hover:shadow-[#C19A6B]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
            >
                <Sparkles className="w-4 h-4" /> Hezarfen'e Yükselt
            </button>
            <p className="text-[10px] text-center text-gray-500 mt-4">
                İstediğiniz zaman iptal edebilirsiniz. 
            </p>
        </div>
      </div>
    </div>
  );
};

const FeatureRow = ({ icon: Icon, text, isPremium }: { icon: any, text: string, isPremium?: boolean }) => (
    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
        <div className={`p-2 rounded-full ${isPremium ? 'bg-[#C19A6B]/10 text-[#C19A6B]' : 'bg-gray-800 text-gray-400'}`}>
            <Icon className="w-4 h-4" />
        </div>
        <span className="text-gray-200 text-sm font-medium">{text}</span>
        {isPremium && <Check className="w-4 h-4 text-[#C19A6B] ml-auto" />}
    </div>
);

export default PremiumModal;
