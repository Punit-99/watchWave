import { Button } from "@/components/ui/button";
import MovieTable from "@/components/ui/movie-table";
import Link from "next/link";

export default function MoviesPage() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Movies</h1>
        <Button asChild>
          <Link href="/admin/movies/create">Add Movie</Link>
        </Button>
      </div>
      <MovieTable />
    </div>
  );
}
