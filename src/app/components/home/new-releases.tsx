import { movies } from "@/lib/mock-data";
import { MediaSection } from "../movies/media-section";

export function NewReleases() {
  return <MediaSection title="New Releases" items={movies} />;
}
