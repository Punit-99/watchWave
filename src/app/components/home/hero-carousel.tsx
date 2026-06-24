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

const slidecs = [
  {
    id: "1",
    title: "Interstellar",
    description: "A team of explorers travel through a wormhole in space.",
    backdrop: "https://images.unsplash.com/photo-1534447677768-be436bb09401",
  },
  {
    id: "2",
    title: "The Dark Knight",
    description: "Batman faces his greatest challenge.",
    backdrop: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
  },
  {
    id: "3",
    title: "Inception",
    description: "A thief who steals corporate secrets through dream-sharing.",
    backdrop: "https://images.unsplash.com/photo-1493246318656-5bfd4cfb29b8",
  },
];
type HeroCarouselProps = {
  items: HeroCarouselItem[];
  limit?: number;
};

export type HeroCarouselItem = {
  id: string;
  title: string;
  description?: string;
  backdrop: string;
};

export function HeroCarousel({ items = [], limit = 5 }: HeroCarouselProps) {
  const slides = slidecs.slice(0, limit);

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
        {slides.map((movie) => (
          <CarouselItem key={movie.id}>
            <div className="relative h-[450px] overflow-hidden rounded-3xl md:h-[600px]">
              <Image
                src={movie.backdrop}
                alt={movie.title}
                fill
                priority
                className="object-cover"
                unoptimized
              />

              {/* overlays */}
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />

              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

              {/* content */}
              <div className="absolute bottom-12 left-8 max-w-xl md:left-14">
                <h1 className="text-4xl font-bold text-white md:text-6xl">
                  {movie.title}
                </h1>

                {movie.description && (
                  <p className="mt-4 line-clamp-3 text-sm text-zinc-300 md:text-base">
                    {movie.description}
                  </p>
                )}

                <div className="mt-6 flex gap-3">
                  <Button size="lg">▶ Watch Now</Button>

                  <Button variant="secondary" size="lg" asChild>
                    <Link href={`/movies/details/${movie.id}`}>Details</Link>
                  </Button>
                </div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselPrevious className="left-5" />
      <CarouselNext className="right-5" />
    </Carousel>
  );
}
