"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "@/components/auth/login-form";
import RegisterForm from "@/components/auth/register-form";
import GuestGuard from "@/components/guards/GuestGuard";

export default function AuthPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md rounded-2xl border  p-6 shadow-sm">
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="mt-4">
            <GuestGuard>
              <LoginForm />
            </GuestGuard>
          </TabsContent>

          <TabsContent value="register" className="mt-4">
            <GuestGuard>
              <RegisterForm />
            </GuestGuard>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
