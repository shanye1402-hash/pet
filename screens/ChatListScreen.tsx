import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { getConversations } from '../services/chatService';

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadConversations = async () => {
      try {
        const convs = await getConversations();
        setConversations(convs);
      } catch (error) {
        console.error('Error loading conversations:', error);
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
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

  return (
    <div className="flex h-full w-full flex-col bg-background-light dark:bg-background-dark min-h-screen">
      {/* Header */}
      <header className="px-6 pt-8 pb-4 bg-background-light dark:bg-background-dark sticky top-0 z-10">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-[#181411] dark:text-white">消息</h1>
          <button className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10">
            <span className="material-symbols-outlined text-[#181411] dark:text-white">edit_square</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#897561]">search</span>
          <input
            type="text"
            placeholder="搜索联系人..."
            className="w-full h-12 rounded-xl bg-white dark:bg-[#32281e] pl-12 pr-4 text-base border-none focus:ring-1 focus:ring-primary shadow-sm placeholder:text-[#897561]"
          />
        </div>
      </header>

      {/* Chat List */}
      <main className="flex-1 overflow-y-auto px-4 pb-4">
        {loading && (
          <div className="flex flex-col items-center justify-center pt-20">
            <span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
            <p className="text-[#897561] mt-2">加载中...</p>
          </div>
        )}

        {!loading && conversations.length === 0 && (
          <div className="flex flex-col items-center justify-center pt-20 text-gray-400">
            <span className="material-symbols-outlined text-6xl mb-2">chat_bubble_outline</span>
            <p>暂无消息</p>
            <p className="text-sm mt-1">去宠物详情页咨询救助中心吧</p>
          </div>
        )}

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
      </main>

      <BottomNav />
    </div>
  );
};

export default ChatListScreen;