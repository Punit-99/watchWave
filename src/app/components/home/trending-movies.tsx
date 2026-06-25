"use client";

import { useGetAllMovies } from "@/hooks/use-movie";
import { MediaSection } from "../movies/media-section";

export function TrendingMovies() {
  const { data, isLoading } = useGetAllMovies(1, 5);

  if (isLoading || !data?.success) {
    return null;
  }

  const items = (data.data || []).map((m) => ({
    id: m.id,
    title: m.title,
    image: m.bannerUrl || m.posterUrl,
    type: "MOVIE" as const,
    description: m.description,
  }));

  return <MediaSection title="Trending Movies" items={items} />;
}
