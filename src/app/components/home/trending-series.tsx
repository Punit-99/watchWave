import { movies } from "@/lib/mock-data";
import { MediaSection } from "../movies/media-section";

export function TrendingSeries() {
  return <MediaSection title="Trending Series" items={movies} />;
}
