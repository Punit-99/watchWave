"use client";

import Link from "next/link";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";

import { useDeleteSeries, useGetAllSeries } from "@/hooks/use-series";

export default function SeriesTable() {
  const { data, isLoading, error } = useGetAllSeries();
  const deleteSeriesMutation = useDeleteSeries();

  if (isLoading) {
    return <div className="rounded-xl border p-6">Loading series...</div>;
  }

  if (error) {
    return (
      <div className="rounded-xl border p-6 text-destructive">
        Failed to load series.
      </div>
    );
  }

  const seriesList = data?.data ?? [];

  return (
    <div className="rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Genre</TableHead>
            <TableHead>Language</TableHead>
            <TableHead>Age Rating</TableHead>
            <TableHead>Release Year</TableHead>
            <TableHead>Total Seasons</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {seriesList.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                No series found.
              </TableCell>
            </TableRow>
          ) : (
            seriesList.map((item) => {
              // 🔥 FIX: derive total seasons from nested structure
              const totalSeasons = item.series?.[0]?.seasons?.length ?? 0;

              return (
                <TableRow key={item.id}>
                  <TableCell>{item.title}</TableCell>

                  <TableCell>{item.genre.join(", ")}</TableCell>

                  <TableCell>{item.language.join(", ")}</TableCell>

                  <TableCell>{item.ageRating}</TableCell>

                  <TableCell>{item.releaseYear}</TableCell>

                  <TableCell>{totalSeasons}</TableCell>

                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="secondary" asChild>
                        <Link href={`/admin/series/detail/${item.id}`}>
                          View
                        </Link>
                      </Button>

                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/admin/series/${item.id}/edit`}>Edit</Link>
                      </Button>

                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteSeriesMutation.mutate(item.id)}
                        disabled={deleteSeriesMutation.isPending}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
