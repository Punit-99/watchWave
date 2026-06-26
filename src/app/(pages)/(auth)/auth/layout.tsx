// app/(auth)/layout.tsx

import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen w-full bg-background flex flex-col justify-between overflow-x-hidden">
      {children}
    </main>
  );
}
