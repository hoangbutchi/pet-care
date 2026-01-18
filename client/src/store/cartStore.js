import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Helper function to get current user ID
const getCurrentUserId = () => {
  try {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    return userInfo?.user?.id || userInfo?._id || 'guest';
  } catch {
    return 'guest';
  }
};

// Helper function to save cart to user-specific localStorage
const saveUserCart = (userId, items) => {
  try {
    const userCartKey = `cart-storage-${userId}`;
    const cartData = { items, timestamp: Date.now() };
    localStorage.setItem(userCartKey, JSON.stringify(cartData));
  } catch (error) {
    console.error('Error saving user cart:', error);
  }
};

// Helper function to load cart from user-specific localStorage
const loadUserCart = (userId) => {
  try {
    const userCartKey = `cart-storage-${userId}`;
    const savedCart = localStorage.getItem(userCartKey);
    
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      const items = parsedCart.items || [];
      return items;
    }
  } catch (error) {
    console.error('Error loading user cart:', error);
  }
  return [];
};

export const useCartStore = create((set, get) => ({
  items: [],
  isOpen: false,
  currentUserId: null,

  // Initialize cart for current user
  initializeCart: () => {
    const userId = getCurrentUserId();
    const { currentUserId, items } = get();
    
    // If user changed, save current cart and load new user's cart
    if (currentUserId !== userId) {
      // Save current cart if there was a previous user
      if (currentUserId && currentUserId !== 'guest') {
        saveUserCart(currentUserId, items);
      }
      
      // Load new user's cart
      const userItems = loadUserCart(userId);
      set({ currentUserId: userId, items: userItems });
    }
  },

  addItem: (item) => {
    get().initializeCart(); // Ensure correct user cart
    const { items, currentUserId } = get();
    
    const existingItemIndex = items.findIndex(
      (i) => i.id === item.id && i.variantId === item.variantId
    );

    let newItems;
    if (existingItemIndex >= 0) {
      // Item exists, increase quantity
      newItems = [...items];
      newItems[existingItemIndex].quantity += 1;
    } else {
      // New item
      newItems = [...items, { ...item, quantity: 1 }];
    }
    
    set({ items: newItems });
    if (currentUserId) saveUserCart(currentUserId, newItems);
  },

  removeItem: (id, variantId) => {
    const { items, currentUserId } = get();
    const newItems = items.filter(
      (item) => !(item.id === id && item.variantId === variantId)
    );
    
    set({ items: newItems });
    if (currentUserId) saveUserCart(currentUserId, newItems);
  },

  updateQuantity: (id, quantity, variantId) => {
    if (quantity <= 0) {
      get().removeItem(id, variantId);
      return;
    }

    const { items, currentUserId } = get();
    const newItems = items.map((item) =>
      item.id === id && item.variantId === variantId
        ? { ...item, quantity }
        : item
    );
    
    set({ items: newItems });
    if (currentUserId) saveUserCart(currentUserId, newItems);
  },

  clearCart: () => {
    const { currentUserId } = get();
    set({ items: [] });
    if (currentUserId) saveUserCart(currentUserId, []);
  },

  toggleCart: () => {
    set((state) => ({ isOpen: !state.isOpen }));
  },

  openCart: () => {
    set({ isOpen: true });
  },

  closeCart: () => {
    set({ isOpen: false });
  },

  getTotalItems: () => {
    const { items } = get();
    return items.reduce((total, item) => total + item.quantity, 0);
  },

  getTotalPrice: () => {
    const { items } = get();
    return items.reduce((total, item) => {
      const price = typeof item.price === 'number' ? item.price : parseFloat(item.price || 0);
      return total + price * item.quantity;
    }, 0);
  },

  getItemQuantity: (id, variantId) => {
    const { items } = get();
    const item = items.find(
      (i) => i.id === id && i.variantId === variantId
    );
    return item ? item.quantity : 0;
  },
}));
