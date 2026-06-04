"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/lib/store/auth.store";

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const user = useAuthStore((state) => state.user);

  const authChecked = useAuthStore((state) => state.authChecked);

  useEffect(() => {
    if (!authChecked) return;

    if (!user) {
      router.replace("/auth");
      return;
    }

    if (user.role !== "ADMIN") {
      router.replace("/");
    }
  }, [user, authChecked, router]);

  if (!authChecked) {
    return null;
  }

  if (!user) {
    return null;
  }

  if (user.role !== "ADMIN") {
    return null;
  }

  return <>{children}</>;
}
