import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { getPets, getCategories, transformPet } from '../services/petService';
import { getFavoriteIds } from '../services/favoriteService';
import { Pet } from '../types';

const HomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const isFavoritesView = searchParams.get('view') === 'favorites';

  const [selectedCategory, setSelectedCategory] = useState('dogs');
  const [searchQuery, setSearchQuery] = useState('');
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = getCategories();

  // Load pets from database
  useEffect(() => {
    let mounted = true;

    const loadPets = async () => {
      setLoading(true);
      try {
        const dbPets = await getPets(
          isFavoritesView ? undefined : selectedCategory,
          searchQuery || undefined
        );
        if (!mounted) return;
        const transformedPets = dbPets.map(transformPet);
        setPets(transformedPets);
      } catch (error: any) {
        if (error?.name === 'AbortError' || error?.message?.includes('aborted')) {
          return;
        }
        console.error('Error loading pets:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadPets();

    return () => {
      mounted = false;
    };
  }, [selectedCategory, searchQuery, isFavoritesView]);

  // Load favorites
  useEffect(() => {
    let mounted = true;

    const loadFavorites = async () => {
      try {
        const favIds = await getFavoriteIds();
        if (!mounted) return;
        setFavoriteIds(favIds);
      } catch (error: any) {
        if (error?.name === 'AbortError' || error?.message?.includes('aborted')) {
          return;
        }
        console.error('Error loading favorites:', error);
      }
    };

    loadFavorites();

    return () => {
      mounted = false;
    };
  }, [isFavoritesView]);

  const handlePetClick = (id: string) => {
    navigate(`/pet/${id}`, {
      state: { from: location.pathname + location.search }
    });
  };

  // Filter for favorites view
  const filteredPets = useMemo(() => {
    if (isFavoritesView) {
      return pets.filter(pet => favoriteIds.includes(pet.id));
    }
    return pets;
  }, [pets, isFavoritesView, favoriteIds]);

  const showFeaturedSection = !isFavoritesView && !searchQuery;
  const featuredPets = showFeaturedSection ? filteredPets.slice(0, 3) : [];
  const listPets = showFeaturedSection ? filteredPets.slice(3).concat(filteredPets.slice(0, 2)) : filteredPets;

  return (
    <div className="relative flex h-full w-full flex-col bg-background-light dark:bg-background-dark overflow-hidden min-h-screen">
      <header className="flex items-center justify-between px-6 pt-8 pb-2 shrink-0">
        <div className="flex flex-col items-start gap-1">
          <h2 className="text-[#181411] dark:text-white text-xl font-bold leading-tight">
            {isFavoritesView ? '我的收藏 ❤️' : '你好，铲屎官！👋'}
          </h2>
          <button className="flex items-center gap-0.5 text-[#897561] dark:text-[#bcaaa4] active:opacity-70 transition-opacity">
            <span className="material-symbols-outlined text-[18px]">location_on</span>
            <span className="text-sm font-medium">北京市朝阳区</span>
            <span className="material-symbols-outlined text-[18px]">expand_more</span>
          </button>
        </div>
        <button
          onClick={() => navigate('/profile')}
          className="flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-white shadow-sm overflow-hidden active:scale-95 transition-transform"
        >
          <img
            src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop"
            alt="User Avatar"
            className="w-full h-full object-cover"
          />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar pb-2">
        {/* Search Bar */}
        <div className="px-6 py-4 sticky top-0 z-10 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm">
          <div className="flex gap-3">
            <label className="flex flex-1 items-center h-12 rounded-xl bg-white dark:bg-[#32281e] shadow-sm px-4 border-none transition-all focus-within:ring-2 focus-within:ring-primary/20">
              <span className="material-symbols-outlined text-[#897561] dark:text-[#9e8c7a]">search</span>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none text-[#181411] dark:text-white placeholder:text-[#897561] dark:placeholder:text-[#6d5e50] focus:ring-0 text-base ml-2 outline-none"
                placeholder="搜索名字或品种..."
              />
            </label>
            <button className="size-12 flex items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/30 active:scale-95 transition-transform">
              <span className="material-symbols-outlined">tune</span>
            </button>
          </div>
        </div>

        {/* Categories (Hidden in Favorites view) */}
        {!isFavoritesView && (
          <div className="flex gap-3 px-6 overflow-x-auto no-scrollbar pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full px-5 shadow-sm border border-transparent transition-all active:scale-95 ${selectedCategory === category.id
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'bg-white dark:bg-[#32281e] text-[#897561] dark:text-[#bcaaa4] hover:border-primary/20'
                  }`}
              >
                <span className="material-symbols-outlined text-[20px]">{category.icon}</span>
                <span className="text-sm font-semibold">{category.name}</span>
              </button>
            ))}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
            <p className="text-sm font-medium text-[#897561] mt-2">加载中...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredPets.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 opacity-50">
            <span className="material-symbols-outlined text-6xl mb-2">pets</span>
            <p className="text-sm font-medium">暂时没有找到相关宠物</p>
          </div>
        )}

        {/* Newest Pets (Horizontal Scroll) - Only show on main dashboard */}
        {!loading && showFeaturedSection && featuredPets.length > 0 && (
          <div className="pt-6 pb-2">
            <div className="flex items-center justify-between px-6 mb-3">
              <h2 className="text-[#181411] dark:text-white text-lg font-bold">最新萌宠</h2>
              <button className="text-primary text-sm font-semibold hover:opacity-80">查看全部</button>
            </div>
            <div className="flex overflow-x-auto gap-4 px-6 no-scrollbar snap-x snap-mandatory pb-4">
              {featuredPets.map((pet) => (
                <div
                  key={pet.id}
                  className="snap-start shrink-0 w-40 flex flex-col gap-3 group cursor-pointer"
                  onClick={() => handlePetClick(pet.id)}
                >
                  <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-md">
                    <div
                      className="w-full h-full bg-center bg-cover transition-transform duration-500 group-hover:scale-110"
                      style={{ backgroundImage: `url("${pet.image}")` }}
                    ></div>
                    <div className="absolute top-2 right-2 bg-white/30 backdrop-blur-md rounded-full p-1.5 flex items-center justify-center">
                      <span className={`material-symbols-outlined text-white text-[18px] ${favoriteIds.includes(pet.id) ? 'fill-1 text-red-500' : ''}`}>favorite</span>
                    </div>
                  </div>
                  <div className="px-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-[#181411] dark:text-white text-base font-bold leading-tight">{pet.name}</p>
                        <p className="text-[#897561] dark:text-[#9e8c7a] text-xs font-medium">{pet.breed}</p>
                      </div>
                      <div className="bg-primary/10 dark:bg-primary/20 px-2 py-0.5 rounded-md">
                        <p className="text-primary text-[10px] font-bold">{pet.age}{pet.ageUnit}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Adoption List (Grid) */}
        {!loading && listPets.length > 0 && (
          <div className="pt-2 pb-6 px-6">
            <h2 className="text-[#181411] dark:text-white text-lg font-bold mb-4">
              {isFavoritesView ? '已收藏的宠物' : '领养宠物'}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {listPets.map((pet) => (
                <div
                  key={pet.id}
                  className="bg-white dark:bg-[#32281e] rounded-2xl p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handlePetClick(pet.id)}
                >
                  <div className="relative aspect-[4/5] rounded-xl overflow-hidden mb-3">
                    <div
                      className="w-full h-full bg-cover bg-center transition-transform hover:scale-105 duration-300"
                      style={{ backgroundImage: `url("${pet.image}")` }}
                    ></div>
                    <button className="absolute top-2 right-2 bg-white/90 dark:bg-black/40 backdrop-blur-sm p-1.5 rounded-full transition-colors group">
                      <span className={`material-symbols-outlined text-[20px] ${favoriteIds.includes(pet.id) ? 'fill-1 text-red-500' : 'text-gray-400 group-hover:text-red-500'}`}>favorite</span>
                    </button>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="font-bold text-[#181411] dark:text-white">{pet.name}</h3>
                      <span className="text-xs font-bold text-primary bg-primary/10 dark:bg-primary/20 px-2 py-0.5 rounded">{pet.age}{pet.ageUnit}</span>
                    </div>
                    <p className="text-xs text-[#897561] dark:text-[#9e8c7a] mb-2">{pet.breed} • {pet.gender === 'Male' ? '公' : '母'}</p>
                    <div className="flex items-center gap-1 text-[#897561] dark:text-[#9e8c7a]">
                      <span className="material-symbols-outlined text-[14px]">location_on</span>
                      <span className="text-xs">距离{pet.distance}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  );
};

export default HomeScreen;