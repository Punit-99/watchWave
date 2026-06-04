"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/lib/store/auth.store";

export default function GuestGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const user = useAuthStore((state) => state.user);

  const authChecked = useAuthStore((state) => state.authChecked);

  useEffect(() => {
    if (!authChecked) return;

    if (!user) return;

    if (user.role === "ADMIN") {
      router.replace("/admin/dashboard");
    } else {
      router.replace("/");
    }
  }, [user, authChecked, router]);

  if (!authChecked) {
    return null;
  }

  if (user) {
    return null;
  }

  return <>{children}</>;
}
