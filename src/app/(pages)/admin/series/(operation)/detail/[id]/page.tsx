"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useGetSeriesById } from "@/hooks/use-series";

import { Card, CardContent } from "@/components/ui/card";
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
    return (
      <div className="rounded-xl border p-6 text-sm text-muted-foreground">
        Loading series...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border p-6 text-sm text-destructive">
        Failed to load series
      </div>
    );
  }

  const series = data?.data;
  if (!series) {
    return (
      <div className="rounded-xl border p-6 text-sm">Series not found</div>
    );
  }

  const seriesRoot = series.series?.[0];
  const seasons = seriesRoot?.seasons ?? [];

  return (
    <div className="space-y-10 pb-10">
      {/* ================= HERO ================= */}
      <div className="relative h-[360px] w-full overflow-hidden rounded-2xl border">
        <Image
          src={series.bannerUrl || ""}
          alt={series.title}
          fill
          className="object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* ================= POSTER + INFO ================= */}
        <div className="absolute bottom-0 flex gap-6 p-6 text-white">
          {/* POSTER */}
          <div className="h-[220px] w-[150px] shrink-0 overflow-hidden rounded-xl border border-white/20 shadow-xl">
            <Image
              src={series.posterUrl || series.thumbnailUrl || ""}
              alt={series.title}
              width={150}
              height={220}
              className="h-full w-full object-cover"
            />
          </div>

          {/* INFO */}
          <div className="flex flex-col justify-end">
            <h1 className="text-3xl font-bold">{series.title}</h1>

            <p className="mt-2 max-w-2xl text-sm text-white/80 line-clamp-3">
              {series.description}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {series.genre?.map((g) => (
                <Badge
                  key={g}
                  className="bg-white/10 text-white border-white/20"
                >
                  {g}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ================= DETAILS ================= */}
      <Card>
        <CardContent className="space-y-5 pt-6">
          <div>
            <p className="text-xs text-muted-foreground mb-2">Languages</p>
            <div className="flex flex-wrap gap-2">
              {series.language?.map((l) => (
                <Badge key={l} variant="secondary">
                  {l}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">Release Year</p>
              <p className="font-medium">{series.releaseYear}</p>
            </div>

            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">Age Rating</p>
              <p className="font-medium">{series.ageRating}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ================= SEASONS ================= */}
      <Card>
        <CardContent className="pt-6">
          {seasons.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No seasons available
            </p>
          ) : (
            <Accordion type="single" collapsible className="space-y-2">
              {seasons.map((season) => (
                <AccordionItem
                  key={season.id}
                  value={season.id}
                  className="border rounded-xl px-3"
                >
                  <AccordionTrigger>
                    Season {season.seasonNumber}
                  </AccordionTrigger>

                  <AccordionContent>
                    <div className="space-y-3">
                      {season.episodes?.map((ep) => (
                        <div
                          key={ep.id}
                          className="flex gap-4 rounded-lg border p-3 hover:bg-muted/40 transition"
                        >
                          <div className="h-16 w-28 overflow-hidden rounded-md border">
                            {ep.thumbnailUrl ? (
                              <Image
                                src={ep.thumbnailUrl}
                                alt={ep.title}
                                width={120}
                                height={70}
                                className="object-cover"
                              />
                            ) : (
                              <video
                                src={ep.videoUrl}
                                className="h-full w-full object-cover"
                              />
                            )}
                          </div>

                          <div className="flex flex-1 flex-col justify-center">
                            <p className="font-medium">
                              E{ep.episodeNumber}. {ep.title}
                            </p>

                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {ep.description}
                            </p>

                            <p className="text-xs text-muted-foreground">
                              {ep.duration} min
                            </p>
                          </div>
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
