import api from "../axios";

export interface ProgressData {
  id: string;
  contentId: string;
  watchedTime: number;
  duration: number;
  episodeId?: string | null;
  content?: {
    id: string;
    title: string;
    bannerUrl?: string | null;
    posterUrl?: string | null;
    type: "MOVIE" | "SERIES";
    description?: string;
  } | null;
}

export interface ProgressResponse {
  success: boolean;
  data: ProgressData[];
}

export async function getProgress(): Promise<ProgressResponse> {
  const { data } = await api.get("/progress");
  return data;
}

export async function saveProgress(body: {
  contentId: string;
  episodeId?: string;
  watchedTime: number;
  duration: number;
}): Promise<unknown> {
  const { data } = await api.post("/progress", body);
  return data;
}

export async function deleteProgress(contentId: string): Promise<unknown> {
  const { data } = await api.delete(`/progress?contentId=${contentId}`);
  return data;
}
