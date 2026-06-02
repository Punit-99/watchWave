"use client";

import Image from "next/image";
import { useParams } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { useMovie } from "@/hooks/use-movie";

export default function MovieDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { data, isLoading, isError } = useMovie(id);

  const movie = data?.data;

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-4">
        <Skeleton className="h-[300px] w-full rounded-xl" />
        <Skeleton className="h-10 w-60" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (isError) {
    return <div className="container mx-auto p-6">Failed to load movie.</div>;
  }

  if (!movie) {
    return <div className="container mx-auto p-6">Movie not found.</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Banner */}
      <div className="relative h-[400px] overflow-hidden rounded-2xl">
        <Image
          src={movie.bannerUrl}
          alt={movie.title}
          fill
          className="object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

        <div className="absolute bottom-8 left-8 flex gap-6">
          <div className="relative h-56 w-40 overflow-hidden rounded-xl border">
            <Image
              src={movie.thumbnailUrl}
              alt={movie.title}
              fill
              className="object-cover"
            />
          </div>

          <div className="flex flex-col justify-end">
            <h1 className="text-4xl font-bold">{movie.title}</h1>

            <div className="mt-3 flex flex-wrap gap-2">
              {movie.genre?.map((genre: string) => (
                <Badge key={genre}>{genre}</Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <h2 className="mb-4 text-xl font-semibold">Description</h2>

            <p className="leading-7 text-muted-foreground">
              {movie.description}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-4 p-6">
            <div>
              <p className="text-sm text-muted-foreground">Release Year</p>
              <p className="font-semibold">{movie.releaseYear}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Type</p>
              <p className="font-semibold">{movie.type}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Age Rating</p>
              <Badge variant="secondary">{movie.ageRating}</Badge>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">Languages</p>

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

      {/* Tags */}
      <Card>
        <CardContent className="p-6">
          <h2 className="mb-4 text-xl font-semibold">Tags</h2>

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
