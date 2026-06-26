"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";

import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

type MediaCardProps = {
  id: string;
  title: string;
  image: string;
  type: "MOVIE" | "SERIES";
  description?: string;
  progress?: {
    watchedTime: number;
    duration: number;
  };
  onRemoveProgress?: (e: React.MouseEvent) => void;
};

const trimText = (text?: string, maxLength: number = 80) => {
  if (!text) return "";
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

export function MediaCard({
  id,
  title,
  image,
  type,
  description,
  progress,
  onRemoveProgress,
}: MediaCardProps) {
  const href = `/details/${id}`;

  return (
    <div className="relative group/card">
      <Link href={href} className="block">
        <Card className="group overflow-hidden p-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border-zinc-800 bg-zinc-950">
          <div className="relative aspect-video overflow-hidden">
            <div className="absolute left-2.5 top-2.5 z-10 flex gap-1">
              <Badge className="bg-primary hover:bg-primary text-primary-foreground font-extrabold text-[8px] tracking-wider px-1 py-0.5 rounded-sm">
                W
              </Badge>
              <Badge className="bg-black/60 text-zinc-100 border border-white/10 hover:bg-black/60 backdrop-blur-md font-bold text-[8px] uppercase tracking-wider rounded-sm">
                {type === "MOVIE" ? "Movie" : "Show"}
              </Badge>
            </div>
            <Image
              src={image || "/placeholder.jpg"}
              alt={title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              unoptimized
            />

            {progress && progress.duration > 0 && (
              <div className="absolute bottom-0 left-0 w-full h-1 bg-zinc-800/80">
                <div
                  className="h-full bg-primary"
                  style={{
                    width: `${Math.min(100, (progress.watchedTime / progress.duration) * 100)}%`,
                  }}
                />
              </div>
            )}
          </div>

          <div className="p-3 space-y-1">
            <h3 className="truncate text-sm font-semibold text-white group-hover:text-primary transition-colors">
              {title}
            </h3>
            {description && (
              <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                {trimText(description, 75)}
              </p>
            )}
          </div>
        </Card>
      </Link>

      {onRemoveProgress && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemoveProgress(e);
          }}
          className="absolute right-2.5 top-2.5 z-20 flex h-6 w-6 items-center justify-center rounded-full bg-black/75 hover:bg-red-600 text-white border border-white/10 hover:border-red-600 opacity-0 group-hover/card:opacity-100 transition-all duration-300 shadow-md cursor-pointer"
          title="Remove from Continue Watching"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}
