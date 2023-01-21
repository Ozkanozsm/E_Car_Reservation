import create from "zustand";

export const useUserDataStore = create((set) => ({
  id: 0,
  total_cancelled: 0,
  total_completed: 0,
  total_spent: 0,
  total_made: 0,
  setId: (id) => set({ id }),
  setTotalCancelled: (total_cancelled) => set({ total_cancelled }),
  setTotalCompleted: (total_completed) => set({ total_completed }),
  setTotalSpent: (total_spent) => set({ total_spent }),
  setTotalMade: (total_made) => set({ total_made }),
}));
