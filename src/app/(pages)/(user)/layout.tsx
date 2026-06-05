// app/(user)/layout.tsx

import { Navbar } from "@/components/ui/navbar";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
