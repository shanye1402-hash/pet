import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getMyApplications } from '../services/applicationService';
import { DbApplication } from '../lib/supabaseClient';

const ApplicationHistoryScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [applications, setApplications] = useState<DbApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadApplications = async () => {
      try {
        const apps = await getMyApplications();
        setApplications(apps);
      } catch (error) {
        console.error('Error loading applications:', error);
      } finally {
        setLoading(false);
      }
    };

    loadApplications();
  }, []);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-blue-600 bg-blue-50 dark:text-blue-300 dark:bg-blue-900/20';
      case 'approved':
        return 'text-green-600 bg-green-50 dark:text-green-300 dark:bg-green-900/20';
      case 'rejected':
        return 'text-red-600 bg-red-50 dark:text-red-300 dark:bg-red-900/20';
      case 'cancelled':
        return 'text-gray-500 bg-gray-100 dark:text-gray-400 dark:bg-gray-800';
      default:
        return 'text-gray-500 bg-gray-100';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return '审核中';
      case 'approved': return '已通过';
      case 'rejected': return '已拒绝';
      case 'cancelled': return '已取消';
      default: return status;
    }
  };

  const handlePetClick = (petId: string) => {
    navigate(`/pet/${petId}`, {
      state: { from: location.pathname }
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-display">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center bg-white/90 dark:bg-[#221910]/90 backdrop-blur-md p-4 pb-2 justify-between border-b border-gray-100 dark:border-white/5 shadow-sm">
        <button
          onClick={() => navigate('/')}
          className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        >
          <span className="material-symbols-outlined text-[#181411] dark:text-white">arrow_back</span>
        </button>
        <h2 className="text-lg font-bold text-[#181411] dark:text-white">申请记录</h2>
        <div className="w-10"></div>
      </div>

      <div className="p-4 flex flex-col gap-4">
        {loading && (
          <div className="flex flex-col items-center justify-center pt-20">
            <span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
            <p className="text-[#897561] mt-2">加载中...</p>
          </div>
        )}

        {!loading && applications.map((app) => (
          <div
            key={app.id}
            onClick={() => handlePetClick(app.pet_id)}
            className="bg-white dark:bg-[#32281e] p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-transparent active:scale-[0.99] transition-transform cursor-pointer group"
          >
            <div className="flex gap-4">
              <div className="size-20 rounded-xl bg-gray-100 overflow-hidden shrink-0 relative">
                <img
                  src={app.pet?.image || ''}
                  alt={app.pet?.name || ''}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-[#181411] dark:text-white text-lg truncate">
                      {app.pet?.name || '未知宠物'}
                    </h3>
                    <span className={`text-xs font-bold px-2 py-1 rounded-lg ${getStatusStyle(app.status)}`}>
                      {getStatusLabel(app.status)}
                    </span>
                  </div>
                  <p className="text-sm text-[#897561] truncate">
                    {app.pet?.shelter?.name || ''}
                  </p>
                </div>
                <div className="flex justify-between items-end">
                  <p className="text-xs text-gray-400">申请时间: {formatDate(app.created_at)}</p>
                  <span className="material-symbols-outlined text-gray-300 text-lg">chevron_right</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {!loading && applications.length === 0 && (
          <div className="flex flex-col items-center justify-center pt-20 text-gray-400">
            <span className="material-symbols-outlined text-6xl mb-2">history_edu</span>
            <p>暂无申请记录</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationHistoryScreen;