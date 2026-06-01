import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function MoviesPage() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Movies</h1>

        <Button asChild>
          <Link href="/admin/movies/create">Add Movie</Link>
        </Button>
      </div>

      <div className="rounded-xl border bg-white p-4">
        <p className="text-gray-500">Movie table will go here</p>
      </div>
    </div>
  );
}
