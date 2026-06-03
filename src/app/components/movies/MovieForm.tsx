"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Genre, Language, AgeRating } from "../../../../generated/prisma/enums";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dropzone } from "@/components/ui/dropzone";

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
  } = useForm<MovieFormData>({
    resolver: zodResolver(
      mode === "create" ? createMovieSchema : updateMovieSchema,
    ),
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
      className="space-y-8"
    >
      {/* TITLE */}
      <Input placeholder="Movie Title" {...register("title")} />
      {errors.title && (
        <p className="text-sm text-red-500">{errors.title.message}</p>
      )}

      <Input placeholder="Description" {...register("description")} />
      {errors.description && (
        <p className="text-sm text-red-500">{errors.description.message}</p>
      )}

      {/* DURATION */}
      <Input
        type="number"
        placeholder="Duration (minutes)"
        {...register("duration")}
      />
      {errors.duration && (
        <p className="text-sm text-red-500">{errors.duration.message}</p>
      )}

      <Input
        type="number"
        placeholder="Release Year"
        {...register("releaseYear")}
      />
      {errors.releaseYear && (
        <p className="text-sm text-red-500">{errors.releaseYear.message}</p>
      )}
      {/* UPLOADS */}
      <Dropzone
        type="image"
        previewUrl={posterUrl}
        isUploading={uploading.poster}
        onUpload={uploadPoster}
        onDelete={deletePoster}
      />

      <Dropzone
        type="image"
        previewUrl={bannerUrl}
        isUploading={uploading.banner}
        onUpload={uploadBanner}
        onDelete={deleteBanner}
      />

      <Dropzone
        type="video"
        previewUrl={videoUrl}
        isUploading={uploading.video}
        onUpload={uploadVideo}
        onDelete={deleteVideo}
      />

      {/* AGE */}
      <select
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

      {/* LANGUAGES */}
      <div>
        {LANGUAGES.map((l) => (
          <Badge
            key={l}
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

      {/* GENRES */}
      <div>
        {GENRES.map((g) => (
          <Badge
            key={g}
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

      {/* TAGS */}
      <Input value={tagInput} onChange={(e) => setTagInput(e.target.value)} />
      <Button type="button" onClick={addTag}>
        Add
      </Button>

      <div>
        {tags.map((t) => (
          <Badge key={t} onClick={() => removeTag(t)}>
            {t} ✕
          </Badge>
        ))}
      </div>

      {/* SUBMIT */}
      <Button type="submit" disabled={isPending}>
        {mode === "create" ? "Create Movie" : "Update Movie"}
      </Button>
    </form>
  );
}
