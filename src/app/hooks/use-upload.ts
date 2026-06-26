import { useMutation } from "@tanstack/react-query";

import { uploadMedia, deleteMedia } from "@/lib/api/upload.api";

import { appToast } from "@/lib/toast";

export function useUploadMedia() {
  return useMutation({
    mutationFn: uploadMedia,

    onSuccess: () => {
      appToast.uploadSuccess("File");
    },

    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      appToast.error(err?.response?.data?.message ?? "Failed to upload file");
    },
  });
}

export function useDeleteMedia() {
  return useMutation({
    mutationFn: deleteMedia,

    onSuccess: () => {
      appToast.deleted("File");
    },

    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      appToast.error(err?.response?.data?.message ?? "Failed to delete file");
    },
  });
}
