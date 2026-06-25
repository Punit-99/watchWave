import api from "../axios";

export async function getProgress(): Promise<any> {
  const { data } = await api.get("/progress");
  return data;
}

export async function saveProgress(body: {
  contentId: string;
  episodeId?: string;
  watchedTime: number;
  duration: number;
}): Promise<any> {
  const { data } = await api.post("/progress", body);
  return data;
}

export async function deleteProgress(contentId: string): Promise<any> {
  const { data } = await api.delete(`/progress?contentId=${contentId}`);
  return data;
}
