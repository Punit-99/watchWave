"use client";

import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Link from "next/link";
import { Button } from "../ui/button";
import Autoplay from "embla-carousel-autoplay";
import { useGetAllMovies } from "@/hooks/use-movie";
import { useGetAllSeries } from "@/hooks/use-series";
import { Badge } from "@/components/ui/badge";

type HeroCarouselProps = {
  items?: HeroCarouselItem[];
  limit?: number;
};

export type HeroCarouselItem = {
  id: string;
  title: string;
  description?: string;
  backdrop: string;
  type?: "MOVIE" | "SERIES";
};

export function HeroCarousel({ items = [], limit = 5 }: HeroCarouselProps) {
  const { data: moviesData, isLoading: moviesLoading } = useGetAllMovies(1, limit);
  const { data: seriesData, isLoading: seriesLoading } = useGetAllSeries(1, limit);

  const movieItems = (moviesData?.data || []).map((m) => ({
    id: m.id,
    title: m.title,
    description: m.description,
    backdrop: m.bannerUrl || "/placeholder.jpg",
    createdAt: m.createdAt,
    type: "MOVIE" as const,
  }));

  const seriesItems = (seriesData?.data || []).map((s) => ({
    id: s.id,
    title: s.title,
    description: s.description,
    backdrop: s.bannerUrl || "/placeholder.jpg",
    createdAt: s.createdAt,
    type: "SERIES" as const,
  }));

  // Combine and sort by createdAt desc
  const combinedSlides = [...movieItems, ...seriesItems]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);

  const slides = items.length > 0 ? items.slice(0, limit) : combinedSlides;
  const isLoading = moviesLoading || seriesLoading;

  if (slides.length === 0) {
    if (isLoading) {
      return (
        <div className="h-[450px] md:h-[600px] w-full bg-muted rounded-3xl animate-pulse flex items-center justify-center text-muted-foreground">
          Loading carousel...
        </div>
      );
    }
    return null;
  }

  return (
    <Carousel
      opts={{
        loop: true,
      }}
      plugins={[
        Autoplay({
          delay: 5000,
        }),
      ]}
      className="w-full"
    >
      <CarouselContent>
        {slides.map((item) => (
          <CarouselItem key={item.id}>
            <div className="relative h-[450px] overflow-hidden rounded-3xl md:h-[600px]">
              <Image
                src={item.backdrop}
                alt={item.title}
                fill
                priority
                className="object-cover"
                unoptimized
              />

              {/* overlays */}
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

              {/* Badges on Top-Left */}
              {item.type && (
                <div className="absolute left-8 top-8 z-10 flex gap-2 md:left-14 md:top-14">
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/25 font-bold text-[10px] py-0.5 px-2 tracking-wider rounded">
                    W ORIGINAL
                  </Badge>
                  <Badge variant="secondary" className="bg-zinc-800/80 text-zinc-100 border border-zinc-700/50 hover:bg-zinc-800/80 font-bold text-[10px] py-0.5 px-2 tracking-wider rounded">
                    {item.type === "MOVIE" ? "MOVIE" : "TV SHOW"}
                  </Badge>
                </div>
              )}

              {/* content */}
              <div className="absolute bottom-12 left-8 max-w-xl md:left-14">
                <h1 className="text-4xl font-bold text-white md:text-6xl">
                  {item.title}
                </h1>

                {item.description && (
                  <p className="mt-4 line-clamp-3 text-sm text-zinc-300 md:text-base">
                    {item.description}
                  </p>
                )}

                <div className="mt-6">
                  <Button variant="secondary" size="lg" asChild className="cursor-pointer">
                    <Link href={`/details/${item.id}`}>Details</Link>
                  </Button>
                </div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselPrevious className="left-5 h-12 w-12 border-2 border-white/40 bg-black/50 text-white hover:bg-white hover:text-black hover:scale-110 active:scale-95 transition-all duration-300 shadow-md" />
      <CarouselNext className="right-5 h-12 w-12 border-2 border-white/40 bg-black/50 text-white hover:bg-white hover:text-black hover:scale-110 active:scale-95 transition-all duration-300 shadow-md" />
    </Carousel>
  );
}
