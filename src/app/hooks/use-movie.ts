import { useMutation } from "@tanstack/react-query";

import { createMovie } from "@/lib/api/movie.api";

export function useCreateMovie() {
  return useMutation({
    mutationFn: createMovie,
  });
}
