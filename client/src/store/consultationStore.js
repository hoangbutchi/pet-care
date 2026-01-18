import { create } from 'zustand';

const useConsultationStore = create((set) => ({
  // State
  consultations: [],
  currentConsultation: null,
  consultants: [],
  availableSlots: [],
  isLoading: false,
  error: null,

  // Set consultations
  setConsultations: (consultations) => {
    set({ consultations });
  },

  // Set current consultation
  setCurrentConsultation: (consultation) => {
    set({ currentConsultation: consultation });
  },

  // Set consultants
  setConsultants: (consultants) => {
    set({ consultants });
  },

  // Set available slots
  setAvailableSlots: (slots) => {
    set({ availableSlots: slots });
  },

  // Set loading
  setLoading: (isLoading) => {
    set({ isLoading });
  },

  // Set error
  setError: (error) => {
    set({ error });
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },
}));

export default useConsultationStore;
