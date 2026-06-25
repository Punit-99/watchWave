"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Genre, Language, AgeRating } from "../../../../generated/prisma/enums";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dropzone } from "@/components/common/dropzone";

import { SeasonSection } from "./season-section";

import { useUploadMedia, useDeleteMedia } from "@/hooks/use-upload";

import {
  createSeriesSchema,
  updateSeriesSchema,
  type CreateSeriesInput,
  type UpdateSeriesInput,
} from "@/validation/series.validation";

type SeriesFormData = CreateSeriesInput | UpdateSeriesInput;

type SeriesFormProps = {
  mode: "create" | "edit";
  initialData?: Partial<CreateSeriesInput>;
  onSubmit: (data: SeriesFormData) => void;
  isPending?: boolean;
};

export function SeriesForm({
  mode,
  initialData,
  onSubmit,
  isPending,
}: SeriesFormProps) {
  const [tagInput, setTagInput] = useState("");

  const [uploading, setUploading] = useState({
    poster: false,
    banner: false,
  });

  const uploadMutation = useUploadMedia();
  const deleteMutation = useDeleteMedia();

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateSeriesInput>({
    resolver: zodResolver(
      mode === "create" ? createSeriesSchema : updateSeriesSchema,
    ) as any,
  });

  // ======================
  // RESET (CREATE / EDIT)
  // ======================
  useEffect(() => {
    if (mode === "edit" && initialData) {
      reset(initialData);
      return;
    }

    reset({
      title: "",
      description: "",
      posterUrl: "",
      bannerUrl: "",
      releaseYear: undefined,
      language: [],
      genre: [],
      tags: [],
      ageRating: undefined,
      seasons: [],
    });
  }, [mode, initialData, reset]);

  const seasons = watch("seasons") ?? [];
  const languages = watch("language") ?? [];
  const genres = watch("genre") ?? [];
  const tags = watch("tags") ?? [];

  const posterUrl = watch("posterUrl");
  const bannerUrl = watch("bannerUrl");

  // ======================
  // UPLOADS
  // ======================
  const uploadPoster = async (file: File) => {
    setUploading((p) => ({ ...p, poster: true }));
    const res = await uploadMutation.mutateAsync(file);

    setValue("posterUrl", res.url, {
      shouldValidate: true,
    });

    setUploading((p) => ({ ...p, poster: false }));
  };

  const uploadBanner = async (file: File) => {
    setUploading((p) => ({ ...p, banner: true }));
    const res = await uploadMutation.mutateAsync(file);

    setValue("bannerUrl", res.url, {
      shouldValidate: true,
    });

    setUploading((p) => ({ ...p, banner: false }));
  };

  const deletePoster = async () => {
    if (!posterUrl) return;
    await deleteMutation.mutateAsync(posterUrl);

    setValue("posterUrl", "", { shouldValidate: true });
  };

  const deleteBanner = async () => {
    if (!bannerUrl) return;
    await deleteMutation.mutateAsync(bannerUrl);

    setValue("bannerUrl", "", { shouldValidate: true });
  };

  // ======================
  // TAGS
  // ======================
  const addTag = () => {
    if (!tagInput.trim() || tags.includes(tagInput)) return;

    setValue("tags", [...tags, tagInput.trim()]);
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setValue(
      "tags",
      tags.filter((t) => t !== tag),
    );
  };

  // ======================
  // TOGGLES
  // ======================
  const toggleLanguage = (lang: Language) => {
    setValue(
      "language",
      languages.includes(lang)
        ? languages.filter((l) => l !== lang)
        : [...languages, lang],
      { shouldValidate: true },
    );
  };

  const toggleGenre = (genre: Genre) => {
    setValue(
      "genre",
      genres.includes(genre)
        ? genres.filter((g) => g !== genre)
        : [...genres, genre],
      { shouldValidate: true },
    );
  };

  const removeSeason = (index: number) => {
    const updated = seasons.filter((_, i) => i !== index);
    setValue("seasons", updated, { shouldValidate: true });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* TITLE */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Series Title</label>
        <Input placeholder="Enter series title" {...register("title")} />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      {/* DESCRIPTION */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Description</label>
        <Input placeholder="Enter description" {...register("description")} />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      {/* RELEASE YEAR */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Release Year</label>
        <Input
          type="number"
          placeholder="Release Year"
          {...register("releaseYear")}
        />
        {errors.releaseYear && (
          <p className="text-sm text-red-500">{errors.releaseYear.message}</p>
        )}
      </div>

      {/* UPLOADS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Poster Image</label>
          <Dropzone
            type="image"
            previewUrl={posterUrl}
            isUploading={uploading.poster}
            onUpload={uploadPoster}
            onDelete={deletePoster}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Banner Image</label>
          <Dropzone
            type="image"
            previewUrl={bannerUrl}
            isUploading={uploading.banner}
            onUpload={uploadBanner}
            onDelete={deleteBanner}
          />
        </div>
      </div>

      {/* AGE RATING */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Age Rating</label>
        <select
          className="flex h-9 w-full rounded-md border border-input bg-card px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          {...register("ageRating")}
        >
          <option value="">Select Age Rating</option>
          {Object.values(AgeRating).map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        {errors.ageRating && (
          <p className="text-sm text-red-500">{errors.ageRating.message}</p>
        )}
      </div>

      {/* LANGUAGES */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Languages</label>
        <div className="flex flex-wrap gap-2">
          {Object.values(Language).map((l) => (
            <Badge
              key={l}
              className="cursor-pointer select-none"
              variant={languages.includes(l) ? "default" : "outline"}
              onClick={() => toggleLanguage(l)}
            >
              {l}
            </Badge>
          ))}
        </div>
        {errors.language && (
          <p className="text-sm text-red-500">
            {errors.language.message?.toString()}
          </p>
        )}
      </div>

      {/* GENRES */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Genres</label>
        <div className="flex flex-wrap gap-2">
          {Object.values(Genre).map((g) => (
            <Badge
              key={g}
              className="cursor-pointer select-none"
              variant={genres.includes(g) ? "default" : "outline"}
              onClick={() => toggleGenre(g)}
            >
              {g}
            </Badge>
          ))}
        </div>
        {errors.genre && (
          <p className="text-sm text-red-500">
            {errors.genre.message?.toString()}
          </p>
        )}
      </div>

      {/* TAGS */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Tags</label>
        <div className="flex gap-2">
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="Add tag"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTag();
              }
            }}
          />
          <Button type="button" onClick={addTag}>
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map((t) => (
            <Badge
              key={t}
              className="cursor-pointer select-none"
              onClick={() => removeTag(t)}
            >
              {t} ✕
            </Badge>
          ))}
        </div>
      </div>

      {/* SEASONS */}
      <div className="space-y-4 pt-4 border-t">
        <h2 className="text-xl font-bold">Seasons</h2>

        {seasons.map((_, index) => (
          <SeasonSection
            key={index}
            seasonIndex={index}
            control={control}
            register={register}
            setValue={setValue}
            watch={watch}
            removeSeason={removeSeason}
          />
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={() =>
            setValue("seasons", [
              ...seasons,
              {
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
              },
            ])
          }
        >
          Add Season
        </Button>
      </div>

      {/* SUBMIT */}
      <Button type="submit" disabled={isPending} className="w-full">
        {mode === "create" ? "Create Series" : "Update Series"}
      </Button>
    </form>
  );
}