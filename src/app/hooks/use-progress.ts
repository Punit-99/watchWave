import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProgress,
  saveProgress,
  deleteProgress,
} from "@/lib/api/progress.api";

export function useGetProgress() {
  return useQuery({
    queryKey: ["progress"],
    queryFn: getProgress,
  });
}

export function useSaveProgress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveProgress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["progress"] });
    },
  });
}

export function useDeleteProgress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProgress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["progress"] });
    },
  });
}
