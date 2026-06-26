"use client";

import {
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { useState, useEffect } from "react";

import { CreateSeriesInput } from "@/validation/series.validation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dropzone } from "@/components/common/dropzone";
import { Trash2 } from "lucide-react";

import { useUploadMedia, useDeleteMedia } from "@/hooks/use-upload";

type Props = {
  seasonIndex: number;
  episodeIndex: number;

  register: UseFormRegister<CreateSeriesInput>;
  setValue: UseFormSetValue<CreateSeriesInput>;
  watch: UseFormWatch<CreateSeriesInput>;

  removeEpisode: (index: number) => void;
};

export function EpisodeSection({
  seasonIndex,
  episodeIndex,
  register,
  setValue,
  watch,
  removeEpisode,
}: Props) {
  const uploadMutation = useUploadMedia();
  const deleteMutation = useDeleteMedia();

  const [uploading, setUploading] = useState({
    poster: false,
    banner: false,
    thumbnail: false,
    video: false,
  });

  useEffect(() => {
    setValue(
      `seasons.${seasonIndex}.episodes.${episodeIndex}.episodeNumber`,
      episodeIndex + 1,
    );
  }, [seasonIndex, episodeIndex, setValue]);

  const thumbnailPath =
    `seasons.${seasonIndex}.episodes.${episodeIndex}.thumbnailUrl` as const;

  const videoPath =
    `seasons.${seasonIndex}.episodes.${episodeIndex}.videoUrl` as const;

  const thumbnailUrl = watch(thumbnailPath);
  const videoUrl = watch(videoPath);

  const uploadPoster = async (file: File) => {
    setUploading((p) => ({ ...p, thumbnail: true }));

    try {
      const res = await uploadMutation.mutateAsync(file);

      setValue(thumbnailPath, res.url, {
        shouldValidate: true,
      });
    } finally {
      setUploading((p) => ({ ...p, thumbnail: false }));
    }
  };

  const uploadVideo = async (file: File) => {
    setUploading((p) => ({ ...p, video: true }));

    try {
      const res = await uploadMutation.mutateAsync(file);

      setValue(videoPath, res.url, {
        shouldValidate: true,
      });
    } finally {
      setUploading((p) => ({ ...p, video: false }));
    }
  };

  const deletePoster = async () => {
    if (!thumbnailUrl) return;

    await deleteMutation.mutateAsync(thumbnailUrl);

    setValue(thumbnailPath, "", {
      shouldValidate: true,
    });
  };

  const deleteVideo = async () => {
    if (!videoUrl) return;

    await deleteMutation.mutateAsync(videoUrl);

    setValue(videoPath, "", {
      shouldValidate: true,
    });
  };

  return (
    <div className="space-y-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-background p-5 shadow-sm">
      <div className="flex items-center justify-between border-b pb-3 border-zinc-100 dark:border-zinc-900">
        <div className="flex items-center gap-1.5 text-zinc-900 dark:text-zinc-100">
          <span className="text-xs font-mono bg-zinc-100 dark:bg-zinc-900 px-2 py-0.5 rounded text-muted-foreground font-semibold">
            EP {episodeIndex + 1}
          </span>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 rounded-lg text-xs hover:bg-red-500/10 hover:text-red-500 transition-colors border-zinc-200 dark:border-zinc-800"
          onClick={() => removeEpisode(episodeIndex)}
        >
          <Trash2 className="mr-1 h-3.5 w-3.5" />
          <span>Remove Episode</span>
        </Button>
      </div>

      <input
        type="hidden"
        {...register(
          `seasons.${seasonIndex}.episodes.${episodeIndex}.episodeNumber`,
          { valueAsNumber: true },
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Title */}
        <div className="md:col-span-2 space-y-1.5">
          <label className="text-[10px] font-bold tracking-wide uppercase text-zinc-500">
            Episode Title
          </label>
          <Input
            placeholder="e.g. Chapter One: The Vanishing of Will Byers"
            className="rounded-lg h-9"
            {...register(
              `seasons.${seasonIndex}.episodes.${episodeIndex}.title`,
            )}
          />
        </div>

        {/* Duration */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold tracking-wide uppercase text-zinc-500">
            Duration (mins)
          </label>
          <Input
            type="number"
            min="1"
            placeholder="e.g. 50"
            className="rounded-lg h-9"
            {...register(
              `seasons.${seasonIndex}.episodes.${episodeIndex}.duration`,
            )}
          />
        </div>
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold tracking-wide uppercase text-zinc-500">
          Description
        </label>
        <Input
          placeholder="Enter a brief summary of the episode"
          className="rounded-lg h-9"
          {...register(
            `seasons.${seasonIndex}.episodes.${episodeIndex}.description`,
          )}
        />
      </div>

      {/* Media uploads grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        <div className="space-y-2">
          <label className="text-[10px] font-bold tracking-wide uppercase text-zinc-500">
            Episode Thumbnail
          </label>
          <Dropzone
            type="image"
            previewUrl={thumbnailUrl}
            isUploading={uploading.thumbnail}
            onUpload={uploadPoster}
            onDelete={deletePoster}
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold tracking-wide uppercase text-zinc-500">
            Episode Video File
          </label>
          <Dropzone
            type="video"
            previewUrl={videoUrl}
            isUploading={uploading.video}
            onUpload={uploadVideo}
            onDelete={deleteVideo}
          />
        </div>
      </div>
    </div>
  );
}

export default EpisodeSection;
