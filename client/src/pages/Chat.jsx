import { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import ChatList from '../components/communication/Chat/ChatList';
import ChatWindow from '../components/communication/Chat/ChatWindow';
import useChatStore from '../store/chatStore';
import { getConversations, getOrCreateConversation } from '../services/chatService';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Chat = () => {
  const { user } = useAuth();
  const {
    conversations,
    setConversations,
    currentConversation,
    setCurrentConversation,
    connectSocket,
    disconnectSocket,
    setLoading,
  } = useChatStore();
  const [loading, setLoadingState] = useState(true);

  useEffect(() => {
    // Connect socket
    const token = user?.token || localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))?.token
      : null;
    if (token) {
      connectSocket(token);
    }

    // Load conversations
    loadConversations();

    return () => {
      disconnectSocket();
    };
  }, []);

  const loadConversations = async () => {
    try {
      setLoadingState(true);
      const response = await getConversations();
      setConversations(response.data);
    } catch (error) {
      toast.error('Lỗi khi tải danh sách cuộc hội thoại');
      console.error(error);
    } finally {
      setLoadingState(false);
    }
  };

  const handleSelectConversation = (conversation) => {
    setCurrentConversation(conversation);
  };

  const handleBack = () => {
    setCurrentConversation(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-[calc(100vh-200px)] flex">
        {/* Chat List - Desktop */}
        <div className="hidden lg:block w-80 border-r border-gray-200 flex-shrink-0">
          <div className="p-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <MessageCircle size={28} />
              Tin nhắn
            </h1>
          </div>
          <ChatList
            conversations={conversations}
            onSelectConversation={handleSelectConversation}
            currentConversationId={currentConversation?.id}
          />
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col">
          {currentConversation ? (
            <ChatWindow conversation={currentConversation} onBack={handleBack} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <MessageCircle size={64} className="mx-auto mb-4 opacity-50" />
                <p className="text-lg">Chọn một cuộc hội thoại để bắt đầu</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
