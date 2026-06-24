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


type SeriesFormProps =
  | {
    mode: "create";
    initialData?: Partial<CreateSeriesInput>;
    onSubmit: (data: CreateSeriesInput) => void;
    isPending?: boolean;
  }
  | {
    mode: "edit";
    initialData?: Partial<CreateSeriesInput>;
    onSubmit: (data: UpdateSeriesInput) => void;
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
  } = useForm<any>({
    resolver: zodResolver(
      mode === "create"
        ? createSeriesSchema
        : updateSeriesSchema
    ),
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

  const seasons = (watch("seasons") ?? []) as any[];
  const languages = (watch("language") ?? []) as Language[];
  const genres = (watch("genre") ?? []) as Genre[];
  const tags = (watch("tags") ?? []) as string[];

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
    <form
      onSubmit={handleSubmit((data) => {
        if (mode === "create") {
          onSubmit(data);
        } else {
          onSubmit(data as UpdateSeriesInput);
        }
      })}
      className="space-y-8"
    >
      {/* TITLE */}
      <Input placeholder="Series Title" {...register("title")} />

      {errors.title?.message && (
        <p className="text-sm text-red-500">
          {String(errors.title.message)}
        </p>
      )}

      <Input placeholder="Description" {...register("description")} />

      {errors.description?.message && (
        <p className="text-sm text-red-500">
          {String(errors.description.message)}
        </p>
      )}

      <Input
        type="number"
        placeholder="Release Year"
        {...register("releaseYear")}
      />

      {errors.releaseYear?.message && (
        <p className="text-sm text-red-500">
          {String(errors.releaseYear.message)}
        </p>
      )}

      {/* THUMBNAIL */}
      <Dropzone
        type="image"
        previewUrl={posterUrl}
        isUploading={uploading.poster}
        onUpload={uploadPoster}
        onDelete={deletePoster}
      />

      {/* BANNER */}
      <Dropzone
        type="image"
        previewUrl={bannerUrl}
        isUploading={uploading.banner}
        onUpload={uploadBanner}
        onDelete={deleteBanner}
      />

      {/* AGE RATING */}
      <select {...register("ageRating")}>
        <option value="">Select Age Rating</option>

        {Object.values(AgeRating).map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>

      {errors.ageRating?.message && (
        <p className="text-sm text-red-500">
          {String(errors.ageRating.message)}
        </p>
      )}

      {/* LANGUAGES */}
      <div className="flex flex-wrap gap-2">
        {Object.values(Language).map((l) => (
          <Badge
            key={l}
            className="cursor-pointer"
            variant={languages.includes(l) ? "default" : "outline"}
            onClick={() => toggleLanguage(l)}
          >
            {l}
          </Badge>
        ))}
      </div>

      {errors.language?.message && (
        <p className="text-sm text-red-500">
          {String(errors.language.message)}
        </p>
      )}

      {/* GENRES */}
      <div className="flex flex-wrap gap-2">
        {Object.values(Genre).map((g) => (
          <Badge
            key={g}
            className="cursor-pointer"
            variant={genres.includes(g) ? "default" : "outline"}
            onClick={() => toggleGenre(g)}
          >
            {g}
          </Badge>
        ))}
      </div>

      {errors.genre?.message && (
        <p className="text-sm text-red-500">
          {String(errors.genre.message)}
        </p>
      )}

      {/* TAGS */}
      <div className="flex gap-2">
        <Input
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          placeholder="Add tag"
        />

        <Button type="button" onClick={addTag}>
          Add
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {tags.map((t: string) => (
          <Badge key={t} onClick={() => removeTag(t)}>
            {t} ✕
          </Badge>
        ))}
      </div>

      {/* SEASONS */}
      <div className="space-y-4">
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
