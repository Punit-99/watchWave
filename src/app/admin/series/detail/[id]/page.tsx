"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useGetSeriesById } from "@/hooks/use-series";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function SeriesDetail() {
  const params = useParams();
  const id = params.id as string;
  const { data, isLoading, error } = useGetSeriesById(id);

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

  // ✅ IMPORTANT FIX: always unwrap correctly
  const series = data?.data;

  if (!series) {
    return <div className="rounded-xl border p-6">Series not found</div>;
  }

  // ✅ safe seasons extraction
  const seasons = series.series?.[0]?.seasons ?? [];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="relative h-64 w-full overflow-hidden rounded-xl border">
        <Image
          src={series.bannerUrl}
          alt={series.title}
          fill
          className="object-cover"
        />
      </div>

      {/* Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{series.title}</CardTitle>
          <p className="text-muted-foreground">{series.description}</p>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {series.genre?.map((g) => (
              <Badge key={g}>{g}</Badge>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {series.language?.map((l) => (
              <Badge key={l} variant="secondary">
                {l}
              </Badge>
            ))}
          </div>

          <div className="text-sm text-muted-foreground">
            <p>Release Year: {series.releaseYear}</p>
            <p>Age Rating: {series.ageRating}</p>
          </div>
        </CardContent>
      </Card>

      {/* Seasons */}
      <Card>
        <CardHeader>
          <CardTitle>Seasons</CardTitle>
        </CardHeader>

        <CardContent>
          {seasons.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No seasons available
            </p>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              {seasons.map((season) => (
                <AccordionItem key={season.id} value={season.id}>
                  <AccordionTrigger>
                    Season {season.seasonNumber}
                  </AccordionTrigger>

                  <AccordionContent>
                    <div className="space-y-3">
                      {season.episodes?.map((ep) => (
                        <div
                          key={ep.id}
                          className="flex items-center justify-between rounded-md border p-3"
                        >
                          <div>
                            <p className="font-medium">
                              E{ep.episodeNumber}. {ep.title}
                            </p>

                            <p className="text-xs text-muted-foreground">
                              {ep.description}
                            </p>

                            <p className="text-xs text-muted-foreground">
                              {ep.duration} min
                            </p>
                          </div>

                          <video
                            src={ep.videoUrl}
                            controls
                            className="h-14 w-28 rounded-md"
                          />
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
