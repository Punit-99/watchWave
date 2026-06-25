"use client";

import React from "react";
import { useGetAllMovies } from "@/hooks/use-movie";
import { MediaCard } from "@/components/common/media-card";

export default function MoviePage() {
  const { data, isLoading, error } = useGetAllMovies(1, 100);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        Loading movies...
      </div>
    );
  }

  if (error || !data?.success) {
    return (
      <div className="flex min-h-screen items-center justify-center text-destructive">
        Failed to load movies.
      </div>
    );
  }

  const movies = data.data || [];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">Movies</h1>

      {movies.length === 0 ? (
        <p className="text-muted-foreground text-sm">No movies found.</p>
      ) : (
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {movies.map((movie) => (
            <MediaCard
              key={movie.id}
              id={movie.id}
              title={movie.title}
              image={movie.bannerUrl || movie.posterUrl}
              type="MOVIE"
              description={movie.description}
            />
          ))}
        </div>
      )}
    </div>
  );
}
