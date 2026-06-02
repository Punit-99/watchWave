import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createMovie,
  deleteMovie,
  getAllMovies,
  getMovieById,
} from "@/lib/api/movie.api";

import type { GetMoviesResponse } from "@/validation/movie.validation";

export function useCreateMovie() {
  return useMutation({
    mutationFn: createMovie,
  });
}

export function useGetAllMovies() {
  return useQuery<GetMoviesResponse>({
    queryKey: ["movies"],
    queryFn: getAllMovies,
  });
}

export function useDeleteMovie() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMovie,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["movies"],
      });
    },
  });
}

export function useMovie(id: string) {
  return useQuery({
    queryKey: ["movie", id],
    queryFn: () => getMovieById(id),
    enabled: !!id,
  });
}
