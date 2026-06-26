"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useLogout } from "@/hooks/use-auth"; // adjust path
import { appToast } from "@/lib/toast";
import { useAuthStore } from "@/lib/store/auth.store";
import { queryClient } from "@/lib/query-client";

export function LogoutButton() {
  const router = useRouter();

  const { mutate: logout, isPending } = useLogout();
  const logoutStore = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        queryClient.clear();
        logoutStore();
        appToast.logoutSuccess();
        router.replace("/auth");
      },
      onError: (error) => {
        console.error("Logout failed:", error);
      },
    });
  };

  return (
    <Button variant="destructive" onClick={handleLogout} disabled={isPending}>
      <LogOut className="mr-2 h-4 w-4" />
      {isPending ? "Logging out..." : "Logout"}
    </Button>
  );
}
