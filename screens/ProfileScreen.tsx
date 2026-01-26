import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { useAuth } from '../contexts/AuthContext';
import { getUserStats } from '../services/userService';
import { signOut } from '../services/authService';

const ProfileScreen: React.FC = () => {
  const navigate = useNavigate();
  const { profile, refreshProfile } = useAuth();
  const [stats, setStats] = useState({ applications: 0, favorites: 0, adopted: 0 });

  useEffect(() => {
    const loadStats = async () => {
      const userStats = await getUserStats();
      setStats(userStats);
    };
    loadStats();
  }, []);

  const MENU_ITEMS = [
    { icon: 'person', label: '个人信息', badge: '', path: '/profile/edit' },
    { icon: 'history', label: '申请记录', badge: stats.applications > 0 ? String(stats.applications) : '', path: '/profile/applications' },
  ];

  const handleMenuClick = (item: typeof MENU_ITEMS[0]) => {
    if (item.path.startsWith('/')) {
      navigate(item.path);
    } else {
      alert(`功能 "${item.label}" 正在开发中... 🚧`);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="flex h-full w-full flex-col bg-background-light dark:bg-background-dark min-h-screen">
      {/* Header / Profile Card */}
      <div className="px-6 pt-12 pb-8 bg-white dark:bg-[#221910] rounded-b-[2.5rem] shadow-soft z-10">
        <div className="flex items-center gap-4 mb-6">
          <div className="size-20 rounded-full border-4 border-white dark:border-[#32281e] shadow-lg overflow-hidden">
            <img
              src={profile?.avatar_url || 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop'}
              alt="User"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-[#181411] dark:text-white mb-1">{profile?.name || '用户'}</h1>
            <p className="text-sm text-[#897561]">{profile?.location || '未设置'}</p>
          </div>
          <button
            onClick={() => navigate('/profile/edit')}
            className="size-10 rounded-full bg-gray-50 dark:bg-[#32281e] flex items-center justify-center text-[#181411] dark:text-white transition-colors hover:bg-gray-100 dark:hover:bg-[#4a3b32]"
          >
            <span className="material-symbols-outlined">edit</span>
          </button>
        </div>

        {/* Stats */}
        <div className="flex justify-between items-center px-4">
          <button
            onClick={() => navigate('/profile/applications')}
            className="flex flex-col items-center gap-1 flex-1 active:opacity-70 transition-opacity"
          >
            <span className="text-xl font-bold text-[#181411] dark:text-white">{stats.applications}</span>
            <span className="text-xs text-[#897561]">申请中</span>
          </button>
          <div className="w-px h-8 bg-gray-200 dark:bg-white/10"></div>
          <button
            onClick={() => navigate('/?view=favorites')}
            className="flex flex-col items-center gap-1 flex-1 active:opacity-70 transition-opacity"
          >
            <span className="text-xl font-bold text-[#181411] dark:text-white">{stats.favorites}</span>
            <span className="text-xs text-[#897561]">已收藏</span>
          </button>
          <div className="w-px h-8 bg-gray-200 dark:bg-white/10"></div>
          <div className="flex flex-col items-center gap-1 flex-1">
            <span className="text-xl font-bold text-[#181411] dark:text-white">{stats.adopted}</span>
            <span className="text-xs text-[#897561]">已领养</span>
          </div>
        </div>
      </div>

      {/* Menu List */}
      <main className="flex-1 px-6 py-8">
        <h2 className="text-lg font-bold text-[#181411] dark:text-white mb-4">我的服务</h2>
        <div className="flex flex-col gap-3">
          {MENU_ITEMS.map((item, index) => (
            <button
              key={index}
              onClick={() => handleMenuClick(item)}
              className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-[#32281e] shadow-sm active:scale-[0.98] transition-transform hover:shadow-md"
            >
              <div className="size-10 rounded-full bg-orange-50 dark:bg-orange-900/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">{item.icon}</span>
              </div>
              <span className="flex-1 text-left font-medium text-[#181411] dark:text-white">{item.label}</span>
              {item.badge && (
                <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold shadow-sm">
                  {item.badge}
                </span>
              )}
              <span className="material-symbols-outlined text-gray-300 dark:text-gray-600 text-[20px]">chevron_right</span>
            </button>
          ))}
        </div>

        <button
          onClick={handleLogout}
          className="mt-8 w-full p-4 rounded-2xl border border-red-100 dark:border-red-900/30 text-red-500 font-bold active:bg-red-50 dark:active:bg-red-900/10 transition-colors flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined">logout</span>
          退出登录
        </button>
      </main>

      <BottomNav />
    </div>
  );
};

export default ProfileScreen;