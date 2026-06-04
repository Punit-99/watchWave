import { Button } from "@/components/ui/button";
import AuthGuard from "./components/auth/AuthGuard";

export default function Home() {
  return (
    <AuthGuard>
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Hello WatchWave 👋</h1>

          <Button className="px-6 py-2">Get Started</Button>
        </div>
      </main>
    </AuthGuard>
  );
}
