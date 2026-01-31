
import React, { useEffect, useState } from 'react';
import { Check, Info, Award, X, AlertCircle } from 'lucide-react';

export type ToastType = 'SUCCESS' | 'INFO' | 'ACHIEVEMENT' | 'ERROR';

export interface ToastData {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContainerProps {
  toasts: ToastData[];
  onDismiss: (id: string) => void;
}

const ToastNotification: React.FC<{ toast: ToastData; onDismiss: (id: string) => void; index: number }> = ({ toast, onDismiss, index }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onDismiss(toast.id), 300); // Wait for exit animation
    }, 4000); // 4 seconds duration

    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => onDismiss(toast.id), 300);
  };

  const getStyle = () => {
    switch (toast.type) {
      case 'ACHIEVEMENT':
        return {
          bg: 'bg-[#1A2238]',
          border: 'border-[#C19A6B]',
          icon: <Award className="w-5 h-5 text-[#C19A6B]" />,
          textColor: 'text-[#F3E5AB]'
        };
      case 'SUCCESS':
        return {
          bg: 'bg-white dark:bg-[#1F2937]',
          border: 'border-emerald-500',
          icon: <Check className="w-5 h-5 text-emerald-500" />,
          textColor: 'text-gray-800 dark:text-white'
        };
      case 'ERROR':
        return {
          bg: 'bg-white dark:bg-[#1F2937]',
          border: 'border-red-500',
          icon: <AlertCircle className="w-5 h-5 text-red-500" />,
          textColor: 'text-gray-800 dark:text-white'
        };
      default:
        return {
          bg: 'bg-white dark:bg-[#1F2937]',
          border: 'border-blue-500',
          icon: <Info className="w-5 h-5 text-blue-500" />,
          textColor: 'text-gray-800 dark:text-white'
        };
    }
  };

  const style = getStyle();

  return (
    <div
      className={`
        pointer-events-auto w-full max-w-sm rounded-xl border-l-4 shadow-xl p-4 flex items-center gap-3 relative overflow-hidden transition-all duration-300 transform
        ${style.bg} ${style.border}
        ${isExiting ? 'opacity-0 translate-y-[-10px] scale-95' : 'opacity-100 translate-y-0 scale-100'}
        animate-slide-down
      `}
      style={{ marginTop: index === 0 ? 0 : '0.5rem' }}
    >
      <div className="flex-shrink-0">
        {style.icon}
      </div>
      <div className={`flex-1 text-sm font-medium font-serif ${style.textColor}`}>
        {toast.type === 'ACHIEVEMENT' && <span className="block text-[10px] font-bold text-[#C19A6B] uppercase tracking-wider mb-0.5">BAŞARIM AÇILDI</span>}
        {toast.message}
      </div>
      <button onClick={handleDismiss} className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
        <X className="w-4 h-4 opacity-50" />
      </button>
      
      {/* Progress Bar for Auto Dismiss */}
      <div className="absolute bottom-0 left-0 h-0.5 bg-current opacity-20 w-full">
         <div className="h-full bg-current w-full animate-shrink-width origin-left" style={{ animationDuration: '4s' }} />
      </div>

      <style>{`
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shrink-width {
          from { transform: scaleX(1); }
          to { transform: scaleX(0); }
        }
        .animate-slide-down { animation: slide-down 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        .animate-shrink-width { animation: shrink-width 4s linear forwards; }
      `}</style>
    </div>
  );
};

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed top-4 left-0 right-0 z-[110] flex flex-col items-center px-4 pointer-events-none">
      {toasts.map((toast, index) => (
        <ToastNotification key={toast.id} toast={toast} onDismiss={onDismiss} index={index} />
      ))}
    </div>
  );
};

export default ToastNotification;
