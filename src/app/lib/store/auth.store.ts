import { create } from "zustand";

type User = {
  userId: string;
  role: "USER" | "ADMIN";
};

type AuthState = {
  user: User | null;
  initialized: boolean;

  setUser: (user: User | null) => void;
  setInitialized: (value: boolean) => void;

  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  initialized: false,

  setUser: (user) => set({ user }),

  setInitialized: (value) =>
    set({
      initialized: value,
    }),

  logout: () =>
    set({
      user: null,
      initialized: true,
    }),
}));
