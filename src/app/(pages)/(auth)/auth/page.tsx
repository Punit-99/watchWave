"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "@/components/auth/login-form";
import RegisterForm from "@/components/auth/register-form";
import { Play, Sparkles } from "lucide-react";

export default function AuthPage() {
  return (
    <div className="w-full min-h-screen grid lg:grid-cols-12 bg-background relative overflow-hidden">
      {/* Background ambient glows for mobile or overall depth */}
      <div className="absolute top-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />

      {/* Left Column: Premium Cinematic Branding Hero (hidden on mobile) */}
      <div className="hidden lg:flex lg:col-span-6 xl:col-span-7 relative flex-col justify-between p-16 text-white overflow-hidden border-r border-border/20">
        {/* Cinematic Grid Image with overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/cinema_grid.png"
            alt="Cinema Grid"
            className="w-full h-full object-cover opacity-20 scale-105 transition-transform duration-[20s] ease-out hover:scale-100"
          />
          {/* Subtle gradient overlays to create a rich theater feel */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/20 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,hsl(var(--primary)/0.25),transparent_60%)]" />
        </div>

        {/* Top: Branding Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-violet-600 shadow-lg shadow-primary/30">
            <Play className="h-5 w-5 fill-white text-white ml-0.5" />
          </div>
          <span className="text-2xl font-black tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-neutral-400">
            WATCHWAVE
          </span>
        </div>

        {/* Bottom: Cinema Marketing Copy */}
        <div className="relative z-10 max-w-lg space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-semibold tracking-wider uppercase backdrop-blur-sm animate-pulse">
            <Sparkles className="h-3 w-3" />
            Unlimited Streaming in 4K HDR
          </div>

          <h1 className="text-5xl font-extrabold tracking-tight leading-tight bg-gradient-to-r from-white via-neutral-100 to-neutral-400 bg-clip-text text-transparent">
            Your Gateway to Infinite Entertainment.
          </h1>

          <p className="text-lg text-neutral-400 font-medium leading-relaxed">
            Experience hundreds of blockbusters, critically-acclaimed series,
            and exclusive originals. Watch whenever, wherever you want.
          </p>

          <div className="flex items-center gap-6 pt-4 text-sm text-neutral-500 font-semibold">
            <span>✓ No Ads</span>
            <span>✓ Cancel Anytime</span>
            <span>✓ Multiple Devices</span>
          </div>
        </div>
      </div>

      {/* Right Column: Responsive Glassmorphic Form Card */}
      <div className="col-span-12 lg:col-span-6 xl:col-span-5 flex flex-col items-center justify-center p-6 sm:p-12 relative z-10">
        {/* Mobile Logo (hidden on large screens) */}
        <div className="flex lg:hidden items-center gap-3 mb-8">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-violet-600 shadow-md shadow-primary/20">
            <Play className="h-4 w-4 fill-white text-white ml-0.5" />
          </div>
          <span className="text-xl font-black tracking-wider">WATCHWAVE</span>
        </div>

        {/* Form Card wrapper */}
        <div className="w-full max-w-md backdrop-blur-xl bg-card/30 border border-border/40 p-8 sm:p-10 rounded-[2rem] shadow-2xl shadow-black/40">
          <div className="space-y-2 mb-8 text-center sm:text-left">
            <h2 className="text-3xl font-bold tracking-tight">Welcome Back</h2>
            <p className="text-muted-foreground text-sm font-medium">
              Start streaming your favorite stories today.
            </p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 rounded-2xl bg-muted/50 p-1 border border-border/10">
              <TabsTrigger
                value="login"
                className="rounded-xl font-semibold transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                Login
              </TabsTrigger>
              <TabsTrigger
                value="register"
                className="rounded-xl font-semibold transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                Register
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="mt-6 focus-visible:outline-none">
              <LoginForm />
            </TabsContent>

            <TabsContent value="register" className="mt-6 focus-visible:outline-none">
              <RegisterForm />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
