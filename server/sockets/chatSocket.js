const prisma = require('../prismaClient');
const jwt = require('jsonwebtoken');

// Lưu trữ online users
const onlineUsers = new Map(); // userId -> socketId

/**
 * Xác thực Socket.io connection
 */
const authenticateSocket = (socket, next) => {
  try {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];

    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    socket.userId = decoded.id;
    socket.user = decoded;
    next();
  } catch (error) {
    next(new Error('Authentication error: Invalid token'));
  }
};

/**
 * Setup Socket.io handlers cho chat
 */
const setupChatSocket = (io) => {
  // Middleware authentication
  io.use(authenticateSocket);

  io.on('connection', (socket) => {
    const userId = socket.userId;
    console.log(`✅ User ${userId} connected to chat`);

    // Thêm user vào danh sách online
    onlineUsers.set(userId, socket.id);
    io.emit('user-online', { userId });

    // Join room cho user
    socket.join(`user:${userId}`);

    // Lắng nghe khi user join một conversation
    socket.on('join-conversation', async ({ conversationId }) => {
      socket.join(`conversation:${conversationId}`);
      console.log(`User ${userId} joined conversation ${conversationId}`);
    });

    // Lắng nghe khi user leave một conversation
    socket.on('leave-conversation', ({ conversationId }) => {
      socket.leave(`conversation:${conversationId}`);
      console.log(`User ${userId} left conversation ${conversationId}`);
    });

    // Lắng nghe tin nhắn mới
    socket.on('send-message', async (data) => {
      try {
        const { conversationId, content, attachments = [] } = data;

        // Kiểm tra user có trong conversation không
        const conversation = await prisma.conversation.findFirst({
          where: {
            id: conversationId,
            participants: {
              some: {
                userId: userId,
              },
            },
          },
          include: {
            participants: true,
          },
        });

        if (!conversation) {
          socket.emit('error', { message: 'Không tìm thấy cuộc hội thoại' });
          return;
        }

        // Tạo message trong database
        const message = await prisma.message.create({
          data: {
            content,
            senderId: userId,
            conversationId,
            attachments,
          },
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        });

        // Cập nhật updatedAt của conversation
        await prisma.conversation.update({
          where: { id: conversationId },
          data: { updatedAt: new Date() },
        });

        // Gửi tin nhắn đến tất cả participants trong conversation
        const participantIds = conversation.participants.map((p) => p.userId);
        participantIds.forEach((participantId) => {
          if (participantId !== userId) {
            io.to(`user:${participantId}`).emit('new-message', message);
          }
        });

        // Gửi lại cho sender để confirm
        socket.emit('message-sent', message);
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', { message: 'Lỗi khi gửi tin nhắn', error: error.message });
      }
    });

    // Typing indicator
    socket.on('typing', ({ conversationId, isTyping }) => {
      socket.to(`conversation:${conversationId}`).emit('user-typing', {
        userId,
        isTyping,
      });
    });

    // Đánh dấu tin nhắn đã đọc
    socket.on('mark-read', async ({ conversationId }) => {
      try {
        await prisma.message.updateMany({
          where: {
            conversationId,
            senderId: { not: userId },
            isRead: false,
          },
          data: {
            isRead: true,
          },
        });

        // Thông báo cho người gửi
        socket.to(`conversation:${conversationId}`).emit('messages-read', {
          conversationId,
          readBy: userId,
        });
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`❌ User ${userId} disconnected from chat`);
      onlineUsers.delete(userId);
      io.emit('user-offline', { userId });
    });
  });
};

/**
 * Lấy danh sách online users
 */
const getOnlineUsers = () => {
  return Array.from(onlineUsers.keys());
};

module.exports = {
  setupChatSocket,
  getOnlineUsers,
};
