"use client";

import { useGetAllMovies } from "@/hooks/use-movie";
import { useGetAllSeries } from "@/hooks/use-series";
import { MediaSection } from "../movies/media-section";

export function NewReleases() {
  const { data: moviesData, isLoading: moviesLoading } = useGetAllMovies(1, 3);
  const { data: seriesData, isLoading: seriesLoading } = useGetAllSeries(1, 3);

  if (moviesLoading || seriesLoading) {
    return null;
  }

  const movieItems = (moviesData?.data || []).map((m) => ({
    id: m.id,
    title: m.title,
    image: m.bannerUrl || m.posterUrl,
    type: "MOVIE" as const,
    createdAt: m.createdAt,
    description: m.description,
  }));

  const seriesItems = (seriesData?.data || []).map((s) => ({
    id: s.id,
    title: s.title,
    image: s.bannerUrl || s.posterUrl,
    type: "SERIES" as const,
    createdAt: s.createdAt,
    description: s.description,
  }));

  // Combine and sort by createdAt desc
  const combined = [...movieItems, ...seriesItems]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  if (combined.length === 0) {
    return null;
  }

  return <MediaSection title="New Releases" items={combined} />;
}
