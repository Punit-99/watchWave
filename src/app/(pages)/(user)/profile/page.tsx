"use client";

import { useState, useRef } from "react";
import { useAuthStore } from "@/lib/store/auth.store";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { LogoutButton } from "@/components/auth/logout";
import { useUploadMedia } from "@/hooks/use-upload";
import { updateProfile } from "@/lib/api/auth.api";
import { appToast } from "@/lib/toast";
import { Camera, Pencil, Loader2 } from "lucide-react";

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isUploading, setIsUploading] = useState(false);

  const uploadMutation = useUploadMedia();

  if (!user) return null;

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type strictly: jpeg, png, webp
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      appToast.error("Only JPG, PNG, and WEBP image formats are allowed");
      return;
    }

    setIsUploading(true);
    try {
      const res = await uploadMutation.mutateAsync(file);
      const updatedUser = await updateProfile({ image: res.url });
      setUser({
        ...user,
        image: updatedUser.image,
      });
      appToast.updated("Profile picture");
    } catch (error: any) {
      appToast.error(error?.response?.data?.message ?? "Failed to upload avatar");
    } finally {
      setIsUploading(false);
      // Reset file input value so same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative h-[320px] overflow-hidden">
        {/* Background Layers */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/30 via-primary/10 to-background" />

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.25),transparent_40%)]" />

        {/* Content */}
        <div className="container relative z-10 mx-auto flex h-full flex-col items-center justify-center px-4 text-center">
          {/* Avatar container with hover state and pen/camera icon */}
          <div
            className="relative group cursor-pointer"
            onClick={handleAvatarClick}
          >
            <Avatar className="h-32 w-32 border-4 border-background shadow-2xl transition duration-300 group-hover:opacity-90">
              <AvatarImage src={user.image ?? ""} className="object-cover" />
              <AvatarFallback className="text-3xl bg-primary/10">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            {/* Hover overlay */}
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {isUploading ? (
                <Loader2 className="h-8 w-8 text-white animate-spin" />
              ) : (
                <Camera className="h-8 w-8 text-white" />
              )}
            </div>

            {/* Always visible small pen badge on the bottom-right corner of the avatar */}
            <div className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-full border border-background bg-primary text-primary-foreground shadow-lg">
              {isUploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Pencil className="h-4 w-4" />
              )}
            </div>
          </div>

          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png, image/jpeg, image/webp"
            className="hidden"
            disabled={isUploading}
          />

          {/* Name Display */}
          <h1 className="mt-5 text-4xl font-bold tracking-tight">
            {user.name}
          </h1>

          <p className="mt-2 text-muted-foreground">{user.email}</p>

          <Badge className="mt-4">{user.role}</Badge>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
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
