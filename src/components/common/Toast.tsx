import React from 'react';
import { CheckCircle, Info } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Toast: React.FC = () => {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-slate-900 border border-brand-500/40 text-slate-100 rounded-xl shadow-2xl backdrop-blur-md animate-slide-up">
      <CheckCircle className="w-5 h-5 text-brand-400 shrink-0" />
      <span className="text-sm font-medium">{toastMessage}</span>
    </div>
  );
};
