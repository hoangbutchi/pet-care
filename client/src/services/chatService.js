import axios from '../utils/axios';

/**
 * Lấy danh sách cuộc hội thoại
 */
export const getConversations = async () => {
  const response = await axios.get('/chat/conversations');
  return response.data;
};

/**
 * Lấy hoặc tạo cuộc hội thoại
 */
export const getOrCreateConversation = async (otherUserId) => {
  const response = await axios.post('/chat/conversations', { otherUserId });
  return response.data;
};

/**
 * Lấy tin nhắn của cuộc hội thoại
 */
export const getMessages = async (conversationId, page = 1, limit = 50) => {
  const response = await axios.get(`/chat/conversations/${conversationId}/messages`, {
    params: { page, limit },
  });
  return response.data;
};

/**
 * Upload file đính kèm
 */
export const uploadAttachment = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post('/chat/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
