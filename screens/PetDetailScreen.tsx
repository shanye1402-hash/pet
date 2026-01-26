import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getPetById, transformPet } from '../services/petService';
import { toggleFavorite, isFavorite } from '../services/favoriteService';
import { Pet } from '../types';

const PetDetailScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFav, setIsFav] = useState(false);

  // Load pet data
  useEffect(() => {
    const loadPet = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const dbPet = await getPetById(id);
        if (dbPet) {
          setPet(transformPet(dbPet));
        }

        const favStatus = await isFavorite(id);
        setIsFav(favStatus);
      } catch (error) {
        console.error('Error loading pet:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPet();
  }, [id]);

  const handleToggleFavorite = async () => {
    if (!id) return;

    try {
      const newStatus = await toggleFavorite(id);
      setIsFav(newStatus);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleChat = () => {
    if (!pet) return;
    navigate(`/chat/${pet.id}`, {
      state: {
        name: pet.shelterName,
        logo: pet.shelterLogo,
        contextText: `我对 ${pet.name} 很感兴趣`
      }
    });
  };

  const handleBack = () => {
    const state = location.state as { from?: string } | null;
    if (state?.from) {
      navigate(state.from);
    } else if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
          <p className="text-[#897561]">加载中...</p>
        </div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="material-symbols-outlined text-6xl text-gray-400">pets</span>
          <p className="text-[#897561]">未找到该宠物</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-primary text-white rounded-full"
          >
            返回首页
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark text-[#1b140d] dark:text-gray-100 font-display transition-colors duration-200">

      {/* Header Actions */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 pt-12 bg-gradient-to-b from-black/40 to-transparent pointer-events-none">
        <button
          onClick={handleBack}
          className="pointer-events-auto flex size-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-colors z-50 cursor-pointer shadow-sm active:scale-95"
          aria-label="Back"
        >
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </button>
        <button
          onClick={handleToggleFavorite}
          className={`pointer-events-auto flex size-12 items-center justify-center rounded-full backdrop-blur-md transition-all group active:scale-95 z-50 cursor-pointer shadow-sm ${isFav ? 'bg-white text-red-500' : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          aria-label="Toggle Favorite"
        >
          <span className={`material-symbols-outlined text-2xl ${isFav ? 'fill-1' : ''}`}>favorite</span>
        </button>
      </div>

      {/* Hero Image */}
      <div className="relative w-full h-[45vh] min-h-[400px]">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url("${pet.image}")` }}
        ></div>
        {/* Pagination Dots */}
        <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-2">
          <div className="h-2 w-6 rounded-full bg-primary shadow-sm"></div>
          <div className="size-2 rounded-full bg-white/60 backdrop-blur-sm shadow-sm"></div>
          <div className="size-2 rounded-full bg-white/60 backdrop-blur-sm shadow-sm"></div>
        </div>
      </div>

      {/* Content Sheet */}
      <div className="relative -mt-8 z-10 flex flex-col gap-6 rounded-t-3xl bg-background-light dark:bg-background-dark px-6 pt-8 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] pb-28">

        {/* Title Section */}
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold tracking-tight text-[#1b140d] dark:text-white">{pet.name}</h1>
            <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
              <span className="material-symbols-outlined text-[20px]">location_on</span>
              <span className="text-base font-medium">{pet.location}</span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-2xl font-bold text-primary">{pet.price}</div>
            <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">领养费</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
          {pet.tags.includes('已打疫苗') && (
            <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-4 py-2 text-sm font-bold text-primary whitespace-nowrap">
              <span className="material-symbols-outlined text-[18px]">verified</span>
              已打疫苗
            </div>
          )}
          {pet.tags.includes('亲人') && (
            <div className="flex items-center gap-1.5 rounded-full bg-orange-100 dark:bg-orange-900/30 px-4 py-2 text-sm font-bold text-orange-700 dark:text-orange-300 whitespace-nowrap">
              <span className="material-symbols-outlined text-[18px]">sentiment_satisfied</span>
              亲人
            </div>
          )}
          {pet.tags.includes('对小孩友好') && (
            <div className="flex items-center gap-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 px-4 py-2 text-sm font-bold text-blue-700 dark:text-blue-300 whitespace-nowrap">
              <span className="material-symbols-outlined text-[18px]">child_care</span>
              对小孩友好
            </div>
          )}
          {!pet.tags.length && (
            <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-4 py-2 text-sm font-bold text-primary whitespace-nowrap">
              <span className="material-symbols-outlined text-[18px]">verified</span>
              健康
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-white dark:bg-[#342a20] p-4 shadow-sm border border-gray-100 dark:border-transparent">
            <div className="rounded-full bg-orange-50 dark:bg-orange-900/20 p-2 text-primary">
              <span className="material-symbols-outlined text-2xl">cake</span>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">年龄</p>
              <p className="text-lg font-bold text-[#1b140d] dark:text-white">{pet.age} {pet.ageUnit}</p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-white dark:bg-[#342a20] p-4 shadow-sm border border-gray-100 dark:border-transparent">
            <div className="rounded-full bg-orange-50 dark:bg-orange-900/20 p-2 text-primary">
              <span className="material-symbols-outlined text-2xl">male</span>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">性别</p>
              <p className="text-lg font-bold text-[#1b140d] dark:text-white">{pet.gender === 'Male' ? '公' : '母'}</p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-white dark:bg-[#342a20] p-4 shadow-sm border border-gray-100 dark:border-transparent">
            <div className="rounded-full bg-orange-50 dark:bg-orange-900/20 p-2 text-primary">
              <span className="material-symbols-outlined text-2xl">monitor_weight</span>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">体重</p>
              <p className="text-lg font-bold text-[#1b140d] dark:text-white">{pet.weight}</p>
            </div>
          </div>
        </div>

        {/* Shelter Info */}
        <div className="flex items-center justify-between rounded-2xl bg-white dark:bg-[#342a20] p-4 shadow-sm border border-gray-100 dark:border-transparent">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 overflow-hidden rounded-full border-2 border-primary/20 bg-gray-100 p-1">
              <img className="h-full w-full object-contain" src={pet.shelterLogo} alt={pet.shelterName} />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1b140d] dark:text-white">{pet.shelterName}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{pet.shelterDistance}</p>
            </div>
          </div>
          <button
            onClick={handleChat}
            className="flex size-10 items-center justify-center rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 transition-colors"
          >
            <span className="material-symbols-outlined">call</span>
          </button>
        </div>

        {/* About Me */}
        <div className="flex flex-col gap-3">
          <h2 className="text-xl font-bold text-[#1b140d] dark:text-white">关于我</h2>
          <p className="text-base leading-relaxed text-gray-600 dark:text-gray-300">
            {pet.description}
            <span className="font-bold text-primary cursor-pointer ml-1">查看更多</span>
          </p>
        </div>

        {/* Location Map Placeholder */}
        <div className="flex flex-col gap-3 pb-8">
          <h2 className="text-xl font-bold text-[#1b140d] dark:text-white">位置</h2>
          <div className="h-40 w-full overflow-hidden rounded-2xl bg-gray-200 dark:bg-gray-800 relative">
            <img
              className="h-full w-full object-cover opacity-80"
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=600&auto=format&fit=crop"
              alt="Map"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex items-center gap-1 rounded-lg bg-white/90 px-3 py-1.5 shadow-md">
                <span className="material-symbols-outlined text-primary text-sm">location_on</span>
                <span className="text-xs font-bold text-gray-800">{pet.shelterName.split(' ')[0]}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 flex items-center justify-between gap-4 border-t border-gray-100 dark:border-gray-800 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md p-4 px-6 pb-6">
        <button
          onClick={handleChat}
          className="flex flex-col items-center justify-center gap-1 text-gray-500 dark:text-gray-400 hover:text-primary transition-colors min-w-[60px]"
        >
          <span className="material-symbols-outlined text-2xl">chat_bubble_outline</span>
          <span className="text-xs font-medium">咨询</span>
        </button>

        <button
          onClick={() => navigate('/apply/step1', { state: { petId: id, petName: pet.name } })}
          className="flex-1 h-12 rounded-xl bg-primary hover:bg-orange-600 active:scale-[0.98] transition-all text-white text-base font-bold shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2"
        >
          申请领养
        </button>
      </div>
    </div>
  );
};

export default PetDetailScreen;