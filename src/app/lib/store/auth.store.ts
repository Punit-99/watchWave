import { create } from "zustand";

type User = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
  image: string | null;
};

type AuthState = {
  user: User | null;
  authChecked: boolean;
  authFailed: boolean;

  setUser: (user: User | null) => void;
  setAuthChecked: (value: boolean) => void;
  setAuthFailed: (value: boolean) => void;

  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  authChecked: false,
  authFailed: false,

  setUser: (user) => set({ user }),

  setAuthChecked: (value) =>
    set({
      authChecked: value,
    }),

  setAuthFailed: (value) =>
    set({
      authFailed: value,
    }),

  logout: () =>
    set({
      user: null,
      authChecked: true,
      authFailed: true,
    }),
}));
