import { useMutation } from "@tanstack/react-query";
import { uploadMedia, deleteMedia } from "@/lib/api/upload.api";

export function useUploadMedia() {
  return useMutation({
    mutationFn: uploadMedia,
  });
}

export function useDeleteMedia() {
  return useMutation({
    mutationFn: deleteMedia,
  });
}
