import {
  useMutation,
  useQuery,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";

import {
  createMovie,
  deleteMovie,
  getAllMovies,
  getMovieById,
  updateMovie,
} from "@/lib/api/movie.api";

import { appToast } from "@/lib/toast";
import type {
  UpdateMovieInput,
  CreateMovieInput,
} from "@/validation/movie.validation";

// CREATE MOVIE
export function useCreateMovie() {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, CreateMovieInput>({
    mutationFn: createMovie,

    onSuccess: () => {
      console.log("SUCCESS");
      queryClient.invalidateQueries({ queryKey: ["movies"] });
    },

    onError: (error) => {
      console.log("ERROR", error);
    },
  });
}
// GET ALL MOVIES (PAGINATED)
export function useGetAllMovies(page = 1, limit = 10) {
  return useQuery({
    queryKey: ["movies", page, limit],
    queryFn: () => getAllMovies(page, limit),
    placeholderData: keepPreviousData,
  });
}

// DELETE MOVIE
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

    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      appToast.error(err?.response?.data?.message ?? "Failed to delete movie");
    },
  });
}

// GET MOVIE BY ID
export function useGetMovieById(id: string) {
  return useQuery({
    queryKey: ["movie", id],
    queryFn: () => getMovieById(id),
    enabled: !!id,
  });
}

// UPATE MOVIE
export function useUpdateMovie() {
  console.log("useUpdateMovie called");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMovieInput }) =>
      updateMovie(id, data),

    onSuccess: async (_, variables) => {
      appToast.updated("Movie");

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["movies"],
          exact: false,
        }),
        queryClient.invalidateQueries({
          queryKey: ["movie", variables.id],
        }),
      ]);
    },

    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      appToast.error(err?.response?.data?.message ?? "Failed to update movie");
    },
  });
}
