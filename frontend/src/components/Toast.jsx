import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Toast() {
  const { toast } = useAuth();
  if (!toast) return null;

  const typeConfig = {
    success: {
      color: 'text-[#34c759]',
      border: 'border-[#34c759]/30',
      icon: <CheckCircle2 className="w-5 h-5 text-[#34c759] shrink-0" />
    },
    error: {
      color: 'text-[#ff3b30]',
      border: 'border-[#ff3b30]/30',
      icon: <AlertCircle className="w-5 h-5 text-[#ff3b30] shrink-0" />
    },
    warning: {
      color: 'text-[#ff9500]',
      border: 'border-[#ff9500]/30',
      icon: <AlertTriangle className="w-5 h-5 text-[#ff9500] shrink-0" />
    },
    info: {
      color: 'text-[#0071e3] dark:text-[#2997ff]',
      border: 'border-[#0071e3]/30',
      icon: <Info className="w-5 h-5 text-[#0071e3] dark:text-[#2997ff] shrink-0" />
    },
  };

  const config = typeConfig[toast.type] || typeConfig.info;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-dynamic-island max-w-md font-sans pointer-events-auto">
      <div className={`liquid-pill px-5 py-3.5 shadow-2xl flex items-center gap-3 border ${config.border} bg-white/80 dark:bg-[#1c1c1e]/85 backdrop-blur-2xl`}>
        {config.icon}
        <div className="flex-1 text-xs sm:text-sm font-medium text-[#1d1d1f] dark:text-[#f5f5f7] leading-snug">
          {toast.message}
        </div>
      </div>
    </div>
  );
}
