import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createMovie,
  deleteMovie,
  getAllMovies,
  getMovieById,
} from "@/lib/api/movie.api";

import { appToast } from "@/lib/toast";
import type { GetMoviesResponse } from "@/validation/movie.validation";

// =====================
// CREATE MOVIE
// =====================
export function useCreateMovie() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMovie,

    onSuccess: async () => {
      appToast.created("Movie");

      await queryClient.invalidateQueries({
        queryKey: ["movies"],
        exact: false, // 🔥 IMPORTANT FIX
      });
    },

    onError: (error: any) => {
      appToast.error(
        error?.response?.data?.message ?? "Failed to create movie",
      );
    },
  });
}

// =====================
// GET ALL MOVIES (PAGINATED)
// =====================
export function useGetAllMovies(page = 1, limit = 10) {
  return useQuery<GetMoviesResponse>({
    queryKey: ["movies", page, limit],
    queryFn: () => getAllMovies(page, limit),
    keepPreviousData: true, // 🔥 smooth pagination UX
  });
}

// =====================
// DELETE MOVIE
// =====================
export function useDeleteMovie() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMovie,

    onSuccess: async () => {
      appToast.deleted("Movie");

      await queryClient.invalidateQueries({
        queryKey: ["movies"],
        exact: false, // 🔥 FIX: refresh ALL pages
      });
    },

    onError: (error: any) => {
      appToast.error(
        error?.response?.data?.message ?? "Failed to delete movie",
      );
    },
  });
}

// =====================
// GET MOVIE BY ID
// =====================
export function useMovie(id: string) {
  return useQuery({
    queryKey: ["movie", id],
    queryFn: () => getMovieById(id),
    enabled: !!id,
  });
}
