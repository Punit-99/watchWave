// components/guards/UserGuard.tsx

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/lib/store/auth.store";

export default function UserGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!user) {
      router.replace("/auth");
      return;
    }

    if (user.role !== "USER") {
      router.replace("/admin/dashboard");
    }
  }, [user, router]);

  if (!user) return null;

  if (user.role !== "USER") return null;

  return <>{children}</>;
}
