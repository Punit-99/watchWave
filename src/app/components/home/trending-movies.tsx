import { movies } from "@/lib/mock-data";
import { MediaSection } from "../movies/media-section";

export function TrendingMovies() {
  return <MediaSection title="Trending Movies" items={movies} />;
}
