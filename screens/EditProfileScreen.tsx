import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { updateProfile } from '../services/userService';

const EditProfileScreen: React.FC = () => {
  const navigate = useNavigate();
  const { profile, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    phone: '',
    bio: '',
    avatar_url: ''
  });

  // Load profile data
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        location: profile.location || '',
        phone: profile.phone || '',
        bio: profile.bio || '',
        avatar_url: profile.avatar_url || ''
      });
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateProfile(formData);
      await refreshProfile();
      navigate(-1);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      alert(error.message || '保存失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-display">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center bg-white/90 dark:bg-[#221910]/90 backdrop-blur-md p-4 pb-2 justify-between border-b border-gray-100 dark:border-white/5 shadow-sm">
        <button
          onClick={() => navigate(-1)}
          className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        >
          <span className="material-symbols-outlined text-[#181411] dark:text-white">arrow_back</span>
        </button>
        <h2 className="text-lg font-bold text-[#181411] dark:text-white">编辑个人信息</h2>
        <button
          onClick={handleSave}
          disabled={loading}
          className="px-4 py-1.5 bg-primary text-white text-sm font-bold rounded-full shadow-sm active:scale-95 transition-transform disabled:opacity-50"
        >
          {loading ? '保存中...' : '保存'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 pb-10">
        {/* Avatar Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <div className="size-28 rounded-full border-4 border-white dark:border-[#32281e] shadow-lg overflow-hidden bg-gray-100">
              <img src={formData.avatar_url || 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop'} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <button className="absolute bottom-0 right-0 size-8 bg-primary text-white rounded-full flex items-center justify-center shadow-md border-2 border-white dark:border-[#221910]">
              <span className="material-symbols-outlined text-[18px]">camera_alt</span>
            </button>
          </div>
          <p className="mt-3 text-sm text-[#897561] font-medium">点击更换头像</p>
        </div>

        {/* Form Fields */}
        <div className="flex flex-col gap-5">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-bold text-[#181411] dark:text-white ml-1">昵称</span>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full h-12 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#32281e] px-4 text-[#181411] dark:text-white focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
              type="text"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-bold text-[#181411] dark:text-white ml-1">所在地</span>
            <div className="relative">
              <input
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full h-12 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#32281e] px-4 pl-10 text-[#181411] dark:text-white focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                type="text"
              />
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">location_on</span>
            </div>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-bold text-[#181411] dark:text-white ml-1">联系电话</span>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full h-12 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#32281e] px-4 text-[#181411] dark:text-white focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
              type="tel"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-bold text-[#181411] dark:text-white ml-1">个人简介</span>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="w-full min-h-[120px] rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#32281e] p-4 text-[#181411] dark:text-white focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all resize-none leading-relaxed"
            ></textarea>
          </label>
        </div>
      </div>
    </div>
  );
};

export default EditProfileScreen;