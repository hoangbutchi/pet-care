import { format } from 'date-fns';
import { MessageCircle } from 'lucide-react';
import useChatStore from '../../../store/chatStore';

const ChatList = ({ conversations, onSelectConversation, currentConversationId }) => {
  const { onlineUsers } = useChatStore();

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400">
        <MessageCircle size={48} className="mb-4" />
        <p>Chưa có cuộc hội thoại nào</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      {conversations.map((conversation) => {
        const isOnline = onlineUsers.includes(conversation.otherUser?.id);
        const isActive = currentConversationId === conversation.id;

        return (
          <div
            key={conversation.id}
            onClick={() => onSelectConversation(conversation)}
            className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${
              isActive ? 'bg-primary/10 border-l-4 border-l-primary' : ''
            }`}
          >
            <div className="flex items-start gap-3">
              {/* Avatar */}
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0">
                  {conversation.otherUser?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                {isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {conversation.otherUser?.name || 'Unknown'}
                  </h3>
                  {conversation.lastMessage && (
                    <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                      {format(new Date(conversation.lastMessage.createdAt), 'HH:mm')}
                    </span>
                  )}
                </div>

                {conversation.lastMessage && (
                  <p className="text-sm text-gray-600 truncate">
                    {conversation.lastMessage.senderId === conversation.otherUser?.id
                      ? ''
                      : 'Bạn: '}
                    {conversation.lastMessage.content}
                  </p>
                )}

                {conversation.unreadCount > 0 && (
                  <div className="mt-1">
                    <span className="inline-block bg-primary text-white text-xs px-2 py-1 rounded-full">
                      {conversation.unreadCount}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChatList;
