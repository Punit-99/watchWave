"use client";

import { useGetAllSeries } from "@/hooks/use-series";
import { MediaSection } from "../movies/media-section";

export function TrendingSeries() {
  const { data, isLoading } = useGetAllSeries(1, 5);

  if (isLoading || !data?.success) {
    return null;
  }

  const items = (data.data || []).map((s) => ({
    id: s.id,
    title: s.title,
    image: s.bannerUrl || s.posterUrl,
    type: "SERIES" as const,
    description: s.description,
  }));

  return <MediaSection title="Trending Series" items={items} />;
}
