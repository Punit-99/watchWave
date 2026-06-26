import {
  useMutation,
  useQuery,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";

import {
  createSeries,
  deleteSeries,
  getAllSeries,
  getSeriesById,
  updateSeries,
} from "@/lib/api/series.api";

import { appToast } from "@/lib/toast";

import type {
  CreateSeriesInput,
  UpdateSeriesInput,
  GetSeriesResponse,
  Series,
} from "@/validation/series.validation";

// =====================
// CREATE SERIES
// =====================
export function useCreateSeries() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSeriesInput) => createSeries(data),

    onSuccess: async () => {
      appToast.created("Series");

      await queryClient.invalidateQueries({
        queryKey: ["series"],
        exact: false, // 🔥 IMPORTANT FIX
      });
    },

    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      appToast.error(err?.response?.data?.message ?? "Failed to create series");
    },
  });
}

// =====================
// GET ALL SERIES (PAGINATED)
// =====================
export function useGetAllSeries(page = 1, limit = 10) {
  return useQuery<GetSeriesResponse>({
    queryKey: ["series", page, limit],
    queryFn: () => getAllSeries(page, limit),
    placeholderData: keepPreviousData,
  });
}

// =====================
// GET SERIES BY ID
// =====================
export function useGetSeriesById(id: string) {
  return useQuery<{
    success: boolean;
    data: Series;
  }>({
    queryKey: ["series", id],
    queryFn: () => getSeriesById(id),
    enabled: !!id,
  });
}

// =====================
// UPDATE SERIES
// =====================
export function useUpdateSeries() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSeriesInput }) =>
      updateSeries(id, data),

    onSuccess: async (_, variables) => {
      appToast.updated("Series");

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["series"],
          exact: false, // 🔥 FIX: all pages refresh
        }),

        queryClient.invalidateQueries({
          queryKey: ["series", variables.id],
        }),
      ]);
    },

    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      appToast.error(err?.response?.data?.message ?? "Failed to update series");
    },
  });
}

// =====================
// DELETE SERIES
// =====================
export function useDeleteSeries() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteSeries(id),

    onSuccess: async () => {
      appToast.deleted("Series");

      await queryClient.invalidateQueries({
        queryKey: ["series"],
        exact: false, // 🔥 CRITICAL FIX
      });
    },

    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      appToast.error(err?.response?.data?.message ?? "Failed to delete series");
    },
  });
}
