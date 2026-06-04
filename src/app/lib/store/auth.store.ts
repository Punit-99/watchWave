// store/auth.store.ts

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
  setUser: (user: User | null) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,

  setUser: (user) =>
    set({
      user,
    }),

  logout: () =>
    set({
      user: null,
    }),
}));
