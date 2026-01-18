const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');
const uploadChat = require('../middleware/uploadChat');

// Tất cả routes đều cần authentication
router.use(protect);

// Lấy danh sách cuộc hội thoại
router.get('/conversations', chatController.getConversations);

// Lấy hoặc tạo cuộc hội thoại
router.post('/conversations', chatController.getOrCreateConversation);

// Lấy tin nhắn của cuộc hội thoại
router.get('/conversations/:conversationId/messages', chatController.getMessages);

// Upload file đính kèm
router.post('/upload', uploadChat.single('file'), chatController.uploadAttachment);

module.exports = router;
