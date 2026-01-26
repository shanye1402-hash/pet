import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { submitApplication } from '../services/applicationService';

const ApplicationStep2: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const step1Data = location.state || {};

  const [reason, setReason] = useState('');
  const [experience, setExperience] = useState('首次养宠');
  const [hours, setHours] = useState(6);
  const [activityLevel, setActivityLevel] = useState('适中');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!reason.trim()) {
      alert('请填写领养原因');
      return;
    }

    const fullApplicationData = {
      ...step1Data,
      reason,
      experience,
      timeCommitment: hours,
      activityLevel
    };

    // Get petId from state - passed from PetDetailScreen
    const petId = step1Data.petId;

    if (!petId) {
      alert('缺少宠物信息，请重新选择');
      navigate('/');
      return;
    }

    setLoading(true);
    try {
      await submitApplication(petId, fullApplicationData);
      navigate('/success');
    } catch (error: any) {
      console.error('Error submitting application:', error);
      alert(error.message || '提交失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-text-main dark:text-text-main-dark min-h-screen relative overflow-x-hidden selection:bg-primary/30">
      <div className="relative z-10 flex flex-col h-full w-full max-w-md mx-auto pb-32">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md p-4 pb-2 justify-between border-b border-transparent dark:border-white/5">
          <button
            onClick={() => navigate(-1)}
            className="flex size-12 shrink-0 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-text-main dark:text-white"
          >
            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
          </button>
          <h2 className="text-text-main dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">领养申请</h2>
        </div>

        {/* Progress Dots */}
        <div className="flex w-full flex-col items-center justify-center gap-2 py-4">
          <div className="flex flex-row items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-primary/30"></div>
            <div className="h-2 w-8 rounded-full bg-primary"></div>
          </div>
          <p className="text-xs font-medium text-text-secondary dark:text-white/60">第 2 步 / 共 2 步</p>
        </div>

        <div className="flex-1 flex flex-col px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="pb-2">
            <h1 className="text-text-main dark:text-white tracking-tight text-[32px] font-bold leading-tight text-left">生活方式与经验</h1>
            <p className="text-text-secondary dark:text-white/70 text-base font-normal leading-normal pt-2">请帮助我们了解您能为新朋友提供的生活环境。</p>
          </div>

          <div className="h-6 w-full"></div>

          <div className="flex flex-col gap-2">
            <label className="text-text-main dark:text-white text-base font-bold leading-normal" htmlFor="reason">为什么想领养？</label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full min-h-[140px] resize-none rounded-xl border border-border-color dark:border-white/10 bg-surface-light dark:bg-surface-dark p-4 text-base text-text-main dark:text-white placeholder:text-text-secondary/60 dark:placeholder:text-white/30 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all shadow-sm"
              placeholder="请告诉我们为什么您觉得这只宠物适合您的生活方式..."
            ></textarea>
          </div>

          <div className="h-8 w-full"></div>

          <div className="flex flex-col gap-3">
            <label className="text-text-main dark:text-white text-base font-bold leading-normal">饲养经验</label>
            <div className="flex flex-wrap gap-2">
              {['首次养宠', '有过经验', '经验丰富'].map((level) => (
                <button
                  key={level}
                  onClick={() => setExperience(level)}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold shadow-sm transition-all active:scale-95 ${experience === level
                      ? 'bg-primary text-white scale-105'
                      : 'bg-surface-light dark:bg-surface-dark border border-border-color dark:border-white/10 text-text-main dark:text-white hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div className="h-8 w-full"></div>

          {/* Slider */}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-baseline">
              <label className="text-text-main dark:text-white text-base font-bold leading-normal">每日陪伴时长</label>
              <span className="text-primary font-bold text-lg">{hours === 10 ? '8h+' : `${Math.max(0, hours - 2)}-${hours} 小时`}</span>
            </div>
            <div className="relative w-full h-12 flex items-center">
              <div className="absolute w-full h-2 bg-border-color dark:bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-150"
                  style={{ width: `${(hours / 10) * 100}%` }}
                ></div>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="1"
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
                className="absolute w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div
                className="absolute h-6 w-6 rounded-full bg-white border-4 border-primary shadow-md pointer-events-none transition-all duration-150"
                style={{ left: `calc(${hours * 10}% - 12px)` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-text-secondary dark:text-white/50 px-1">
              <span>0h</span>
              <span>2h</span>
              <span>4h</span>
              <span>6h</span>
              <span>8h+</span>
            </div>
          </div>

          <div className="h-8 w-full"></div>

          <div className="flex flex-col gap-3">
            <label className="text-text-main dark:text-white text-base font-bold leading-normal">家庭活跃度</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: '安静', icon: 'night_shelter' },
                { id: '适中', icon: 'directions_walk' },
                { id: '活跃', icon: 'hiking' },
                { id: '繁忙', icon: 'bolt' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActivityLevel(item.id)}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${activityLevel === item.id
                      ? 'bg-primary/10 border-primary text-primary shadow-sm'
                      : 'bg-surface-light dark:bg-surface-dark border-border-color dark:border-white/10 text-text-main dark:text-white hover:border-primary/50'
                    }`}
                >
                  <span className={`material-symbols-outlined ${activityLevel === item.id ? 'fill-1' : ''}`}>{item.icon}</span>
                  <span>{item.id}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-background-dark/95 backdrop-blur-lg border-t border-border-color dark:border-white/5 p-4 pb-8 flex items-center gap-3 shadow-[0_-8px_30px_rgba(0,0,0,0.04)] z-50 w-full max-w-[448px] mx-auto">
          <button
            onClick={() => navigate(-1)}
            disabled={loading}
            className="flex-1 h-14 rounded-full border border-border-color dark:border-white/20 bg-transparent text-text-main dark:text-white font-bold text-base hover:bg-black/5 dark:hover:bg-white/5 transition-colors disabled:opacity-50"
          >
            返回
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-[2] h-14 rounded-full bg-primary text-white font-bold text-base shadow-lg shadow-primary/30 hover:bg-primary/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span className="material-symbols-outlined animate-spin">progress_activity</span>
            ) : (
              <>
                提交申请
                <span className="material-symbols-outlined text-[20px]">check_circle</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationStep2;