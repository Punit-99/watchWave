import { Button } from "@/components/ui/button";
import SeriesTable from "@/components/ui/series-table";
import Link from "next/link";

export default function SeriesPage() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Series</h1>

        <Button asChild>
          <Link href="/admin/series/create">Add Series</Link>
        </Button>
      </div>

      <SeriesTable />
    </div>
  );
}
