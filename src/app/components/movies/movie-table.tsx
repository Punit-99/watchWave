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

import { useDeleteMovie, useGetAllMovies } from "@/hooks/use-movie";

export default function MovieTable() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, error } = useGetAllMovies(page, limit);
  const deleteMovieMutation = useDeleteMovie();

  if (isLoading) {
    return <div className="rounded-xl border p-6">Loading movies...</div>;
  }

  if (error) {
    return (
      <div className="rounded-xl border p-6 text-destructive">
        Failed to load movies.
      </div>
    );
  }

  const movies = data?.data ?? [];
 
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
              <TableHead>Age Rating</TableHead>
              <TableHead>Release Year</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {movies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No movies found
                </TableCell>
              </TableRow>
            ) : (
              movies.map((movie) => (
                <TableRow key={movie.id}>
                  <TableCell>{movie.title}</TableCell>
                  <TableCell>{movie.genre.join(", ")}</TableCell>
                  <TableCell>{movie.language.join(", ")}</TableCell>
                  <TableCell>{movie.ageRating}</TableCell>
                  <TableCell>{movie.releaseYear}</TableCell>

                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="secondary" asChild>
                        <Link href={`/details/${movie.id}`}>
                          View
                        </Link>
                      </Button>

                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/admin/movies/edit/${movie.id}`}>
                          Edit
                        </Link>
                      </Button>

                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteMovieMutation.mutate(movie.id)}
                        disabled={deleteMovieMutation.isPending}
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
