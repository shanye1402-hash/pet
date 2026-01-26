import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { getMessages, sendMessage, subscribeToMessages, getOrCreateConversation } from '../services/chatService';
import { DbMessage } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';

const ChatDetailScreen: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { user } = useAuth();
  const state = location.state as { name?: string; logo?: string; contextText?: string; conversationId?: string } || {};

  const [messages, setMessages] = useState<DbMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(state.conversationId || null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load or create conversation and messages
  useEffect(() => {
    const init = async () => {
      if (!id) return;

      setLoading(true);
      try {
        // If we have a conversationId from state, use it; otherwise try to create one
        let convId = state.conversationId;

        if (!convId && id) {
          // id might be a pet ID, get/create conversation by shelter
          const conv = await getOrCreateConversation(id);
          if (conv) {
            convId = conv.id;
          }
        }

        if (convId) {
          setConversationId(convId);
          const msgs = await getMessages(convId);
          setMessages(msgs);
        }
      } catch (error) {
        console.error('Error loading chat:', error);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [id, state.conversationId]);

  // Subscribe to realtime messages
  useEffect(() => {
    if (!conversationId) return;

    const unsubscribe = subscribeToMessages(conversationId, (newMessage) => {
      setMessages(prev => [...prev, newMessage]);
    });

    return () => {
      unsubscribe();
    };
  }, [conversationId]);

  // Send initial context message if provided
  useEffect(() => {
    if (state.contextText && conversationId && !loading && messages.length === 0) {
      handleSendMessage(state.contextText);
    }
  }, [conversationId, loading]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (text?: string) => {
    const messageText = text || inputText.trim();
    if (!messageText || !conversationId) return;

    setSending(true);
    try {
      const newMessage = await sendMessage(conversationId, messageText);
      if (newMessage && !text) {
        // Only add to state if not from subscription (to avoid duplicates)
        // The subscription will add it
      }
      setInputText('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-screen bg-background-light dark:bg-background-dark">
      {/* Header */}
      <div className="shrink-0 px-4 py-3 bg-white/80 dark:bg-[#221910]/80 backdrop-blur-md sticky top-0 z-10 flex items-center gap-3 border-b border-gray-100 dark:border-white/5 shadow-sm">
        <button
          onClick={() => navigate(-1)}
          className="size-10 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors -ml-2"
        >
          <span className="material-symbols-outlined text-[#181411] dark:text-white">arrow_back</span>
        </button>

        <div className="size-10 rounded-full bg-gray-100 p-1 border border-gray-200 overflow-hidden">
          <img src={state.logo || 'https://cdn-icons-png.flaticon.com/512/3047/3047928.png'} alt="Avatar" className="w-full h-full object-contain" />
        </div>

        <div className="flex-1">
          <h2 className="font-bold text-[#181411] dark:text-white text-base leading-tight">
            {state.name || '救助中心'}
          </h2>
          <div className="flex items-center gap-1">
            <span className="size-2 rounded-full bg-green-500"></span>
            <span className="text-xs text-[#897561]">在线</span>
          </div>
        </div>

        <button className="size-10 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
          <span className="material-symbols-outlined text-[#181411] dark:text-white">more_vert</span>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {loading && (
          <div className="flex items-center justify-center py-8">
            <span className="material-symbols-outlined text-2xl text-primary animate-spin">progress_activity</span>
          </div>
        )}

        {!loading && messages.length === 0 && (
          <div className="text-center text-gray-400 py-8">
            <p>开始对话吧！</p>
          </div>
        )}

        <div className="text-center text-xs text-gray-400 my-2">
          今天 {new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
        </div>

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender_type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.sender_type === 'user'
                  ? 'bg-primary text-white rounded-tr-none'
                  : 'bg-white dark:bg-[#32281e] text-[#181411] dark:text-white rounded-tl-none'
                }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="shrink-0 p-4 bg-white dark:bg-[#221910] border-t border-gray-100 dark:border-white/5">
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-[#32281e] rounded-2xl px-2 py-2">
          <button className="size-10 flex items-center justify-center rounded-full text-[#897561] hover:bg-black/5 transition-colors">
            <span className="material-symbols-outlined">add_circle</span>
          </button>

          <input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            type="text"
            placeholder="发消息..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-[#181411] dark:text-white placeholder:text-[#897561]"
            disabled={sending || !conversationId}
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || sending || !conversationId}
            className={`size-10 flex items-center justify-center rounded-full transition-all ${inputText.trim() && !sending
                ? 'bg-primary text-white shadow-md'
                : 'bg-transparent text-[#897561]'
              }`}
          >
            {sending ? (
              <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
            ) : (
              <span className="material-symbols-outlined">send</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatDetailScreen;