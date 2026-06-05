"use client";

import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";

import { LayoutDashboard, Film, Tv } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LogoutButton } from "@/components/ui/logout";

const menuItems = [
  {
    href: "/admin/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/movies",
    label: "Movies",
    icon: Film,
  },
  {
    href: "/admin/series",
    label: "Series",
    icon: Tv,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background text-foreground transition-colors">
        {/* Sidebar */}
        <Sidebar className="border-r  dark:bg-zinc-950 dark:border-zinc-800 backdrop-blur-md">
          <SidebarContent className="p-3">
            <SidebarGroup>
              <div className="flex items-center justify-between px-2">
                <SidebarGroupLabel className="text-xs font-semibold tracking-widest text-muted-foreground">
                  ADMIN PANEL
                </SidebarGroupLabel>

                <ThemeToggle />
              </div>

              <SidebarGroupContent>
                <SidebarMenu className="mt-3 space-y-1">
                  {menuItems.map((item) => {
                    const active = pathname === item.href;
                    const Icon = item.icon;

                    return (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton asChild>
                          <Link
                            href={item.href}
                            className={cn(
                              "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200",
                              "hover:bg-muted hover:scale-[1.01] active:scale-95",
                              active
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "text-muted-foreground",
                            )}
                          >
                            <Icon
                              className={cn(
                                "h-4 w-4 transition-transform",
                                active && "text-primary-foreground",
                              )}
                            />
                            <span>{item.label}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <LogoutButton />
          </SidebarFooter>
        </Sidebar>

        {/* Main content */}
        <main className="flex-1 p-6 md:p-8 bg-background transition-colors">
          {children}{" "}
        </main>
      </div>
    </SidebarProvider>
  );
}
