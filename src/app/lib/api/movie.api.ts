import api from "../axios";

import {
  GetMoviesResponseSchema,
  type CreateMovieInput,
  type GetMoviesResponse,
} from "@/validation/movie.validation";

export async function createMovie(data: CreateMovieInput) {
  const { data: res } = await api.post("movies", data);
  return res;
}

export async function getAllMovies(
  page = 1,
  limit = 10,
): Promise<GetMoviesResponse> {
  const { data } = await api.get(`/movies?page=${page}&limit=${limit}`);

  return GetMoviesResponseSchema.parse(data);
}

export async function deleteMovie(id: string) {
  const { data } = await api.delete(`/movies/${id}`);

  return data;
}

export async function getMovieById(id: string) {
  const { data } = await api.get(`/movies/${id}`);
  console.log("Fetched movie data:", data);
  return data;
}
