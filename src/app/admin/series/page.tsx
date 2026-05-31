import { Button } from "@/components/ui/button";

export default function SeriesPage() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Series</h1>
        <Button>Add Series</Button>
      </div>

      <div className="rounded-xl border bg-white p-4">
        <p className="text-gray-500">Series table will go here</p>
      </div>
    </div>
  );
}