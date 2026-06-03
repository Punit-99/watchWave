import api from "../axios";

import {
  GetMoviesResponseSchema,
  GetMovieResponseSchema,
  type UpdateMovieInput,
  type CreateMovieInput,
  type GetMoviesResponse,
  type GetMovieResponse,
} from "@/validation/movie.validation";

// CREATE
export async function createMovie(data: CreateMovieInput) {
  const { data: res } = await api.post("/movies", data);
  return res;
}

// GET ALL
export async function getAllMovies(
  page = 1,
  limit = 10,
): Promise<GetMoviesResponse> {
  const { data } = await api.get(`/movies?page=${page}&limit=${limit}`);

  return GetMoviesResponseSchema.parse(data);
}

// GET ONE
export async function getMovieById(id: string): Promise<GetMovieResponse> {
  const { data } = await api.get(`/movies/${id}`);

  return GetMovieResponseSchema.parse(data);
}

// DELETE
export async function deleteMovie(id: string) {
  const { data } = await api.delete(`/movies/${id}`);

  return data;
}

// UPDATE
export async function updateMovie(id: string, data: UpdateMovieInput) {
  const { data: res } = await api.patch(`/movies/${id}`, data);

  return res;
}
