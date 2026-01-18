import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) => {
        const { items } = get();
        const existingItemIndex = items.findIndex(
          (i) => i.id === item.id && i.variantId === item.variantId
        );

        if (existingItemIndex >= 0) {
          // Item exists, increase quantity
          const newItems = [...items];
          newItems[existingItemIndex].quantity += 1;
          set({ items: newItems });
        } else {
          // New item
          set({ items: [...items, { ...item, quantity: 1 }] });
        }
      },

      removeItem: (id, variantId) => {
        const { items } = get();
        set({
          items: items.filter(
            (item) => !(item.id === id && item.variantId === variantId)
          ),
        });
      },

      updateQuantity: (id, quantity, variantId) => {
        if (quantity <= 0) {
          get().removeItem(id, variantId);
          return;
        }

        const { items } = get();
        const newItems = items.map((item) =>
          item.id === id && item.variantId === variantId
            ? { ...item, quantity }
            : item
        );
        set({ items: newItems });
      },

      clearCart: () => {
        set({ items: [] });
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
        return items.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      getItemQuantity: (id, variantId) => {
        const { items } = get();
        const item = items.find(
          (i) => i.id === id && i.variantId === variantId
        );
        return item ? item.quantity : 0;
      },
    }),
    {
      name: 'cart-storage', // localStorage key
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }), // Only persist items
    }
  )
);
