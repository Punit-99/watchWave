import { movies } from "@/lib/mock-data";
import { MediaSection } from "../movies/media-section";

export function ContinueWatching() {
  return <MediaSection title="Continue Watching" items={movies} />;
}
