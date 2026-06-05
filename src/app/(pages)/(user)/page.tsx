import { HeroCarousel } from "@/components/home/hero-carousel";

const movies = [
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

export default function HomePage() {
  return (
    <div className="container mx-auto py-6">
      {/* <HeroCarousel items={movies} limit={5} /> */}
    </div>
  );
}
