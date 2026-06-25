import { Navbar } from "@/components/home/navbar";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 container mx-auto px-12 py-6">
        {children}
      </main>
    </div>
  );
}
