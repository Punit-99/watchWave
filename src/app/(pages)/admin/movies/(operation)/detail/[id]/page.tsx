"use client";

import Image from "next/image";
import { useParams } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { useGetMovieById } from "@/hooks/use-movie";

export default function MovieDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { data, isLoading, isError } = useGetMovieById(id);

  const movie = data?.data;

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-4">
        <Skeleton className="h-[350px] w-full rounded-2xl" />
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto p-6 text-sm text-destructive">
        Failed to load movie.
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="container mx-auto p-6 text-sm">Movie not found.</div>
    );
  }

  return (
    <div className="container mx-auto space-y-10 p-6 pb-12">
      {/* ================= HERO ================= */}
      <div className="relative h-[420px] w-full overflow-hidden rounded-2xl border">
        <Image
          src={movie.bannerUrl || ""}
          alt={movie.title}
          fill
          className="object-cover"
        />

        {/* cinematic overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* poster + info */}
        <div className="absolute bottom-0 flex gap-6 p-6 text-white">
          {/* POSTER */}
          <div className="relative h-[240px] w-[160px] overflow-hidden rounded-xl border border-white/20 shadow-xl">
            <Image
              src={movie.posterUrl || ""}
              alt={movie.title}
              fill
              className="object-cover"
            />
          </div>

          {/* INFO */}
          <div className="flex flex-col justify-end">
            <h1 className="text-4xl font-bold leading-tight">{movie.title}</h1>

            <div className="mt-3 flex flex-wrap gap-2">
              {movie.genre?.map((genre: string) => (
                <Badge
                  key={genre}
                  className="bg-white/10 text-white border-white/20"
                >
                  {genre}
                </Badge>
              ))}
            </div>

            <p className="mt-3 max-w-2xl text-sm text-white/80 line-clamp-3">
              {movie.description}
            </p>
          </div>
        </div>
      </div>

      {/* ================= DETAILS GRID ================= */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Description */}
        <Card className="lg:col-span-2 border-muted/50">
          <CardContent className="p-6">
            <h2 className="mb-4 text-lg font-semibold">About</h2>

            <p className="leading-7 text-muted-foreground">
              {movie.description}
            </p>
          </CardContent>
        </Card>

        {/* Meta */}
        <Card className="border-muted/50">
          <CardContent className="space-y-5 p-6">
            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">Release Year</p>
              <p className="font-semibold">{movie.releaseYear}</p>
            </div>

            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">Type</p>
              <p className="font-semibold">{movie.type}</p>
            </div>

            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground mb-2">Age Rating</p>
              <Badge variant="secondary">{movie.ageRating}</Badge>
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-2">Languages</p>

              <div className="flex flex-wrap gap-2">
                {movie.language?.map((lang: string) => (
                  <Badge key={lang} variant="outline">
                    {lang}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ================= TAGS ================= */}
      <Card className="border-muted/50">
        <CardContent className="p-6">
          <h2 className="mb-4 text-lg font-semibold">Tags</h2>

          <div className="flex flex-wrap gap-2">
            {movie.tags?.map((tag: string) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
