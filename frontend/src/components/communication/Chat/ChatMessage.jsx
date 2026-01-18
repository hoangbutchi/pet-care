import { format } from 'date-fns';
import { useAuth } from '../../../context/AuthContext';

const ChatMessage = ({ message }) => {
  const { user } = useAuth();
  const isOwn = message.senderId === user?.id;

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex max-w-[70%] ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        {!isOwn && (
          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center mr-2 flex-shrink-0">
            {message.sender?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
        )}

        {/* Message content */}
        <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
          {!isOwn && (
            <span className="text-xs text-gray-500 mb-1">{message.sender?.name}</span>
          )}
          <div
            className={`rounded-lg px-4 py-2 ${
              isOwn
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-900'
            }`}
          >
            <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>

            {/* Attachments */}
            {message.attachments && message.attachments.length > 0 && (
              <div className="mt-2 space-y-2">
                {message.attachments.map((attachment, idx) => (
                  <a
                    key={idx}
                    href={attachment}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-xs underline"
                  >
                    📎 File đính kèm
                  </a>
                ))}
              </div>
            )}

            {/* Timestamp */}
            <span
              className={`text-xs mt-1 block ${
                isOwn ? 'text-white/70' : 'text-gray-500'
              }`}
            >
              {format(new Date(message.createdAt), 'HH:mm')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
