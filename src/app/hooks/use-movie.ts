import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createMovie,
  deleteMovie,
  getAllMovies,
  getMovieById,
  updateMovie,
} from "@/lib/api/movie.api";

import { appToast } from "@/lib/toast";
import type {
  GetMoviesResponse,
  UpdateMovieInput,
} from "@/validation/movie.validation";

// =====================
// CREATE MOVIE
// =====================
export function useCreateMovie() {
  return useMutation({
    mutationFn: async (data) => {
      return createMovie(data);
    },

    onSuccess: async () => {
      console.log("SUCCESS");
    },

    onError: (error) => {
      console.log("ERROR", error);
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
export function useGetMovieById(id: string) {
  return useQuery({
    queryKey: ["movie", id],
    queryFn: () => getMovieById(id),
    enabled: !!id,
  });
}

// Update
export function useUpdateMovie() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMovieInput }) =>
      updateMovie(id, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["movies"] });
      queryClient.invalidateQueries({
        queryKey: ["movie", variables.id],
      });
    },
  });
}
