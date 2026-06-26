import { useQuery } from "@tanstack/react-query";
import { getContentById, type ContentResponse } from "@/lib/api/content.api";

export function useGetContentById(id: string) {
  return useQuery<ContentResponse>({
    queryKey: ["content", id],
    queryFn: () => getContentById(id),
    enabled: !!id,
  });
}
