"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";

type MediaCardProps = {
  title: string;
  image: string;
};

export function MediaCard({ title, image }: MediaCardProps) {
  return (
    <Card className="group overflow-hidden p-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[2/3] overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="p-3">
        <h3 className="truncate text-sm font-medium">{title}</h3>
      </div>
    </Card>
  );
}
