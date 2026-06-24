"use client";

import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function Page() {
  const media = {
    id: "1",
    title: "Movie Title",
    description: "Movie description goes here.",
    bannerUrl: null,
    posterUrl: null,
    releaseYear: 2025,
    ageRating: "PG-13",
    type: "Movie",
    genre: ["Action", "Adventure"],
    language: ["English"],
    tags: ["Popular", "Trending"],
  };

  return (
    <div className="space-y-10">
      <div className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <Image
          src={media.bannerUrl || "/placeholder.jpg"}
          alt={media.title}
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

        <div className="absolute bottom-0 left-0 z-10 max-w-3xl p-8 md:p-12">
          <h1 className="text-5xl font-bold tracking-tight">
            {media.title}
          </h1>

          <div className="mt-4 flex flex-wrap gap-2">
            {media.genre?.map((genre) => (
              <Badge key={genre}>{genre}</Badge>
            ))}
          </div>

          <p className="mt-5 text-muted-foreground line-clamp-4 max-w-2xl">
            {media.description}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardContent className="p-6">
              <h2 className="mb-4 text-xl font-semibold">
                About this title
              </h2>

              <p className="leading-8 text-muted-foreground">
                {media.description}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-4 p-6">
              <MetaItem label="Release Year" value={media.releaseYear} />
              <MetaItem label="Type" value={media.type} />
              <MetaItem label="Age Rating" value={media.ageRating} />

              <div>
                <p className="mb-2 text-xs text-muted-foreground">
                  Languages
                </p>

                <div className="flex flex-wrap gap-2">
                  {media.language?.map((lang) => (
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
                {media.tags.map((tag) => (
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