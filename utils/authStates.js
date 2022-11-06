import AsyncStorage from "@react-native-async-storage/async-storage";
import create from "zustand";

export const useAuthStore = create((set) => ({
  privateKey: null,
  savePrivateKey: (privateKey) => {
    set({ privateKey });
    AsyncStorage.setItem("privateKey", privateKey);
  },

  removePrivateKey: () => {
    set({ privateKey: null });
    AsyncStorage.removeItem("privateKey");
  },
}));
