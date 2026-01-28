import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { getConversations } from '../services/chatService';
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead, Notification } from '../services/notificationService';

interface Conversation {
  id: string;
  shelter: {
    id: string;
    name: string;
    logo: string;
  };
  lastMessage: string;
  lastMessageTime: string;
}

const ChatListScreen: React.FC = () => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'notifications' | 'chats'>('notifications');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [convs, notifs] = await Promise.all([
          getConversations(),
          getNotifications()
        ]);
        setConversations(convs);
        setNotifications(notifs);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleChatClick = (conv: Conversation) => {
    navigate(`/chat/${conv.id}`, {
      state: {
        name: conv.shelter.name,
        logo: conv.shelter.logo,
        conversationId: conv.id
      }
    });
  };

  const handleNotificationClick = async (notif: Notification) => {
    // 标记为已读
    if (!notif.is_read) {
      await markNotificationAsRead(notif.id);
      setNotifications(prev => prev.map(n =>
        n.id === notif.id ? { ...n, is_read: true } : n
      ));
    }

    // 如果有关联的宠物，跳转到宠物详情
    if (notif.pet_id) {
      navigate(`/pet/${notif.pet_id}`);
    }
  };

  const handleMarkAllAsRead = async () => {
    await markAllNotificationsAsRead();
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return '昨天';
    } else if (days < 7) {
      return ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][date.getDay()];
    } else {
      return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'application_submitted':
        return { icon: 'pending', color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' };
      case 'application_approved':
        return { icon: 'check_circle', color: 'text-green-500 bg-green-50 dark:bg-green-900/20' };
      case 'application_rejected':
        return { icon: 'cancel', color: 'text-red-500 bg-red-50 dark:bg-red-900/20' };
      default:
        return { icon: 'notifications', color: 'text-primary bg-orange-50 dark:bg-orange-900/20' };
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="flex h-full w-full flex-col bg-background-light dark:bg-background-dark min-h-screen">
      {/* Header */}
      <header className="px-6 pt-8 pb-4 bg-background-light dark:bg-background-dark sticky top-0 z-10">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-[#181411] dark:text-white">消息</h1>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="text-sm text-primary font-medium"
            >
              全部已读
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 bg-white dark:bg-[#32281e] p-1 rounded-xl shadow-sm">
          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${activeTab === 'notifications'
                ? 'bg-primary text-white shadow-md'
                : 'text-[#897561] hover:bg-black/5 dark:hover:bg-white/5'
              }`}
          >
            通知
            {unreadCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 bg-red-500 text-white text-[10px] rounded-full">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('chats')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${activeTab === 'chats'
                ? 'bg-primary text-white shadow-md'
                : 'text-[#897561] hover:bg-black/5 dark:hover:bg-white/5'
              }`}
          >
            对话
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto px-4 pb-4">
        {loading && (
          <div className="flex flex-col items-center justify-center pt-20">
            <span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
            <p className="text-[#897561] mt-2">加载中...</p>
          </div>
        )}

        {/* Notifications Tab */}
        {!loading && activeTab === 'notifications' && (
          <>
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center pt-20 text-gray-400">
                <span className="material-symbols-outlined text-6xl mb-2">notifications_none</span>
                <p>暂无通知</p>
                <p className="text-sm mt-1">申请宠物领养后会收到通知</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {notifications.map((notif) => {
                  const { icon, color } = getNotificationIcon(notif.type);
                  return (
                    <div
                      key={notif.id}
                      onClick={() => handleNotificationClick(notif)}
                      className={`flex items-start gap-4 p-4 rounded-2xl bg-white dark:bg-[#32281e] shadow-sm active:scale-[0.98] transition-all cursor-pointer ${!notif.is_read ? 'border-l-4 border-primary' : ''
                        }`}
                    >
                      {/* Pet Image or Icon */}
                      {notif.pet_image ? (
                        <div className="size-14 rounded-xl overflow-hidden shrink-0">
                          <img src={notif.pet_image} alt="" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className={`size-12 rounded-full ${color} flex items-center justify-center shrink-0`}>
                          <span className="material-symbols-outlined">{icon}</span>
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className={`font-bold text-[#181411] dark:text-white ${!notif.is_read ? '' : 'opacity-70'}`}>
                            {notif.title}
                          </h3>
                          <span className="text-xs text-[#897561] font-medium shrink-0 ml-2">
                            {formatTime(notif.created_at)}
                          </span>
                        </div>
                        <p className={`text-sm text-[#897561] ${!notif.is_read ? '' : 'opacity-70'}`}>
                          {notif.message}
                        </p>
                      </div>

                      {!notif.is_read && (
                        <div className="size-2 rounded-full bg-primary shrink-0 mt-2" />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Chats Tab */}
        {!loading && activeTab === 'chats' && (
          <>
            {conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center pt-20 text-gray-400">
                <span className="material-symbols-outlined text-6xl mb-2">chat_bubble_outline</span>
                <p>暂无对话</p>
                <p className="text-sm mt-1">去宠物详情页咨询救助中心吧</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {conversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => handleChatClick(conv)}
                    className="flex items-center gap-4 p-3 rounded-2xl bg-white dark:bg-[#32281e] shadow-sm active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <div className="relative shrink-0">
                      <div className="size-14 rounded-full bg-gray-100 dark:bg-gray-800 p-1 border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <img src={conv.shelter.logo} alt={conv.shelter.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="absolute bottom-0 right-0 size-3.5 bg-green-500 border-2 border-white dark:border-[#32281e] rounded-full"></div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="font-bold text-[#181411] dark:text-white truncate">{conv.shelter.name}</h3>
                        <span className="text-xs text-[#897561] font-medium">{formatTime(conv.lastMessageTime)}</span>
                      </div>
                      <p className="text-sm text-[#897561] truncate">{conv.lastMessage || '开始对话...'}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default ChatListScreen;