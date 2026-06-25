import { useQuery } from "@tanstack/react-query";
import { getContentById } from "@/lib/api/content.api";

export function useGetContentById(id: string) {
  return useQuery({
    queryKey: ["content", id],
    queryFn: () => getContentById(id),
    enabled: !!id,
  });
}
