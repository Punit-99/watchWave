"use client";

import { useEffect } from "react";

import { useMe } from "@/hooks/use-auth";
import { useAuthStore } from "@/lib/store/auth.store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore((state) => state.setUser);

  const { data, isError } = useMe();

  useEffect(() => {
    if (data) {
      setUser(data);
    }
  }, [data, setUser]);

  useEffect(() => {
    if (isError) {
      setUser(null);
    }
  }, [isError, setUser]);

  return <>{children}</>;
}
