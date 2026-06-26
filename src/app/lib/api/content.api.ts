import api from "../axios";

export interface EpisodeData {
  id: string;
  title: string;
  episodeNumber: number;
  videoUrl?: string | null;
  thumbnailUrl?: string | null;
  description?: string | null;
  duration?: number | null;
}

export interface SeasonData {
  id: string;
  seasonNumber: number;
  episodes?: EpisodeData[];
}

export interface ContentData {
  id: string;
  title: string;
  description?: string;
  bannerUrl?: string;
  posterUrl?: string;
  type: "MOVIE" | "SERIES";
  genre?: string[];
  ageRating?: string;
  releaseYear?: number;
  language?: string[];
  tags?: string[];
  movie?: {
    videoUrl?: string | null;
    duration?: number | null;
  } | null;
  series?: {
    seasons?: SeasonData[];
  } | null;
}

export interface ContentResponse {
  success: boolean;
  data: ContentData;
}

export async function getContentById(id: string): Promise<ContentResponse> {
  const { data } = await api.get(`/content/${id}`);
  return data;
}
