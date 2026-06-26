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
import { Badge } from "@/components/ui/badge";
import { Eye, Pencil, Trash2 } from "lucide-react";

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
    <div className="space-y-6">
      {/* TABLE */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-zinc-50/50 dark:bg-zinc-900/30">
            <TableRow className="border-b border-zinc-200 dark:border-zinc-800">
              <TableHead className="font-semibold text-xs tracking-wider uppercase text-zinc-500 dark:text-zinc-400 py-3 px-6">Title</TableHead>
              <TableHead className="font-semibold text-xs tracking-wider uppercase text-zinc-500 dark:text-zinc-400 py-3 px-6">Genre</TableHead>
              <TableHead className="font-semibold text-xs tracking-wider uppercase text-zinc-500 dark:text-zinc-400 py-3 px-6">Language</TableHead>
              <TableHead className="font-semibold text-xs tracking-wider uppercase text-zinc-500 dark:text-zinc-400 py-3 px-6">Age Rating</TableHead>
              <TableHead className="font-semibold text-xs tracking-wider uppercase text-zinc-500 dark:text-zinc-400 py-3 px-6">Release Year</TableHead>
              <TableHead className="font-semibold text-xs tracking-wider uppercase text-zinc-500 dark:text-zinc-400 py-3 px-6 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {movies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                  No movies found
                </TableCell>
              </TableRow>
            ) : (
              movies.map((movie) => (
                <TableRow key={movie.id} className="hover:bg-zinc-50/40 dark:hover:bg-zinc-900/40 border-b border-zinc-100 dark:border-zinc-800 last:border-0 transition-colors">
                  <TableCell className="font-semibold text-zinc-900 dark:text-zinc-100 py-4 px-6">{movie.title}</TableCell>
                  <TableCell className="py-4 px-6">
                    <div className="flex flex-wrap gap-1.5">
                      {movie.genre.slice(0, 2).map((g) => (
                        <Badge key={g} variant="outline" className="text-[10px] font-medium tracking-wide py-0 px-2 border-zinc-200 dark:border-zinc-800">
                          {g}
                        </Badge>
                      ))}
                      {movie.genre.length > 2 && (
                        <span className="text-[10px] text-muted-foreground flex items-center">
                          +{movie.genre.length - 2}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <div className="flex flex-wrap gap-1.5">
                      {movie.language.slice(0, 2).map((l) => (
                        <Badge key={l} variant="outline" className="text-[10px] font-medium tracking-wide py-0 px-2 border-zinc-200 dark:border-zinc-800">
                          {l}
                        </Badge>
                      ))}
                      {movie.language.length > 2 && (
                        <span className="text-[10px] text-muted-foreground flex items-center">
                          +{movie.language.length - 2}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    {movie.ageRating ? (
                      <Badge variant="secondary" className="text-[10px] font-mono tracking-wide py-0.5 px-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200">
                        {movie.ageRating}
                      </Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-zinc-600 dark:text-zinc-400 py-4 px-6">{movie.releaseYear}</TableCell>

                  <TableCell className="py-4 px-6">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" className="h-8 rounded-lg text-xs" asChild>
                        <Link href={`/details/${movie.id}`}>
                          <Eye className="h-3.5 w-3.5 mr-1" />
                          <span>View</span>
                        </Link>
                      </Button>

                      <Button size="sm" variant="outline" className="h-8 rounded-lg text-xs" asChild>
                        <Link href={`/admin/movies/edit/${movie.id}`}>
                          <Pencil className="h-3.5 w-3.5 mr-1" />
                          <span>Edit</span>
                        </Link>
                      </Button>

                      <Button
                        size="sm"
                        variant="destructive"
                        className="h-8 rounded-lg text-xs bg-red-500/10 hover:bg-red-500 hover:text-white border-0 text-red-600 dark:text-red-400 transition-colors"
                        onClick={() => deleteMovieMutation.mutate(movie.id)}
                        disabled={deleteMovieMutation.isPending}
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-1" />
                        <span>Delete</span>
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
