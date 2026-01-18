import { useEffect, useRef } from 'react';
import { ArrowLeft, User } from 'lucide-react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import useChatStore from '../../../store/chatStore';
import { getMessages } from '../../../services/chatService';

const ChatWindow = ({ conversation, onBack }) => {
  const messagesEndRef = useRef(null);
  const { messages, setMessages, setCurrentConversation, typingUsers, onlineUsers } =
    useChatStore();

  const conversationMessages = messages[conversation?.id] || [];
  const isTyping = Object.values(typingUsers).some((typing) => typing);
  const isOnline = conversation?.otherUser?.id
    ? onlineUsers.includes(conversation.otherUser.id)
    : false;

  // Load messages when conversation changes
  useEffect(() => {
    if (conversation?.id) {
      setCurrentConversation(conversation);
      loadMessages();
    }
  }, [conversation?.id]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [conversationMessages]);

  const loadMessages = async () => {
    try {
      const response = await getMessages(conversation.id);
      setMessages(conversation.id, response.data);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (!conversation) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        <p>Chọn một cuộc hội thoại để bắt đầu</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center">
              {conversation.otherUser?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            {isOnline && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            )}
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">
              {conversation.otherUser?.name || 'Unknown'}
            </h2>
            <p className="text-xs text-gray-500">
              {isOnline ? 'Đang hoạt động' : 'Không hoạt động'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {conversationMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <p>Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!</p>
          </div>
        ) : (
          <>
            {conversationMessages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isTyping && (
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <span>Đang nhập...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <ChatInput conversationId={conversation.id} />
    </div>
  );
};

export default ChatWindow;
