import { NewReleases } from "@/components/home/new-releases";
import { TrendingMovies } from "@/components/home/trending-movies";
import { TrendingSeries } from "@/components/home/trending-series";
import { ContinueWatching } from "@/components/home/continue-watching";
import { Footer } from "@/components/home/footer";
import { HeroCarousel } from "@/components/home/hero-carousel";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <HeroCarousel items={[]} />

      <NewReleases />
      <ContinueWatching />

      <TrendingMovies />

      <TrendingSeries />

      <Footer />
    </div>
  );
}
