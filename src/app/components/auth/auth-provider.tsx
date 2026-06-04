"use client";

import { useEffect } from "react";

import { useMe } from "@/hooks/use-auth";
import { useAuthStore } from "@/lib/store/auth.store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore((state) => state.setUser);

  const setAuthChecked = useAuthStore((state) => state.setAuthChecked);

  const { data, isError } = useMe();

  useEffect(() => {
    if (data) {
      setUser(data);
      setAuthChecked(true);
    }
  }, [data, setUser, setAuthChecked]);

  useEffect(() => {
    if (isError) {
      setUser(null);
      setAuthChecked(true);
    }
  }, [isError, setUser, setAuthChecked]);

  return <>{children}</>;
}
