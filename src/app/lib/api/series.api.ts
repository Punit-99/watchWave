import api from "@/lib/axios";
import type {
  CreateSeriesInput,
  UpdateSeriesInput,
  GetSeriesResponse,
  Series,
} from "@/validation/series.validation";

export async function createSeries(data: CreateSeriesInput) {
  const res = await api.post("/series", data);
  return res.data;
}

export async function getAllSeries(
  page = 1,
  limit = 10,
): Promise<GetSeriesResponse> {
  const res = await api.get(`/series?page=${page}&limit=${limit}`);

  return res.data;
}

export async function getSeriesById(id: string): Promise<{
  success: boolean;
  data: Series;
}> {
  console.log("Fetching series with ID:", id); // Debug log to verify ID being fetched
  const res = await api.get(`/series/${id}`);
  console.log("API response for getSeriesById:", res.data); // Debug log to verify API response structure
  return res.data;
}

export async function deleteSeries(id: string) {
  const res = await api.delete(`/series/${id}`);

  return res.data;
}

export async function updateSeries(id: string, data: UpdateSeriesInput) {
  const res = await api.patch(`/series/${id}`, data);

  return res.data;
}
