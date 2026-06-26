"use client";

import { useEffect, useState } from "react";
import { useForm, } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Genre, Language, AgeRating } from "../../../../generated/prisma/enums";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dropzone } from "@/components/common/dropzone";
import { SeasonSection } from "./season-section";
import { useUploadMedia, useDeleteMedia } from "@/hooks/use-upload";
import { cn } from "@/lib/utils";
import { Tv, Sliders, Globe, Tag } from "lucide-react";
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

  const title = watch("title");
  const description = watch("description");
  const releaseYear = watch("releaseYear");
  const ageRating = watch("ageRating");

  const areSeasonsValid =
    seasons.length > 0 &&
    seasons.every(
      (season) =>
        season.episodes &&
        season.episodes.length > 0 &&
        season.episodes.every(
          (episode) =>
            (episode.title?.trim() ?? "").length > 0 &&
            Number(episode.duration) > 0 &&
            (episode.videoUrl?.trim() ?? "").length > 0 &&
            (episode.thumbnailUrl?.trim() ?? "").length > 0,
        ),
    );

  const isFormValid =
    (title?.trim() ?? "").length > 0 &&
    (description?.trim() ?? "").length > 0 &&
    Number(releaseYear) >= 1900 &&
    Number(releaseYear) <= new Date().getFullYear() &&
    (posterUrl?.trim() ?? "").length > 0 &&
    (bannerUrl?.trim() ?? "").length > 0 &&
    !!ageRating &&
    languages.length > 0 &&
    genres.length > 0 &&
    areSeasonsValid;

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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 text-zinc-900 dark:text-zinc-100">
      {/* SECTION 1: GENERAL DETAILS */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-card p-6 space-y-6 shadow-sm">
        <div className="flex items-center gap-3 border-b pb-4 border-zinc-100 dark:border-zinc-800/80">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-50 dark:bg-zinc-900 border text-zinc-500">
            <Tv className="h-4.5 w-4.5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wide uppercase text-zinc-500">General Information</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Title, description, release year, and classification ratings.</p>
          </div>
        </div>

        {/* TITLE */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold tracking-wide uppercase text-zinc-500">Series Title</label>
          <Input placeholder="e.g. Stranger Things" className="rounded-lg h-10" {...register("title")} />
          {errors.title && (
            <p className="text-xs text-red-500 font-medium">{errors.title.message}</p>
          )}
        </div>

        {/* DESCRIPTION */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold tracking-wide uppercase text-zinc-500">Description</label>
          <Input placeholder="Enter brief overview of the show" className="rounded-lg h-10" {...register("description")} />
          {errors.description && (
            <p className="text-xs text-red-500 font-medium">{errors.description.message}</p>
          )}
        </div>

        {/* RELEASE YEAR */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold tracking-wide uppercase text-zinc-500">Release Year</label>
          <Input
            type="number"
            min="1900"
            max={new Date().getFullYear()}
            placeholder="e.g. 2016"
            className="rounded-lg h-10"
            {...register("releaseYear")}
          />
          {errors.releaseYear && (
            <p className="text-xs text-red-500 font-medium">{errors.releaseYear.message}</p>
          )}
        </div>

        {/* AGE RATING */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold tracking-wide uppercase text-zinc-500">Age Rating</label>
          <select
            className="flex h-10 w-full rounded-lg border border-input bg-card px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            {...register("ageRating")}
          >
            <option value="">Select Classification Rating</option>
            {Object.values(AgeRating).map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          {errors.ageRating && (
            <p className="text-xs text-red-500 font-medium">{errors.ageRating.message}</p>
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
            <h3 className="text-sm font-semibold tracking-wide uppercase text-zinc-500">Media Files</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Upload posters and widescreen banner images.</p>
          </div>
        </div>

        {/* UPLOADS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold tracking-wide uppercase text-zinc-500">Poster Image</label>
            <Dropzone
              type="image"
              previewUrl={posterUrl}
              isUploading={uploading.poster}
              onUpload={uploadPoster}
              onDelete={deletePoster}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold tracking-wide uppercase text-zinc-500">Banner Image</label>
            <Dropzone
              type="image"
              previewUrl={bannerUrl}
              isUploading={uploading.banner}
              onUpload={uploadBanner}
              onDelete={deleteBanner}
            />
          </div>
        </div>
      </div>

      {/* SECTION 3: TAXONOMY & METADATA */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-card p-6 space-y-6 shadow-sm">
        <div className="flex items-center gap-3 border-b pb-4 border-zinc-100 dark:border-zinc-800/80">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-50 dark:bg-zinc-900 border text-zinc-500">
            <Globe className="h-4.5 w-4.5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wide uppercase text-zinc-500">Taxonomy & Metadata</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Specify release languages, genres, and searchable tags.</p>
          </div>
        </div>

        {/* LANGUAGES */}
        <div className="space-y-2">
          <label className="text-xs font-semibold tracking-wide uppercase text-zinc-500">Available Languages</label>
          <div className="flex flex-wrap gap-2">
            {Object.values(Language).map((l) => {
              const active = languages.includes(l);
              return (
                <Badge
                  key={l}
                  className={cn(
                    "cursor-pointer select-none py-1.5 px-3 rounded-lg text-xs font-medium transition-all duration-150 border",
                    active
                      ? "bg-zinc-900 text-zinc-50 border-zinc-950 dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100 shadow-sm"
                      : "bg-transparent text-zinc-500 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-850 dark:text-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-700 dark:hover:bg-zinc-900 dark:hover:text-zinc-200"
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
          <label className="text-xs font-semibold tracking-wide uppercase text-zinc-500">Primary Genres</label>
          <div className="flex flex-wrap gap-2">
            {Object.values(Genre).map((g) => {
              const active = genres.includes(g);
              return (
                <Badge
                  key={g}
                  className={cn(
                    "cursor-pointer select-none py-1.5 px-3 rounded-lg text-xs font-medium transition-all duration-150 border",
                    active
                      ? "bg-zinc-900 text-zinc-50 border-zinc-950 dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100 shadow-sm"
                      : "bg-transparent text-zinc-500 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-850 dark:text-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-700 dark:hover:bg-zinc-900 dark:hover:text-zinc-200"
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
          <label className="text-xs font-semibold tracking-wide uppercase text-zinc-500">Searchable Tags</label>
          <div className="flex gap-2">
            <Input
              placeholder="e.g. Netflix Original, Superheroes"
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
            <Button type="button" variant="outline" className="h-10 rounded-lg" onClick={addTag}>
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

      {/* SECTION 4: SEASONS */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-card p-6 space-y-6 shadow-sm">
        <div className="flex items-center gap-3 border-b pb-4 border-zinc-100 dark:border-zinc-800/80">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-50 dark:bg-zinc-900 border text-zinc-500">
            <Sliders className="h-4.5 w-4.5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wide uppercase text-zinc-500">Seasons & Episodes</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Structure episodes and assign video streaming files.</p>
          </div>
        </div>

        <div className="space-y-6">
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
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full h-11 border-dashed hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
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
      <div className="flex justify-end pt-4 border-t border-zinc-200 dark:border-zinc-800">
        <Button
          type="submit"
          className="w-full md:w-auto h-11 px-8 rounded-xl shadow-md transition-all font-semibold"
          disabled={
            isPending || uploading.poster || uploading.banner || !isFormValid
          }
        >
          {mode === "create" ? "Create Series" : "Update Series"}
        </Button>
      </div>
    </form>
  );
}