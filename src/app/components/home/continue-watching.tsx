"use client";

import { MediaCard } from "../common/media-card";
import { SectionHeader } from "../movies/section-header";
import { useGetProgress, useDeleteProgress } from "@/hooks/use-progress";

export function ContinueWatching() {
  const { data: progressData, isLoading } = useGetProgress();
  const deleteProgressMutation = useDeleteProgress();

  if (isLoading || !progressData?.success) {
    return null;
  }

  const items = progressData.data || [];

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="mt-14">
      <SectionHeader title="Continue Watching" />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {items.map((item) => {
          const content = item.content;
          if (!content) return null;

          return (
            <MediaCard
              key={item.id}
              id={content.id}
              title={content.title}
              image={content.bannerUrl || content.posterUrl || ""}
              type={content.type}
              description={content.description}
              progress={{
                watchedTime: item.watchedTime,
                duration: item.duration,
              }}
              onRemoveProgress={() => {
                deleteProgressMutation.mutate(content.id);
              }}
            />
          );
        })}
      </div>
    </section>
  );
}
