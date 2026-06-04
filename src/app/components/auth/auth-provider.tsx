"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import { useMe } from "@/hooks/use-auth";
import { useAuthStore } from "@/lib/store/auth.store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isAuthPage = pathname.startsWith("/auth");

  const setUser = useAuthStore((state) => state.setUser);

  const { data, isError } = useMe(!isAuthPage);

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
