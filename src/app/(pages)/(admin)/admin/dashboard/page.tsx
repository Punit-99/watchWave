import { prisma } from "@/lib/prisma";
import { Film, Tv, Users } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [totalMovies, totalSeries, totalUsers] = await Promise.all([
    prisma.movie.count(),
    prisma.series.count(),
    prisma.user.count(),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Movies Card */}
        <div className="relative overflow-hidden rounded-2xl border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/20 group">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Total Movies</p>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
              <Film className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-bold mt-4 tracking-tight">{totalMovies}</p>
        </div>

        {/* Total Series Card */}
        <div className="relative overflow-hidden rounded-2xl border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/20 group">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Total Series</p>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
              <Tv className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-bold mt-4 tracking-tight">{totalSeries}</p>
        </div>

        {/* Users Card */}
        <div className="relative overflow-hidden rounded-2xl border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/20 group">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Users</p>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-bold mt-4 tracking-tight">{totalUsers}</p>
        </div>
      </div>
    </div>
  );
}
