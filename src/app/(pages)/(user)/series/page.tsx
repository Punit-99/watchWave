"use client";

import React from "react";
import { useGetAllSeries } from "@/hooks/use-series";
import { MediaCard } from "@/components/common/media-card";

export default function SeriesPage() {
  const { data, isLoading, error } = useGetAllSeries(1, 100);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        Loading series...
      </div>
    );
  }

  if (error || !data?.success) {
    return (
      <div className="flex min-h-screen items-center justify-center text-destructive">
        Failed to load series.
      </div>
    );
  }

  const seriesList = data.data || [];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">Series</h1>

      {seriesList.length === 0 ? (
        <p className="text-muted-foreground text-sm">No series found.</p>
      ) : (
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {seriesList.map((item) => (
            <MediaCard
              key={item.id}
              id={item.id}
              title={item.title}
              image={item.bannerUrl || item.posterUrl}
              type="SERIES"
              description={item.description}
            />
          ))}
        </div>
      )}
    </div>
  );
}
