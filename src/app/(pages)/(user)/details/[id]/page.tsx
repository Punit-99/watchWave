"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Play } from "lucide-react";
import { VideoPlayer } from "@/components/watch/video-player";
import { useGetContentById } from "@/hooks/use-content";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGetProgress } from "@/hooks/use-progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function ContentDetailPage() {
  const { id } = useParams();
  const { data, isLoading, error } = useGetContentById(id as string);
  const { data: progressData } = useGetProgress();

  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);
  const [activeVideoTitle, setActiveVideoTitle] = useState<string>("");
  const [activeEpisodeId, setActiveEpisodeId] = useState<string | null>(null);

  const playNextEpisode = () => {
    if (!data?.success || data?.data?.type !== "SERIES" || !activeEpisodeId)
      return;
    const seasons = data.data.series?.seasons ?? [];
    const flatEpisodes = seasons.flatMap((s: any) =>
      (s.episodes ?? []).map((ep: any) => ({
        ...ep,
        seasonNumber: s.seasonNumber,
      })),
    );
    const currentIndex = flatEpisodes.findIndex(
      (ep: any) => ep.id === activeEpisodeId,
    );
    if (currentIndex !== -1 && currentIndex + 1 < flatEpisodes.length) {
      const nextEp = flatEpisodes[currentIndex + 1];
      setActiveVideoUrl(nextEp.videoUrl || "");
      setActiveVideoTitle(
        `${data.data.title} - S${nextEp.seasonNumber} E${nextEp.episodeNumber}: ${nextEp.title}`,
      );
      setActiveEpisodeId(nextEp.id);
    } else {
      setActiveVideoUrl(null);
      setActiveVideoTitle("");
      setActiveEpisodeId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground animate-pulse">
        Loading Entertainment...
      </div>
    );
  }

  if (error || !data?.success || !data?.data) {
    return (
      <div className="flex min-h-screen items-center justify-center text-destructive font-medium">
        Failed to load details.
      </div>
    );
  }

  const media = data.data;
  const progressList = progressData?.data || [];
  const contentProgress = progressList.find(
    (p: any) => p.contentId === media.id,
  );

  if (media.type === "MOVIE") {
    return (
      <div className="space-y-10 pb-10">
        {/* Hero Banner Section */}
        <div className="relative h-[450px] md:h-[600px] overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
          <Image
            src={media.bannerUrl || "/placeholder.jpg"}
            alt={media.title}
            fill
            priority
            className="object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

          {/* Badges on Top-Left */}
          <div className="absolute left-6 top-6 z-10 flex gap-2 md:left-12 md:top-12">
            <Badge
              variant="outline"
              className="bg-primary/10 text-primary border-primary/25 font-bold text-[10px] py-0.5 px-2 tracking-wider rounded animate-fade-in"
            >
              W ORIGINAL
            </Badge>
            <Badge
              variant="secondary"
              className="bg-zinc-800/80 text-zinc-100 border border-zinc-700/50 hover:bg-zinc-800/80 font-bold text-[10px] py-0.5 px-2 tracking-wider rounded"
            >
              MOVIE
            </Badge>
          </div>

          <div className="absolute inset-0 z-10 flex items-end p-5 md:p-12 bg-gradient-to-t from-background via-background/60 to-transparent bg-gradient-to-r from-black/90 via-black/40 to-transparent">
            <div className="flex items-end gap-4 md:gap-8 w-full">
              {/* Rectangular Poster Image on the left */}
              {media.posterUrl && (
                <div className="relative shrink-0 w-[90px] sm:w-[140px] md:w-[180px] aspect-[2/3] overflow-hidden rounded-xl border border-white/10 shadow-2xl">
                  <Image
                    src={media.posterUrl}
                    alt={`${media.title} Poster`}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-w-640px) 90px, (max-w-768px) 140px, 180px"
                  />
                </div>
              )}

              {/* Title, description, badges, button on the right */}
              <div className="flex-1 min-w-0 space-y-2 md:space-y-4 text-left">
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow truncate">
                  {media.title}
                </h1>

                <div className="flex flex-wrap items-center gap-1.5 md:gap-2">
                  {media.genre?.map((genre: string) => (
                    <Badge
                      key={genre}
                      variant="secondary"
                      className="bg-white/15 hover:bg-white/20 text-white backdrop-blur-sm border-none text-[10px] md:text-xs"
                    >
                      {genre}
                    </Badge>
                  ))}
                </div>

                <p className="text-zinc-300 line-clamp-2 sm:line-clamp-3 md:line-clamp-4 max-w-2xl text-[11px] sm:text-xs md:text-sm leading-relaxed drop-shadow-sm">
                  {media.description}
                </p>

                <div className="pt-1 md:pt-2">
                  <Button
                    size="sm"
                    className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold cursor-pointer px-4 md:px-8 md:py-6 md:text-base shadow-lg shadow-primary/20"
                    onClick={() => {
                      setActiveVideoUrl(media.movie?.videoUrl || "");
                      setActiveVideoTitle(media.title);
                    }}
                  >
                    ▶ Watch Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="mt-8">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardContent className="p-6">
                <h2 className="mb-4 text-xl font-semibold">About this title</h2>
                <p className="leading-8 text-muted-foreground">
                  {media.description}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="space-y-4 p-6">
                <MetaItem label="Release Year" value={media.releaseYear} />
                <MetaItem label="Type" value="Movie" />
                <MetaItem label="Age Rating" value={media.ageRating} />
                <MetaItem
                  label="Duration"
                  value={`${media.movie?.duration} minutes`}
                />

                <div>
                  <p className="mb-2 text-xs text-muted-foreground">
                    Languages
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {media.language?.map((lang: string) => (
                      <Badge key={lang} variant="outline">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {media.tags?.length ? (
            <Card className="mt-6">
              <CardContent className="p-6">
                <h2 className="mb-4 text-xl font-semibold">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {media.tags.map((tag: string) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : null}
        </div>

        {/* Fullscreen Video Player Overlay */}
        {activeVideoUrl && (
          <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setActiveVideoUrl(null);
                setActiveVideoTitle("");
                setActiveEpisodeId(null);
              }}
              className="absolute top-6 left-6 z-50 text-white bg-black/40 hover:bg-white/20 rounded-full h-12 w-12 cursor-pointer shadow-md"
              title="Back to Details"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <div className="w-full h-full relative">
              <VideoPlayer
                key={activeVideoUrl}
                src={activeVideoUrl}
                title={activeVideoTitle}
                contentId={media.id}
                contentType="MOVIE"
                image={media.bannerUrl || media.posterUrl || ""}
                description={media.description || ""}
                startTime={contentProgress?.watchedTime ?? 0}
                onEnded={() => {
                  setActiveVideoUrl(null);
                  setActiveVideoTitle("");
                  setActiveEpisodeId(null);
                }}
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  // Else render SERIES layout
  const seriesRoot = media.series;
  const seasons = seriesRoot?.seasons ?? [];

  return (
    <div className="space-y-10 pb-10">
      {/* Hero Banner Section */}
      <div className="relative h-[450px] md:h-[600px] overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
        <Image
          src={media.bannerUrl || "/placeholder.jpg"}
          alt={media.title}
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

        {/* Badges on Top-Left */}
        <div className="absolute left-6 top-6 z-10 flex gap-2 md:left-12 md:top-12">
          <Badge
            variant="outline"
            className="bg-primary/10 text-primary border-primary/25 font-bold text-[10px] py-0.5 px-2 tracking-wider rounded animate-fade-in"
          >
            W ORIGINAL
          </Badge>
          <Badge
            variant="secondary"
            className="bg-zinc-800/80 text-zinc-100 border border-zinc-700/50 hover:bg-zinc-800/80 font-bold text-[10px] py-0.5 px-2 tracking-wider rounded"
          >
            TV SHOW
          </Badge>
        </div>

        <div className="absolute inset-0 z-10 flex items-end p-5 md:p-12 bg-gradient-to-t from-background via-background/60 to-transparent bg-gradient-to-r from-black/90 via-black/40 to-transparent">
          <div className="flex items-end gap-4 md:gap-8 w-full">
            {/* Rectangular Poster Image on the left */}
            {media.posterUrl && (
              <div className="relative shrink-0 w-[90px] sm:w-[140px] md:w-[180px] aspect-[2/3] overflow-hidden rounded-xl border border-white/10 shadow-2xl">
                <Image
                  src={media.posterUrl}
                  alt={`${media.title} Poster`}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-w-640px) 90px, (max-w-768px) 140px, 180px"
                />
              </div>
            )}

            {/* Title, description, badges on the right */}
            <div className="flex-1 min-w-0 space-y-2 md:space-y-4 text-left">
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow truncate">
                {media.title}
              </h1>

              <div className="flex flex-wrap items-center gap-1.5 md:gap-2">
                {media.genre?.map((genre: string) => (
                  <Badge
                    key={genre}
                    variant="secondary"
                    className="bg-white/15 hover:bg-white/20 text-white backdrop-blur-sm border-none text-[10px] md:text-xs"
                  >
                    {genre}
                  </Badge>
                ))}
              </div>

              <p className="text-zinc-300 line-clamp-2 sm:line-clamp-3 md:line-clamp-4 max-w-2xl text-[11px] sm:text-xs md:text-sm leading-relaxed drop-shadow-sm">
                {media.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="mt-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="mb-4 text-xl font-semibold">About this title</h2>
                <p className="leading-8 text-muted-foreground">
                  {media.description}
                </p>
              </CardContent>
            </Card>

            {/* SEASONS & EPISODES */}
            <Card>
              <CardContent className="p-6">
                <h2 className="mb-4 text-xl font-semibold">
                  Seasons & Episodes
                </h2>
                {seasons.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No seasons available
                  </p>
                ) : (
                  <Accordion type="single" collapsible className="space-y-2">
                    {seasons.map((season: any) => (
                      <AccordionItem
                        key={season.id}
                        value={season.id}
                        className="border rounded-xl px-4"
                      >
                        <AccordionTrigger className="hover:no-underline font-medium py-4">
                          Season {season.seasonNumber}
                        </AccordionTrigger>

                        <AccordionContent className="pb-4 pt-2">
                          <div className="space-y-3">
                            {season.episodes?.map((ep: any) => (
                              <div
                                key={ep.id}
                                onClick={() => {
                                  setActiveVideoUrl(ep.videoUrl || "");
                                  setActiveVideoTitle(
                                    `${media.title} - S${season.seasonNumber} E${ep.episodeNumber}: ${ep.title}`,
                                  );
                                  setActiveEpisodeId(ep.id);
                                }}
                                className="group flex gap-4 rounded-lg border p-3 hover:bg-muted/40 transition cursor-pointer"
                              >
                                <div className="relative h-16 w-28 shrink-0 overflow-hidden rounded-md border bg-black">
                                  {ep.thumbnailUrl ? (
                                    <Image
                                      src={ep.thumbnailUrl}
                                      alt={ep.title}
                                      fill
                                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                  ) : (
                                    <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                                      No Image
                                    </div>
                                  )}

                                  {/* Play Icon Hover Overlay */}
                                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <Play className="h-5 w-5 text-white fill-current" />
                                  </div>
                                </div>

                                <div className="flex flex-1 flex-col justify-center min-w-0">
                                  <p className="font-semibold text-sm truncate text-white group-hover:text-primary transition-colors">
                                    E{ep.episodeNumber}. {ep.title}
                                  </p>

                                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                                    {ep.description}
                                  </p>

                                  <p className="text-xs text-muted-foreground mt-1">
                                    {ep.duration} min
                                  </p>
                                </div>

                                <div className="flex items-center justify-center pr-2">
                                  <div className="rounded-full bg-zinc-800 p-2 text-zinc-400 group-hover:bg-primary group-hover:text-primary-foreground transition duration-300 shadow-sm">
                                    <Play className="h-4 w-4 fill-current" />
                                  </div>
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

          <div className="space-y-6">
            <Card>
              <CardContent className="space-y-4 p-6">
                <MetaItem label="Release Year" value={media.releaseYear} />
                <MetaItem label="Type" value="Series" />
                <MetaItem label="Age Rating" value={media.ageRating} />
                <MetaItem label="Total Seasons" value={seasons.length} />

                <div>
                  <p className="mb-2 text-xs text-muted-foreground">
                    Languages
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {media.language?.map((lang: string) => (
                      <Badge key={lang} variant="outline">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {media.tags?.length ? (
              <Card>
                <CardContent className="p-6">
                  <h2 className="mb-4 text-xl font-semibold">Tags</h2>
                  <div className="flex flex-wrap gap-2">
                    {media.tags.map((tag: string) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : null}
          </div>
        </div>
      </div>

      {/* Fullscreen Video Player Overlay */}
      {activeVideoUrl && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setActiveVideoUrl(null);
              setActiveVideoTitle("");
              setActiveEpisodeId(null);
            }}
            className="absolute top-6 left-6 z-50 text-white bg-black/40 hover:bg-white/20 rounded-full h-12 w-12 cursor-pointer shadow-md"
            title="Back to Details"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div className="w-full h-full relative">
            <VideoPlayer
              key={activeVideoUrl}
              src={activeVideoUrl}
              title={activeVideoTitle}
              contentId={media.id}
              contentType="SERIES"
              image={media.bannerUrl || media.posterUrl || ""}
              description={media.description || ""}
              episodeId={activeEpisodeId || undefined}
              episodeNumber={
                seasons
                  .flatMap((s: any) =>
                    (s.episodes || []).map((e: any) => ({
                      id: e.id,
                      episodeNumber: e.episodeNumber,
                      seasonNumber: s.seasonNumber,
                      title: e.title,
                    })),
                  )
                  .find((e: any) => e.id === activeEpisodeId)?.episodeNumber
              }
              seasonNumber={
                seasons
                  .flatMap((s: any) =>
                    (s.episodes || []).map((e: any) => ({
                      id: e.id,
                      episodeNumber: e.episodeNumber,
                      seasonNumber: s.seasonNumber,
                      title: e.title,
                    })),
                  )
                  .find((e: any) => e.id === activeEpisodeId)?.seasonNumber
              }
              episodeTitle={
                seasons
                  .flatMap((s: any) =>
                    (s.episodes || []).map((e: any) => ({
                      id: e.id,
                      episodeNumber: e.episodeNumber,
                      seasonNumber: s.seasonNumber,
                      title: e.title,
                    })),
                  )
                  .find((e: any) => e.id === activeEpisodeId)?.title
              }
              startTime={
                contentProgress?.episodeId === activeEpisodeId
                  ? (contentProgress?.watchedTime ?? 0)
                  : 0
              }
              onEnded={playNextEpisode}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function MetaItem({
  label,
  value,
}: {
  label: string;
  value?: string | number;
}) {
  if (!value) return null;

  return (
    <div className="rounded-lg border p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}
