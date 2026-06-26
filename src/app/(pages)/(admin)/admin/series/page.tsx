import { Button } from "@/components/ui/button";
import SeriesTable from "@/components/series/series-table";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function SeriesPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-5 border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Series</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your catalog of TV shows, create seasons, organize episodes, and upload video media.
          </p>
        </div>
        <Button asChild className="rounded-xl shadow-sm">
          <Link href="/admin/series/create" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>Add Series</span>
          </Link>
        </Button>
      </div>
      <SeriesTable />
    </div>
  );
}
