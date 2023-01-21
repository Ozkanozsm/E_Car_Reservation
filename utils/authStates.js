import AsyncStorage from "@react-native-async-storage/async-storage";
import create from "zustand";

export const useAuthStore = create((set) => ({
  privateKey: null,
  address: null,
  savePrivateKey: (privateKey) => {
    set({ privateKey });
    AsyncStorage.setItem("privateKey", privateKey);
  },
  setAddress: (address) => {
    set({ address });
  },
  removePrivateKey: () => {
    set({ privateKey: null });
    AsyncStorage.removeItem("privateKey");
  },
  isStation: false,
  setIsStation: (isStation) => {
    set({ isStation });
  },
}));
