"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Genre, Language, AgeRating } from "../../../../generated/prisma/enums";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dropzone } from "@/components/ui/dropzone";

import { SeasonSection } from "./season-section";

import { useCreateSeries } from "@/hooks/use-series";
import { useUploadMedia, useDeleteMedia } from "@/hooks/use-upload";

import {
  createSeriesSchema,
  type CreateSeriesInput,
} from "@/validation/series.validation";

export function CreateSeriesForm() {
  const router = useRouter();

  const [tagInput, setTagInput] = useState("");

  const [uploading, setUploading] = useState({
    thumbnail: false,
    banner: false,
  });

  const { mutate, isPending } = useCreateSeries();

  const uploadMutation = useUploadMedia();
  const deleteMutation = useDeleteMedia();

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateSeriesInput>({
    resolver: zodResolver(createSeriesSchema),

    defaultValues: {
      title: "Stranger Things",
      description: "Mystery sci-fi thriller series",

      thumbnailUrl:
        "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba",

      bannerUrl: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c",

      releaseYear: 2016,

      language: ["ENGLISH"],
      genre: ["DRAMA", "THRILLER", "SCIFI"],

      tags: ["netflix", "mystery"],

      ageRating: "PG",

      seasons: [
        {
          seasonNumber: 1,

          episodes: [
            {
              episodeNumber: 1,
              title: "The Vanishing of Will Byers",
              description: "A boy disappears in a small town",

              duration: 50,

              videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",

              thumbnailUrl:
                "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4",
            },

            {
              episodeNumber: 2,
              title: "The Weirdo on Maple Street",
              description: "Mysteries deepen across Hawkins",

              duration: 48,

              videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",

              thumbnailUrl:
                "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c",
            },
          ],
        },

        {
          seasonNumber: 2,

          episodes: [
            {
              episodeNumber: 1,
              title: "MADMAX",
              description: "The gang faces new threats",

              duration: 55,

              videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",

              thumbnailUrl:
                "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba",
            },
          ],
        },
      ],
    },
  });

  const {
    fields: seasons,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "seasons",
  });

  const languages = watch("language");
  const genres = watch("genre");
  const tags = watch("tags");

  const thumbnailUrl = watch("thumbnailUrl");
  const bannerUrl = watch("bannerUrl");

  const uploadThumbnail = async (file: File) => {
    setUploading((p) => ({
      ...p,
      thumbnail: true,
    }));

    try {
      const res = await uploadMutation.mutateAsync(file);

      setValue("thumbnailUrl", res.url, {
        shouldValidate: true,
      });
    } finally {
      setUploading((p) => ({
        ...p,
        thumbnail: false,
      }));
    }
  };

  const uploadBanner = async (file: File) => {
    setUploading((p) => ({
      ...p,
      banner: true,
    }));

    try {
      const res = await uploadMutation.mutateAsync(file);

      setValue("bannerUrl", res.url, {
        shouldValidate: true,
      });
    } finally {
      setUploading((p) => ({
        ...p,
        banner: false,
      }));
    }
  };

  const deleteThumbnail = async () => {
    if (!thumbnailUrl) return;

    await deleteMutation.mutateAsync(thumbnailUrl);

    setValue("thumbnailUrl", "", {
      shouldValidate: true,
    });
  };

  const deleteBanner = async () => {
    if (!bannerUrl) return;

    await deleteMutation.mutateAsync(bannerUrl);

    setValue("bannerUrl", "", {
      shouldValidate: true,
    });
  };

  const onSubmit = (data: CreateSeriesInput) => {
    mutate(data, {
      onSuccess: () => {
        router.push("/admin/series");
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* BASIC INFO */}

      <div className="space-y-2">
        <Input placeholder="Series Title" {...register("title")} />

        {errors.title && (
          <p className="text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      <Input placeholder="Description" {...register("description")} />

      <Input
        type="number"
        placeholder="Release Year"
        {...register("releaseYear")}
      />

      {/* THUMBNAIL */}

      <div className="space-y-2">
        <h3 className="font-medium">Thumbnail</h3>

        <Dropzone
          type="image"
          previewUrl={thumbnailUrl}
          isUploading={uploading.thumbnail}
          onUpload={uploadThumbnail}
          onDelete={deleteThumbnail}
        />
      </div>

      {/* BANNER */}

      <div className="space-y-2">
        <h3 className="font-medium">Banner</h3>

        <Dropzone
          type="image"
          previewUrl={bannerUrl}
          isUploading={uploading.banner}
          onUpload={uploadBanner}
          onDelete={deleteBanner}
        />
      </div>

      {/* AGE RATING */}

      <div className="space-y-2">
        <h3 className="font-medium">Age Rating</h3>

        <select
          className="w-full rounded-md border px-3 py-2"
          {...register("ageRating")}
        >
          <option value="">Select Age Rating</option>

          {Object.values(AgeRating).map((rating) => (
            <option key={rating} value={rating}>
              {rating}
            </option>
          ))}
        </select>
      </div>

      {/* LANGUAGES */}

      <div className="space-y-2">
        <h3 className="font-medium">Languages</h3>

        <div className="flex flex-wrap gap-2">
          {Object.values(Language).map((lang) => (
            <Badge
              key={lang}
              className="cursor-pointer"
              variant={languages.includes(lang) ? "default" : "outline"}
              onClick={() =>
                setValue(
                  "language",
                  languages.includes(lang)
                    ? languages.filter((l) => l !== lang)
                    : [...languages, lang],
                  {
                    shouldValidate: true,
                  },
                )
              }
            >
              {lang}
            </Badge>
          ))}
        </div>
      </div>

      {/* GENRES */}

      <div className="space-y-2">
        <h3 className="font-medium">Genres</h3>

        <div className="flex flex-wrap gap-2">
          {Object.values(Genre).map((genre) => (
            <Badge
              key={genre}
              className="cursor-pointer"
              variant={genres.includes(genre) ? "default" : "outline"}
              onClick={() =>
                setValue(
                  "genre",
                  genres.includes(genre)
                    ? genres.filter((g) => g !== genre)
                    : [...genres, genre],
                  {
                    shouldValidate: true,
                  },
                )
              }
            >
              {genre}
            </Badge>
          ))}
        </div>
      </div>

      {/* TAGS */}

      <div className="space-y-2">
        <h3 className="font-medium">Tags</h3>

        <div className="flex gap-2">
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="Add tag"
          />

          <Button
            type="button"
            onClick={() => {
              const value = tagInput.trim();

              if (!value || tags.includes(value)) return;

              setValue("tags", [...tags, value]);

              setTagInput("");
            }}
          >
            Add
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="cursor-pointer"
              onClick={() =>
                setValue(
                  "tags",
                  tags.filter((t) => t !== tag),
                )
              }
            >
              {tag} ✕
            </Badge>
          ))}
        </div>
      </div>

      {/* SEASONS */}

      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Seasons</h2>

        {seasons.map((season, index) => (
          <SeasonSection
            key={season.id}
            seasonIndex={index}
            control={control}
            register={register}
            setValue={setValue}
            watch={watch}
            removeSeason={remove}
          />
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={() =>
            append({
              seasonNumber: seasons.length + 1,

              episodes: [
                {
                  episodeNumber: 1,
                  title: "",
                  description: "",
                  duration: 0,
                  videoUrl: "",
                  thumbnailUrl: "",
                },
              ],
            })
          }
        >
          Add Season
        </Button>
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Creating..." : "Create Series"}
      </Button>
    </form>
  );
}

export default CreateSeriesForm;
