import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ApplicationStep1: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { petId, petName } = (location.state as { petId?: string; petName?: string }) || {};

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    job: '',
    housingType: '公寓',
    hasPets: true
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleHousingSelect = (type: string) => {
    setFormData(prev => ({ ...prev, housingType: type }));
  };

  const handlePetsChange = (hasPets: boolean) => {
    setFormData(prev => ({ ...prev, hasPets }));
  };

  const handleNext = () => {
    // Simple validation
    if (!formData.name || !formData.phone || !formData.address || !formData.job) {
      alert('请填写所有必填信息');
      return;
    }
    navigate('/apply/step2', { state: { ...formData, petId, petName } });
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-text-main dark:text-text-main-dark min-h-screen relative overflow-x-hidden selection:bg-primary/30">

      {/* Background decoration */}
      <div className="fixed -bottom-10 -right-10 pointer-events-none opacity-[0.03] dark:opacity-[0.05] z-0 text-text-main dark:text-text-main-dark">
        <span className="material-symbols-outlined text-[400px]">pets</span>
      </div>

      <div className="relative z-10 flex flex-col h-full w-full pb-24">
        {/* Header */}
        <div className="sticky top-0 z-50 flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between backdrop-blur-md bg-opacity-95 dark:bg-opacity-95 transition-colors">
          <button
            onClick={() => navigate(-1)}
            className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-text-main dark:text-text-main-dark"
          >
            <span className="material-symbols-outlined">arrow_back_ios_new</span>
          </button>
          <h2 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10">领养申请</h2>
        </div>

        {/* Progress */}
        <div className="flex flex-col gap-3 px-6 py-2">
          <div className="flex gap-6 justify-between items-end">
            <p className="text-text-main dark:text-text-main-dark text-base font-bold leading-normal">个人信息</p>
            <p className="text-text-secondary dark:text-text-secondary-dark text-xs font-medium leading-normal">第 1 步 / 共 2 步</p>
          </div>
          <div className="h-2 w-full rounded-full bg-border-light dark:bg-border-dark overflow-hidden">
            <div className="h-full rounded-full bg-primary transition-all duration-500 ease-out" style={{ width: '50%' }}></div>
          </div>
        </div>

        {/* Form Content */}
        <div className="flex flex-col gap-6 px-6 pt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-text-main dark:text-text-main-dark leading-tight">
              请介绍一下 <br /><span className="text-primary">您自己</span>
            </h1>
            <p className="mt-2 text-text-secondary dark:text-text-secondary-dark text-sm">
              {petName ? `申请领养: ${petName}` : '我们需要一些详细信息来寻找最佳匹配。'}
            </p>
          </div>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-text-main dark:text-text-main-dark ml-1">真实姓名</span>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full h-14 rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-4 text-base text-text-main dark:text-text-main-dark placeholder:text-text-secondary dark:placeholder:text-text-secondary-dark focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all shadow-sm font-display"
              placeholder="张三"
              type="text"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-text-main dark:text-text-main-dark ml-1">联系电话</span>
            <div className="relative">
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full h-14 rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-4 pl-12 text-base text-text-main dark:text-text-main-dark placeholder:text-text-secondary dark:placeholder:text-text-secondary-dark focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all shadow-sm font-display"
                placeholder="138 0000 0000"
                type="tel"
              />
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary dark:text-text-secondary-dark pointer-events-none" style={{ fontSize: '20px' }}>call</span>
            </div>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-text-main dark:text-text-main-dark ml-1">居住地址</span>
            <div className="relative">
              <input
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full h-14 rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-4 pl-12 text-base text-text-main dark:text-text-main-dark placeholder:text-text-secondary dark:placeholder:text-text-secondary-dark focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all shadow-sm font-display"
                placeholder="xx市xx区xx路"
                type="text"
              />
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary dark:text-text-secondary-dark pointer-events-none" style={{ fontSize: '20px' }}>home_pin</span>
            </div>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-text-main dark:text-text-main-dark ml-1">职业</span>
            <input
              name="job"
              value={formData.job}
              onChange={handleChange}
              className="w-full h-14 rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-4 text-base text-text-main dark:text-text-main-dark placeholder:text-text-secondary dark:placeholder:text-text-secondary-dark focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all shadow-sm font-display"
              placeholder="例如：软件设计师"
              type="text"
            />
          </label>

          <div className="flex flex-col gap-3">
            <span className="text-sm font-semibold text-text-main dark:text-text-main-dark ml-1">住房类型</span>
            <div className="flex flex-wrap gap-3">
              {['公寓', '独栋', '其他'].map((type) => (
                <button
                  key={type}
                  onClick={() => handleHousingSelect(type)}
                  className={`h-10 px-5 rounded-full text-sm font-medium border shadow-sm transition-all flex items-center justify-center font-display ${formData.housingType === type
                      ? 'bg-primary text-white border-primary'
                      : 'bg-surface-light dark:bg-surface-dark text-text-secondary dark:text-text-secondary-dark border-border-light dark:border-border-dark hover:border-primary/50 hover:text-primary'
                    }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-text-main dark:text-text-main-dark ml-1">您目前是否有养宠物？</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div
                onClick={() => handlePetsChange(true)}
                className={`cursor-pointer relative h-12 w-full rounded-xl border flex items-center justify-center font-medium transition-all font-display ${formData.hasPets
                    ? 'bg-primary/10 border-primary text-primary'
                    : 'bg-surface-light dark:bg-surface-dark border-border-light dark:border-border-dark text-text-secondary dark:text-text-secondary-dark'
                  }`}
              >
                是
                <span className={`material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-primary transition-opacity ${formData.hasPets ? 'opacity-100' : 'opacity-0'}`} style={{ fontSize: '18px' }}>check_circle</span>
              </div>

              <div
                onClick={() => handlePetsChange(false)}
                className={`cursor-pointer relative h-12 w-full rounded-xl border flex items-center justify-center font-medium transition-all font-display ${!formData.hasPets
                    ? 'bg-primary/10 border-primary text-primary'
                    : 'bg-surface-light dark:bg-surface-dark border-border-light dark:border-border-dark text-text-secondary dark:text-text-secondary-dark'
                  }`}
              >
                否
                <span className={`material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-primary transition-opacity ${!formData.hasPets ? 'opacity-100' : 'opacity-0'}`} style={{ fontSize: '18px' }}>check_circle</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Button */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md z-40 border-t border-transparent w-full max-w-[448px] mx-auto">
          <button
            onClick={handleNext}
            className="w-full h-14 rounded-xl bg-primary hover:bg-orange-600 active:scale-[0.98] transition-all text-white text-base font-bold shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 font-display"
          >
            下一步
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationStep1;