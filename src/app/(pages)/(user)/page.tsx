import { NewReleases } from "@/components/home/new-releases";
import { TrendingMovies } from "@/components/home/trending-movies";
import { TrendingSeries } from "@/components/home/trending-series";
import { ContinueWatching } from "@/components/home/continue-watching";
import { Footer } from "@/components/home/footer";
import { HeroCarousel } from "@/components/home/hero-carousel";

export default function HomePage() {
  return (
    <main className="container mx-auto px-4 py-6">
      <HeroCarousel items={[]} />

      <NewReleases />
      <ContinueWatching />

      <TrendingMovies />

      <TrendingSeries />

      <Footer />
    </main>
  );
}
