"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams, useRouter } from "next/navigation";

import { useGetSeriesById, useUpdateSeries } from "@/hooks/use-series";
import { SeriesForm } from "@/components/series/SeriesForm";
import { Genre, Language, AgeRating } from "@/../../generated/prisma/enums";

export default function SeriesEditPage() {
  const { id } = useParams();
  const router = useRouter();

  const { data, isLoading } = useGetSeriesById(id as string);
  const { mutate, isPending } = useUpdateSeries();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data?.data) {
    return <div>Series not found</div>;
  }

  const series = data.data;
  const fullSeries = series.series;

  return (
    <div className="mx-auto max-w-4xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Edit Series</CardTitle>
        </CardHeader>

        <CardContent>
          <SeriesForm
            mode="edit"
            isPending={isPending}
            initialData={{
              title: series.title,
              description: series.description,
              posterUrl: series.posterUrl,
              bannerUrl: series.bannerUrl,
              releaseYear: series.releaseYear,
              language: series.language as Language[],
              genre: series.genre as Genre[],
              tags: series.tags,
              ageRating: series.ageRating as AgeRating,
              seasons: fullSeries?.seasons ?? [],
            }}
            onSubmit={(values) => {
              mutate(
                {
                  id: id as string,
                  data: values,
                },
                {
                  onSuccess: () => {
                    router.push("/admin/series");
                  },
                },
              );
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
