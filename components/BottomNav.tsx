import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const isFavorites = location.search.includes('view=favorites');

  const handleNav = (path: string, search: string = '') => {
    navigate({ pathname: path, search: search });
  };

  const isChat = currentPath.startsWith('/chat');
  const isProfile = currentPath === '/profile';
  const isHome = currentPath === '/' && !isFavorites;

  return (
    <nav className="shrink-0 bg-white dark:bg-[#221910] border-t border-gray-100 dark:border-[#32281e] px-4 py-3 flex justify-between items-center z-50 rounded-t-2xl shadow-[0_-5px_20px_rgba(0,0,0,0.03)] sticky bottom-0 w-full">
      <button 
        onClick={() => handleNav('/')}
        className={`flex flex-col items-center gap-1 transition-colors ${isHome ? 'text-primary' : 'text-[#897561]'}`}
      >
        <span className={`material-symbols-outlined text-[26px] ${isHome ? 'fill-1' : ''}`}>home</span>
        <span className="text-[10px] font-bold">首页</span>
      </button>

      <button 
        onClick={() => handleNav('/chat')}
        className={`flex flex-col items-center gap-1 transition-colors ${isChat ? 'text-primary' : 'text-[#897561]'}`}
      >
        <span className={`material-symbols-outlined text-[26px] ${isChat ? 'fill-1' : ''}`}>chat_bubble</span>
        <span className="text-[10px] font-medium">消息</span>
      </button>

      <button 
        onClick={() => handleNav('/')}
        className="flex flex-col items-center gap-1 text-[#897561] hover:text-primary transition-colors -mt-8 relative group"
      >
        <div className="size-14 rounded-full bg-primary text-white flex items-center justify-center shadow-lg ring-4 ring-white dark:ring-[#221910] transition-transform group-active:scale-95">
          <span className="material-symbols-outlined text-[28px]">pets</span>
        </div>
        <span className="text-[10px] font-medium mt-1">领养</span>
      </button>

      <button 
        onClick={() => handleNav('/', '?view=favorites')}
        className={`flex flex-col items-center gap-1 transition-colors ${isFavorites ? 'text-primary' : 'text-[#897561]'}`}
      >
        <span className={`material-symbols-outlined text-[26px] ${isFavorites ? 'fill-1' : ''}`}>favorite</span>
        <span className="text-[10px] font-medium">收藏</span>
      </button>

      <button 
        onClick={() => handleNav('/profile')}
        className={`flex flex-col items-center gap-1 transition-colors ${isProfile ? 'text-primary' : 'text-[#897561]'}`}
      >
        <span className={`material-symbols-outlined text-[26px] ${isProfile ? 'fill-1' : ''}`}>person</span>
        <span className="text-[10px] font-medium">我的</span>
      </button>
    </nav>
  );
};

export default BottomNav;