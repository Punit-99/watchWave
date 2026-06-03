"use client";

import {
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { useState } from "react";

import { CreateSeriesInput } from "@/validation/series.validation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dropzone } from "@/components/ui/dropzone";

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
    thumbnail: false,
    video: false,
  });

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
    <div className="space-y-5 rounded-lg border-b pb-8">
      <div className="flex items-center justify-between">
        <h4 className="text-base font-semibold">Episode {episodeIndex + 1}</h4>

        <Button
          type="button"
          size="sm"
          variant="destructive"
          onClick={() => removeEpisode(episodeIndex)}
        >
          Remove Episode
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Input
          type="number"
          placeholder="Episode Number"
          {...register(
            `seasons.${seasonIndex}.episodes.${episodeIndex}.episodeNumber`,
          )}
        />

        <Input
          type="number"
          placeholder="Duration (minutes)"
          {...register(
            `seasons.${seasonIndex}.episodes.${episodeIndex}.duration`,
          )}
        />
      </div>

      <Input
        placeholder="Episode Title"
        {...register(`seasons.${seasonIndex}.episodes.${episodeIndex}.title`)}
      />

      <Input
        placeholder="Episode Description"
        {...register(
          `seasons.${seasonIndex}.episodes.${episodeIndex}.description`,
        )}
      />

      <div className="space-y-2">
        <h5 className="font-medium">Episode Thumbnail</h5>

        <Dropzone
          type="image"
          previewUrl={thumbnailUrl}
          isUploading={uploading.thumbnail}
          onUpload={uploadPoster}
          onDelete={deletePoster}
        />
      </div>

      <div className="space-y-2">
        <h5 className="font-medium">Episode Video</h5>

        <Dropzone
          type="video"
          previewUrl={videoUrl}
          isUploading={uploading.video}
          onUpload={uploadVideo}
          onDelete={deleteVideo}
        />
      </div>
    </div>
  );
}

export default EpisodeSection;
