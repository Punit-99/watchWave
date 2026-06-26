import { Button } from "@/components/ui/button";
import MovieTable from "@/components/movies/movie-table";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function MoviesPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-5 border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Movies</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your catalog of movies, update descriptions, assign genres, and upload high-quality video files.
          </p>
        </div>
        <Button asChild className="rounded-xl shadow-sm">
          <Link href="/admin/movies/create" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>Add Movie</span>
          </Link>
        </Button>
      </div>
      <MovieTable />
    </div>
  );
}
