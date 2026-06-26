"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Genre, Language, AgeRating } from "../../../../generated/prisma/enums";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dropzone } from "@/components/common/dropzone";
import { cn } from "@/lib/utils";
import { Film, Sliders, Globe } from "lucide-react";

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
    ) as unknown as import("react-hook-form").Resolver<CreateMovieInput>,
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
      className="space-y-8 text-zinc-900 dark:text-zinc-100"
    >
      {/* SECTION 1: GENERAL DETAILS */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-card p-6 space-y-6 shadow-sm">
        <div className="flex items-center gap-3 border-b pb-4 border-zinc-100 dark:border-zinc-800/80">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-50 dark:bg-zinc-900 border text-zinc-500">
            <Film className="h-4.5 w-4.5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wide uppercase text-zinc-500">
              General Information
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Title, description, duration, and classification ratings.
            </p>
          </div>
        </div>

        {/* TITLE */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold tracking-wide uppercase text-zinc-500">
            Movie Title
          </label>
          <Input
            placeholder="e.g. Inception"
            className="rounded-lg h-10"
            {...register("title")}
          />
          {errors.title && (
            <p className="text-xs text-red-500 font-medium">
              {errors.title.message}
            </p>
          )}
        </div>

        {/* DESCRIPTION */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold tracking-wide uppercase text-zinc-500">
            Description
          </label>
          <Input
            placeholder="Enter brief overview of the plot"
            className="rounded-lg h-10"
            {...register("description")}
          />
          {errors.description && (
            <p className="text-xs text-red-500 font-medium">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* DURATION & RELEASE YEAR */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold tracking-wide uppercase text-zinc-500">
              Duration (minutes)
            </label>
            <Input
              type="number"
              min="1"
              placeholder="e.g. 120"
              className="rounded-lg h-10"
              {...register("duration")}
            />
            {errors.duration && (
              <p className="text-xs text-red-500 font-medium">
                {errors.duration.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold tracking-wide uppercase text-zinc-500">
              Release Year
            </label>
            <Input
              type="number"
              min="1900"
              max={new Date().getFullYear()}
              placeholder="e.g. 2010"
              className="rounded-lg h-10"
              {...register("releaseYear")}
            />
            {errors.releaseYear && (
              <p className="text-xs text-red-500 font-medium">
                {errors.releaseYear.message}
              </p>
            )}
          </div>
        </div>

        {/* AGE RATING */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold tracking-wide uppercase text-zinc-500">
            Age Rating
          </label>
          <select
            className="flex h-10 w-full rounded-lg border border-input bg-card px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            {...register("ageRating", {
              setValueAs: (value) => (value === "" ? undefined : value),
            })}
          >
            <option value="">Select Classification Rating</option>
            {AGE_RATINGS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          {errors.ageRating && (
            <p className="text-xs text-red-500 font-medium">
              {errors.ageRating.message}
            </p>
          )}
        </div>
      </div>

      {/* SECTION 2: MEDIA ASSETS */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-card p-6 space-y-6 shadow-sm">
        <div className="flex items-center gap-3 border-b pb-4 border-zinc-100 dark:border-zinc-800/80">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-50 dark:bg-zinc-900 border text-zinc-500">
            <Sliders className="h-4.5 w-4.5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wide uppercase text-zinc-500">
              Media Files
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Upload posters, banners, and high-definition movie files.
            </p>
          </div>
        </div>

        {/* UPLOADS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold tracking-wide uppercase text-zinc-500">
              Poster Image
            </label>
            <Dropzone
              type="image"
              previewUrl={posterUrl}
              isUploading={uploading.poster}
              onUpload={uploadPoster}
              onDelete={deletePoster}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold tracking-wide uppercase text-zinc-500">
              Banner Image
            </label>
            <Dropzone
              type="image"
              previewUrl={bannerUrl}
              isUploading={uploading.banner}
              onUpload={uploadBanner}
              onDelete={deleteBanner}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold tracking-wide uppercase text-zinc-500">
              Video File
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

      {/* SECTION 3: CLASSIFICATION & METADATA */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-card p-6 space-y-6 shadow-sm">
        <div className="flex items-center gap-3 border-b pb-4 border-zinc-100 dark:border-zinc-800/80">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-50 dark:bg-zinc-900 border text-zinc-500">
            <Globe className="h-4.5 w-4.5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wide uppercase text-zinc-500">
              Taxonomy & Metadata
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Specify release languages, genres, and searchable tags.
            </p>
          </div>
        </div>

        {/* LANGUAGES */}
        <div className="space-y-2">
          <label className="text-xs font-semibold tracking-wide uppercase text-zinc-500">
            Available Languages
          </label>
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.map((l) => {
              const active = languages.includes(l);
              return (
                <Badge
                  key={l}
                  className={cn(
                    "cursor-pointer select-none py-1.5 px-3 rounded-lg text-xs font-medium transition-all duration-150 border",
                    active
                      ? "bg-zinc-900 text-zinc-50 border-zinc-950 dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100 shadow-sm"
                      : "bg-transparent text-zinc-500 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-850 dark:text-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-700 dark:hover:bg-zinc-900 dark:hover:text-zinc-200",
                  )}
                  variant="outline"
                  onClick={() => toggleLanguage(l)}
                >
                  {l}
                </Badge>
              );
            })}
          </div>
          {errors.language && (
            <p className="text-xs text-red-500 font-medium">
              {errors.language.message?.toString()}
            </p>
          )}
        </div>

        {/* GENRES */}
        <div className="space-y-2">
          <label className="text-xs font-semibold tracking-wide uppercase text-zinc-500">
            Primary Genres
          </label>
          <div className="flex flex-wrap gap-2">
            {GENRES.map((g) => {
              const active = genres.includes(g);
              return (
                <Badge
                  key={g}
                  className={cn(
                    "cursor-pointer select-none py-1.5 px-3 rounded-lg text-xs font-medium transition-all duration-150 border",
                    active
                      ? "bg-zinc-900 text-zinc-50 border-zinc-950 dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100 shadow-sm"
                      : "bg-transparent text-zinc-500 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-850 dark:text-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-700 dark:hover:bg-zinc-900 dark:hover:text-zinc-200",
                  )}
                  variant="outline"
                  onClick={() => toggleGenre(g)}
                >
                  {g}
                </Badge>
              );
            })}
          </div>
          {errors.genre && (
            <p className="text-xs text-red-500 font-medium">
              {errors.genre.message?.toString()}
            </p>
          )}
        </div>

        {/* TAGS */}
        <div className="space-y-3">
          <label className="text-xs font-semibold tracking-wide uppercase text-zinc-500">
            Searchable Tags
          </label>
          <div className="flex gap-2">
            <Input
              placeholder="e.g. Sci-Fi, Award Winner"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              className="rounded-lg h-10 max-w-md"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag();
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              className="h-10 rounded-lg"
              onClick={addTag}
            >
              Add Tag
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((t) => (
              <Badge
                key={t}
                className="py-1.5 px-3 rounded-lg text-xs bg-zinc-100 hover:bg-red-500/10 hover:text-red-500 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5 cursor-pointer transition-colors border-0"
                onClick={() => removeTag(t)}
                variant="secondary"
              >
                <span>{t}</span>
                <span className="text-[10px] opacity-60">✕</span>
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* SUBMIT */}
      <div className="flex justify-end pt-4 border-t border-zinc-200 dark:border-zinc-800">
        <Button
          type="submit"
          className="w-full md:w-auto h-11 px-8 rounded-xl shadow-md transition-all font-semibold"
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
      </div>
    </form>
  );
}
