"use client";

export interface MediaDetailData {
  id: string;
  title: string;
  description: string;

  bannerUrl?: string | null;
  posterUrl?: string | null;

  releaseYear?: number;
  ageRating?: string;
  type?: string;

  genre?: string[];
  language?: string[];
  tags?: string[];
}

import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface MediaDetailProps {
  media: {
    title: string;
    description: string;

    bannerUrl?: string | null;
    posterUrl?: string | null;

    releaseYear?: number;
    ageRating?: string;
    type?: string;

    genre?: string[];
    language?: string[];
    tags?: string[];
  };
}

export function MediaDetail({ media }: MediaDetailProps) {
  return (
    <div className="space-y-10">
      {/* HERO */}
      <div className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <Image
          src={media.bannerUrl || ""}
          alt={media.title}
          fill
          priority
          className="object-cover"
        />

        {/* Netflix Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

        <div className="absolute bottom-0 left-0 z-10 max-w-3xl p-8 md:p-12">
          <h1 className="text-5xl font-bold tracking-tight">{media.title}</h1>

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

      {/* CONTENT */}
      <div className="container mx-auto px-4">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* ABOUT */}
          <Card className="lg:col-span-2">
            <CardContent className="p-6">
              <h2 className="mb-4 text-xl font-semibold">About this title</h2>

              <p className="leading-8 text-muted-foreground">
                {media.description}
              </p>
            </CardContent>
          </Card>

          {/* META */}
          <Card>
            <CardContent className="space-y-4 p-6">
              <MetaItem label="Release Year" value={media.releaseYear} />

              <MetaItem label="Type" value={media.type} />

              <MetaItem label="Age Rating" value={media.ageRating} />

              <div>
                <p className="mb-2 text-xs text-muted-foreground">Languages</p>

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

        {/* TAGS */}
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
