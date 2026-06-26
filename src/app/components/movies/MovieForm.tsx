"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Genre, Language, AgeRating } from "../../../../generated/prisma/enums";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dropzone } from "@/components/common/dropzone";

import { useUploadMedia, useDeleteMedia } from "@/hooks/use-upload";

import {
  createMovieSchema,
  updateMovieSchema,
  type CreateMovieInput,
  type UpdateMovieInput,
} from "@/validation/movie.validation";

type MovieFormData = CreateMovieInput | UpdateMovieInput;

type MovieFormProps = {
  mode: "create" | "edit";
  initialData?: Partial<CreateMovieInput>;
  onSubmit: (data: MovieFormData) => void;
  isPending?: boolean;
};

export function MovieForm({
  mode,
  initialData,
  onSubmit,
  isPending,
}: MovieFormProps) {
  const [tagInput, setTagInput] = useState("");

  const [uploading, setUploading] = useState({
    poster: false,
    banner: false,
    video: false,
  });

  const uploadMutation = useUploadMedia();
  const deleteMutation = useDeleteMedia();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateMovieInput>({
    resolver: zodResolver(
      mode === "create" ? createMovieSchema : updateMovieSchema,
    ) as any,
  });
  useEffect(() => {
    if (mode === "edit" && initialData) {
      reset({
        title: initialData.title,
        description: initialData.description,
        posterUrl: initialData.posterUrl,
        bannerUrl: initialData.bannerUrl,
        videoUrl: initialData.videoUrl,
        ageRating: initialData.ageRating,
        duration: initialData.duration,
        language: initialData.language,
        genre: initialData.genre,
        tags: initialData.tags,
        releaseYear: initialData.releaseYear,
      });

      return;
    }

    if (mode === "create") {
      reset({
        title: "",
        description: "",
        posterUrl: "",
        bannerUrl: "",
        videoUrl: "",
        ageRating: undefined,
        duration: undefined,
        language: [],
        genre: [],
        tags: [],
        releaseYear: undefined,
      });
    }
  }, [mode, initialData, reset]);
  const genres = watch("genre") ?? [];
  const languages = watch("language") ?? [];
  const tags = watch("tags") ?? [];

  const posterUrl = watch("posterUrl");
  const bannerUrl = watch("bannerUrl");
  const videoUrl = watch("videoUrl");

  const title = watch("title");
  const description = watch("description");
  const duration = watch("duration");
  const releaseYear = watch("releaseYear");
  const ageRating = watch("ageRating");

  const isFormValid =
    (title?.trim() ?? "").length > 0 &&
    (description?.trim() ?? "").length > 0 &&
    Number(duration) > 0 &&
    Number(releaseYear) >= 1900 &&
    Number(releaseYear) <= new Date().getFullYear() &&
    (posterUrl?.trim() ?? "").length > 0 &&
    (bannerUrl?.trim() ?? "").length > 0 &&
    (videoUrl?.trim() ?? "").length > 0 &&
    !!ageRating &&
    languages.length > 0 &&
    genres.length > 0;

  const GENRES = Object.values(Genre);
  const LANGUAGES = Object.values(Language);
  const AGE_RATINGS = Object.values(AgeRating);

  // ---------------- UPLOAD LOGIC (same as yours) ----------------
  const uploadPoster = async (file: File) => {
    setUploading((p) => ({ ...p, poster: true }));
    const res = await uploadMutation.mutateAsync(file);
    setValue("posterUrl", res.url, { shouldValidate: true });
    setUploading((p) => ({ ...p, poster: false }));
  };

  const uploadBanner = async (file: File) => {
    setUploading((p) => ({ ...p, banner: true }));
    const res = await uploadMutation.mutateAsync(file);
    setValue("bannerUrl", res.url, { shouldValidate: true });
    setUploading((p) => ({ ...p, banner: false }));
  };

  const uploadVideo = async (file: File) => {
    setUploading((p) => ({ ...p, video: true }));
    const res = await uploadMutation.mutateAsync(file);
    setValue("videoUrl", res.url, { shouldValidate: true });
    setUploading((p) => ({ ...p, video: false }));
  };

  // ---------------- TOGGLES (same logic) ----------------
  const toggleGenre = (genre: Genre) => {
    const exists = genres.includes(genre);
    setValue(
      "genre",
      exists ? genres.filter((g) => g !== genre) : [...genres, genre],
      { shouldValidate: true },
    );
  };

  const toggleLanguage = (lang: Language) => {
    const exists = languages.includes(lang);
    setValue(
      "language",
      exists ? languages.filter((l) => l !== lang) : [...languages, lang],
      { shouldValidate: true },
    );
  };

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

  const deletePoster = async () => {
    const url = watch("posterUrl");

    if (!url) return;

    await deleteMutation.mutateAsync(url);

    setValue("posterUrl", "", {
      shouldValidate: true,
    });
  };

  const deleteBanner = async () => {
    const url = watch("bannerUrl");

    if (!url) return;

    await deleteMutation.mutateAsync(url);

    setValue("bannerUrl", "", {
      shouldValidate: true,
    });
  };

  const deleteVideo = async () => {
    const url = watch("videoUrl");

    if (!url) return;

    await deleteMutation.mutateAsync(url);

    setValue("videoUrl", "", {
      shouldValidate: true,
    });
  };

  return (
    <form
      onSubmit={handleSubmit(
        (data) => {
          console.log("FORM SUBMITTED", data);
          onSubmit(data);
        },
        (errors) => {
          console.log("FORM ERRORS", errors);
        },
      )}
      className="space-y-6"
    >
      {/* TITLE */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Movie Title</label>
        <Input placeholder="Enter movie title" {...register("title")} />
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

      {/* DURATION & RELEASE YEAR */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Duration (minutes)</label>
          <Input
            type="number"
            min="1"
            placeholder="Duration (minutes)"
            {...register("duration")}
          />
          {errors.duration && (
            <p className="text-sm text-red-500">{errors.duration.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Release Year</label>
          <Input
            type="number"
            min="1900"
            max={new Date().getFullYear()}
            placeholder="Release Year"
            {...register("releaseYear")}
          />
          {errors.releaseYear && (
            <p className="text-sm text-red-500">{errors.releaseYear.message}</p>
          )}
        </div>
      </div>

      {/* UPLOADS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Video File</label>
          <Dropzone
            type="video"
            previewUrl={videoUrl}
            isUploading={uploading.video}
            onUpload={uploadVideo}
            onDelete={deleteVideo}
          />
        </div>
      </div>

      {/* AGE RATING */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Age Rating</label>
        <select
          className="flex h-9 w-full rounded-md border border-input bg-card px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          {...register("ageRating", {
            setValueAs: (value) => (value === "" ? undefined : value),
          })}
        >
          <option value="">Select Age Rating</option>
          {AGE_RATINGS.map((r) => (
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
          {LANGUAGES.map((l) => (
            <Badge
              key={l}
              className="cursor-pointer select-none"
              onClick={() => toggleLanguage(l)}
              variant={languages.includes(l) ? "default" : "outline"}
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
          {GENRES.map((g) => (
            <Badge
              key={g}
              className="cursor-pointer select-none"
              onClick={() => toggleGenre(g)}
              variant={genres.includes(g) ? "default" : "outline"}
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
            placeholder="Add a tag"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
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

      {/* SUBMIT */}
      <Button
        type="submit"
        className="w-full md:w-auto"
        disabled={
          isPending ||
          uploading.poster ||
          uploading.banner ||
          uploading.video ||
          !isFormValid
        }
      >
        {mode === "create" ? "Create Movie" : "Update Movie"}
      </Button>
    </form>
  );
}