"use client";

import { useState } from "react";
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

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { useDeleteSeries, useGetAllSeries } from "@/hooks/use-series";

export default function SeriesTable() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, error } = useGetAllSeries(page, limit);
  const deleteSeriesMutation = useDeleteSeries();

  if (isLoading) {
    return <div className="rounded-xl border p-6">Loading series...</div>;
  }

  if (error) {
    return (
      <div className="rounded-xl border p-6 text-destructive">
        Failed to load series
      </div>
    );
  }

  const seriesList = data?.data ?? [];
  const pagination = data?.pagination;

  const totalPages = pagination?.totalPages ?? 1;

  return (
    <div className="space-y-4">
      {/* TABLE */}
      <div className="rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Genre</TableHead>
              <TableHead>Language</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Total Seasons</TableHead> {/* ADDED */}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {seriesList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No series found
                </TableCell>
              </TableRow>
            ) : (
              seriesList.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.genre.join(", ")}</TableCell>
                  <TableCell>{item.language.join(", ")}</TableCell>
                  <TableCell>{item.releaseYear}</TableCell>

                  <TableCell>{item.series?.totalSeasons ?? 0}</TableCell>

                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="secondary" asChild>
                        <Link href={`/admin/series/detail/${item.id}`}>
                          View
                        </Link>
                      </Button>

                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/admin/series/edit/${item.id}`}>Edit</Link>
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
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* PAGINATION */}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              className={page <= 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>

          <PaginationItem>
            <span className="px-3 text-sm">
              Page {page} of {totalPages}
            </span>
          </PaginationItem>

          <PaginationItem>
            <PaginationNext
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              className={
                page >= totalPages ? "pointer-events-none opacity-50" : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
