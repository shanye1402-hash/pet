import React from 'react';
import { useNavigate } from 'react-router-dom';

const SuccessScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
             <span className="material-symbols-outlined text-[600px] text-primary rotate-12">pets</span>
        </div>

      <div className="relative z-10 flex flex-col items-center text-center animate-in fade-in zoom-in duration-500">
        <div className="size-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-6 shadow-lg shadow-green-500/10">
          <span className="material-symbols-outlined text-5xl text-green-600 dark:text-green-400">check_circle</span>
        </div>
        
        <h1 className="text-3xl font-bold text-text-main dark:text-white mb-3">申请已提交!</h1>
        <p className="text-text-secondary dark:text-text-secondary-dark text-base max-w-[280px] leading-relaxed mb-10">
          感谢您的爱心！我们会尽快审核您的申请，并在24小时内与您联系。
        </p>

        <button 
          onClick={() => navigate('/')}
          className="w-full max-w-xs h-14 rounded-xl bg-primary hover:bg-orange-600 active:scale-[0.98] transition-all text-white text-base font-bold shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 font-display"
        >
          返回首页
          <span className="material-symbols-outlined">home</span>
        </button>
      </div>
    </div>
  );
};

export default SuccessScreen;