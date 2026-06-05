import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center ">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Hello WatchWave 👋</h1>

        <Button className="px-6 py-2">Get Started</Button>
      </div>
    </main>
  );
}
