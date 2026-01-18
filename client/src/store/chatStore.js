import { create } from 'zustand';
import { io } from 'socket.io-client';

const useChatStore = create((set, get) => {
  let socket = null;

  return {
    // State
    conversations: [],
    currentConversation: null,
    messages: {},
    onlineUsers: [],
    typingUsers: {},
    isConnected: false,
    isLoading: false,
    error: null,

    // Initialize socket connection
    connectSocket: (token) => {
      if (socket?.connected) {
        return;
      }

      socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
        auth: {
          token: token,
        },
        transports: ['websocket', 'polling'],
      });

      socket.on('connect', () => {
        console.log('✅ Connected to chat server');
        set({ isConnected: true });
      });

      socket.on('disconnect', () => {
        console.log('❌ Disconnected from chat server');
        set({ isConnected: false });
      });

      socket.on('user-online', ({ userId }) => {
        const { onlineUsers } = get();
        if (!onlineUsers.includes(userId)) {
          set({ onlineUsers: [...onlineUsers, userId] });
        }
      });

      socket.on('user-offline', ({ userId }) => {
        const { onlineUsers } = get();
        set({ onlineUsers: onlineUsers.filter((id) => id !== userId) });
      });

      socket.on('new-message', (message) => {
        const { messages, currentConversation } = get();
        if (currentConversation?.id === message.conversationId) {
          const conversationMessages = messages[message.conversationId] || [];
          set({
            messages: {
              ...messages,
              [message.conversationId]: [...conversationMessages, message],
            },
          });
        }
        // TODO: Show notification
      });

      socket.on('message-sent', (message) => {
        const { messages } = get();
        const conversationMessages = messages[message.conversationId] || [];
        set({
          messages: {
            ...messages,
            [message.conversationId]: [...conversationMessages, message],
          },
        });
      });

      socket.on('user-typing', ({ userId, isTyping }) => {
        const { typingUsers } = get();
        set({
          typingUsers: {
            ...typingUsers,
            [userId]: isTyping,
          },
        });
      });

      socket.on('error', (error) => {
        console.error('Socket error:', error);
        set({ error: error.message });
      });
    },

    // Disconnect socket
    disconnectSocket: () => {
      if (socket) {
        socket.disconnect();
        socket = null;
      }
      set({ isConnected: false });
    },

    // Join conversation
    joinConversation: (conversationId) => {
      if (socket) {
        socket.emit('join-conversation', { conversationId });
      }
    },

    // Leave conversation
    leaveConversation: (conversationId) => {
      if (socket) {
        socket.emit('leave-conversation', { conversationId });
      }
    },

    // Send message
    sendMessage: (conversationId, content, attachments = []) => {
      if (socket) {
        socket.emit('send-message', {
          conversationId,
          content,
          attachments,
        });
      }
    },

    // Typing indicator
    setTyping: (conversationId, isTyping) => {
      if (socket) {
        socket.emit('typing', { conversationId, isTyping });
      }
    },

    // Mark messages as read
    markAsRead: (conversationId) => {
      if (socket) {
        socket.emit('mark-read', { conversationId });
      }
    },

    // Set conversations
    setConversations: (conversations) => {
      set({ conversations });
    },

    // Set current conversation
    setCurrentConversation: (conversation) => {
      set({ currentConversation: conversation });
      if (conversation) {
        get().joinConversation(conversation.id);
      }
    },

    // Set messages
    setMessages: (conversationId, messages) => {
      const currentMessages = get().messages;
      set({
        messages: {
          ...currentMessages,
          [conversationId]: messages,
        },
      });
    },

    // Add message
    addMessage: (conversationId, message) => {
      const { messages } = get();
      const conversationMessages = messages[conversationId] || [];
      set({
        messages: {
          ...messages,
          [conversationId]: [...conversationMessages, message],
        },
      });
    },

    // Set loading
    setLoading: (isLoading) => {
      set({ isLoading: isLoading });
    },

    // Set error
    setError: (error) => {
      set({ error });
    },

    // Clear error
    clearError: () => {
      set({ error: null });
    },
  };
});

export default useChatStore;
