"use client";

import Link from "next/link";
import { Search } from "lucide-react";

const navItems = [
  { name: "Home", href: "/" },
  { name: "Movies", href: "/movies" },
  { name: "Series", href: "/series" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold">
          WatchWave
        </Link>

        {/* Search */}
        <div className="hidden md:flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Search movies..."
              className="h-10 w-72 rounded-md border bg-background pl-9 pr-3"
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-6">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.name}
            </Link>
          ))}

          {/* User Menu */}
          <div className="h-9 w-9 rounded-full bg-muted" />
        </nav>
      </div>
    </header>
  );
}
