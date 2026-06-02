import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createMovie,
  deleteMovie,
  getAllMovies,
  getMovieById,
} from "@/lib/api/movie.api";

import { appToast } from "@/lib/toast";

import type { GetMoviesResponse } from "@/validation/movie.validation";

export function useCreateMovie() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMovie,

    onSuccess: async () => {
      appToast.created("Movie");

      await queryClient.invalidateQueries({
        queryKey: ["movies"],
      });
    },

    onError: (error: any) => {
      appToast.error(
        error?.response?.data?.message ?? "Failed to create movie",
      );
    },
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
      appToast.deleted("Movie");

      await queryClient.invalidateQueries({
        queryKey: ["movies"],
      });
    },

    onError: (error: any) => {
      appToast.error(
        error?.response?.data?.message ?? "Failed to delete movie",
      );
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
