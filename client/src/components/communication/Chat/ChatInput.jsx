import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Smile } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import useChatStore from '../../../store/chatStore';
import { uploadAttachment } from '../../../services/chatService';

const ChatInput = ({ conversationId, onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const fileInputRef = useRef(null);
  const { sendMessage, setTyping } = useChatStore();

  // Typing indicator
  useEffect(() => {
    if (message.trim()) {
      setTyping(conversationId, true);
      const timer = setTimeout(() => {
        setTyping(conversationId, false);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setTyping(conversationId, false);
    }
  }, [message, conversationId, setTyping]);

  const handleSend = async () => {
    if (!message.trim() && attachments.length === 0) return;

    const attachmentUrls = [];
    if (attachments.length > 0) {
      setIsUploading(true);
      try {
        for (const file of attachments) {
          const result = await uploadAttachment(file);
          attachmentUrls.push(result.data.url);
        }
      } catch (error) {
        console.error('Error uploading attachments:', error);
        setIsUploading(false);
        return;
      }
      setIsUploading(false);
    }

    sendMessage(conversationId, message.trim(), attachmentUrls);
    if (onSendMessage) {
      onSendMessage(message.trim(), attachmentUrls);
    }
    setMessage('');
    setAttachments([]);
    setShowEmojiPicker(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setAttachments([...attachments, ...files]);
  };

  const handleEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const removeAttachment = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  return (
    <div className="border-t border-gray-200 p-4 bg-white">
      {/* Attachments preview */}
      {attachments.length > 0 && (
        <div className="flex gap-2 mb-2 flex-wrap">
          {attachments.map((file, idx) => (
            <div
              key={idx}
              className="relative inline-block p-2 bg-gray-100 rounded-lg"
            >
              <span className="text-sm">{file.name}</span>
              <button
                onClick={() => removeAttachment(idx)}
                className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-end gap-2">
        {/* File upload */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2 text-gray-500 hover:text-primary transition-colors"
        >
          <Paperclip size={20} />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Message input */}
        <div className="flex-1 relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Nhập tin nhắn..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            rows={1}
            style={{ minHeight: '40px', maxHeight: '120px' }}
          />

          {/* Emoji picker */}
          {showEmojiPicker && (
            <div className="absolute bottom-full right-0 mb-2">
              <EmojiPicker
                onEmojiClick={handleEmojiClick}
                width={300}
                height={400}
              />
            </div>
          )}
        </div>

        {/* Emoji button */}
        <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="p-2 text-gray-500 hover:text-primary transition-colors"
        >
          <Smile size={20} />
        </button>

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={(!message.trim() && attachments.length === 0) || isUploading}
          className="p-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
