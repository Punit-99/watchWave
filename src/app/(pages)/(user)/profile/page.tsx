"use client";

import { useAuthStore } from "@/lib/store/auth.store";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/ui/logout";

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  console.log("user", user);
  if (!user) return null;

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative h-[320px] overflow-hidden">
        {/* Background Layers */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/30 via-primary/10 to-background" />

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.25),transparent_40%)]" />

        {/* Content */}
        <div className="container relative z-10 mx-auto flex h-full flex-col items-center justify-center px-4 text-center">
          <Avatar className="h-32 w-32 border-4 border-background shadow-2xl">
            <AvatarImage src={user.image ?? ""} />
            <AvatarFallback className="text-3xl">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          <h1 className="mt-5 text-4xl font-bold tracking-tight">
            {user.name}
          </h1>

          <p className="mt-2 text-muted-foreground">{user.email}</p>

          <Badge className="mt-4">{user.role}</Badge>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button type="button">Edit Profile</Button>

            <Button type="button" variant="secondary">
              Change Password
            </Button>

            <LogoutButton />
          </div>
        </div>
      </section>

      {/* Info */}
      <section className="container mx-auto max-w-5xl px-4 py-10">
        <h2 className="mb-6 text-2xl font-semibold">Account Information</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border p-5">
            <p className="text-sm text-muted-foreground">Full Name</p>
            <p className="mt-1 font-medium">{user.name}</p>
          </div>

          <div className="rounded-2xl border p-5">
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="mt-1 font-medium">{user.email}</p>
          </div>

          <div className="rounded-2xl border p-5">
            <p className="text-sm text-muted-foreground">Role</p>
            <p className="mt-1 font-medium">{user.role}</p>
          </div>

          <div className="rounded-2xl border p-5">
            <p className="text-sm text-muted-foreground">User ID</p>
            <p className="mt-1 break-all font-medium">{user.id}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
