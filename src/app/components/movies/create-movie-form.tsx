"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Genre, Language, AgeRating } from "../../../../generated/prisma/enums";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dropzone } from "@/components/ui/dropzone";

import { useUploadMedia, useDeleteMedia } from "@/hooks/use-upload";
import { useCreateMovie } from "@/hooks/use-movie";

import {
  createMovieSchema,
  type CreateMovieInput,
} from "@/validation/movie.validation";

export function CreateMovieForm() {
  const router = useRouter();
  const [tagInput, setTagInput] = useState("");

  const [uploading, setUploading] = useState({
    thumbnail: false,
    banner: false,
    video: false,
  });

  const { mutate, isPending } = useCreateMovie();
  const uploadMutation = useUploadMedia();
  const deleteMutation = useDeleteMedia();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateMovieInput>({
    resolver: zodResolver(createMovieSchema),
    defaultValues: {
      title: "",
      description: "",
      thumbnailUrl: "",
      bannerUrl: "",
      videoUrl: "",
      ageRating: undefined,
      duration: 0,
      language: [],
      genre: [],
      tags: [],
    },
  });

  // ---------------- WATCH ----------------
  const genres = watch("genre");
  const languages = watch("language");
  const tags = watch("tags");

  const thumbnailUrl = watch("thumbnailUrl");
  const bannerUrl = watch("bannerUrl");
  const videoUrl = watch("videoUrl");

  // ---------------- ENUM LISTS ----------------
  const GENRES = Object.values(Genre);
  const LANGUAGES = Object.values(Language);
  const AGE_RATINGS = Object.values(AgeRating);

  // ---------------- UPLOAD ----------------
  const uploadThumbnail = async (file: File) => {
    setUploading((p) => ({ ...p, thumbnail: true }));
    try {
      const res = await uploadMutation.mutateAsync(file);
      setValue("thumbnailUrl", res.url, { shouldValidate: true });
    } finally {
      setUploading((p) => ({ ...p, thumbnail: false }));
    }
  };

  const uploadBanner = async (file: File) => {
    setUploading((p) => ({ ...p, banner: true }));
    try {
      const res = await uploadMutation.mutateAsync(file);
      setValue("bannerUrl", res.url, { shouldValidate: true });
    } finally {
      setUploading((p) => ({ ...p, banner: false }));
    }
  };

  const uploadVideo = async (file: File) => {
    setUploading((p) => ({ ...p, video: true }));
    try {
      const res = await uploadMutation.mutateAsync(file);
      setValue("videoUrl", res.url, { shouldValidate: true });
    } finally {
      setUploading((p) => ({ ...p, video: false }));
    }
  };

  // ---------------- DELETE ----------------
  const deleteThumbnail = async () => {
    const url = watch("thumbnailUrl");
    if (!url) return;
    await deleteMutation.mutateAsync(url);
    setValue("thumbnailUrl", "");
  };

  const deleteBanner = async () => {
    const url = watch("bannerUrl");
    if (!url) return;
    await deleteMutation.mutateAsync(url);
    setValue("bannerUrl", "");
  };

  const deleteVideo = async () => {
    const url = watch("videoUrl");
    if (!url) return;
    await deleteMutation.mutateAsync(url);
    setValue("videoUrl", "");
  };

  // ---------------- GENRE TOGGLE ----------------
  const toggleGenre = (genre: Genre) => {
    const exists = genres.includes(genre);
    setValue(
      "genre",
      exists ? genres.filter((g) => g !== genre) : [...genres, genre],
      { shouldValidate: true },
    );
  };

  // ---------------- LANGUAGE TOGGLE ----------------
  const toggleLanguage = (lang: Language) => {
    const exists = languages.includes(lang);
    setValue(
      "language",
      exists ? languages.filter((l) => l !== lang) : [...languages, lang],
      { shouldValidate: true },
    );
  };

  // ---------------- TAGS ----------------
  const addTag = () => {
    const trimmed = tagInput.trim();
    if (!trimmed || tags.includes(trimmed)) return;
    setValue("tags", [...tags, trimmed]);
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setValue(
      "tags",
      tags.filter((t) => t !== tag),
    );
  };

  // ---------------- SUBMIT ----------------
  const onSubmit = (data: CreateMovieInput) => {
    mutate(data, {
      onSuccess: () => {
        router.push("/admin/movies");
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* TITLE */}
      <div className="space-y-2">
        <Input placeholder="Movie Title" {...register("title")} />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      {/* DESCRIPTION */}
      <Input placeholder="Description" {...register("description")} />

      {/* THUMBNAIL */}
      <Dropzone
        type="image"
        previewUrl={thumbnailUrl}
        isUploading={uploading.thumbnail}
        onUpload={uploadThumbnail}
        onDelete={deleteThumbnail}
      />

      {/* BANNER */}
      <Dropzone
        type="image"
        previewUrl={bannerUrl}
        isUploading={uploading.banner}
        onUpload={uploadBanner}
        onDelete={deleteBanner}
      />

      {/* VIDEO */}
      <Dropzone
        type="video"
        previewUrl={videoUrl}
        isUploading={uploading.video}
        onUpload={uploadVideo}
        onDelete={deleteVideo}
      />

      {/* RELEASE YEAR */}
      <Input
        type="number"
        min={1900}
        max={new Date().getFullYear()}
        placeholder="Release Year"
        {...register("releaseYear")}
      />

      {/* DURATION */}
      <Input
        type="number"
        min={1}
        placeholder="Duration"
        {...register("duration")}
      />

      {/* AGE RATING (FIXED) */}
      <div className="space-y-2">
        <h3 className="font-medium">Age Rating</h3>

        <select
          className="w-full border rounded px-3 py-2"
          {...register("ageRating")}
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

      {/* LANGUAGE (FIXED) */}
      <div className="space-y-2">
        <h3 className="font-medium">Languages</h3>

        <div className="flex flex-wrap gap-2">
          {LANGUAGES.map((l) => (
            <Badge
              key={l}
              onClick={() => toggleLanguage(l)}
              variant={languages.includes(l) ? "default" : "outline"}
              className="cursor-pointer"
            >
              {l}
            </Badge>
          ))}
        </div>
      </div>

      {/* GENRES */}
      <div className="space-y-2">
        <h3 className="font-medium">Genres</h3>

        <div className="flex flex-wrap gap-2">
          {GENRES.map((g) => (
            <Badge
              key={g}
              onClick={() => toggleGenre(g)}
              variant={genres.includes(g) ? "default" : "outline"}
              className="cursor-pointer"
            >
              {g}
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
          <Button type="button" onClick={addTag}>
            Add
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <Badge
              key={t}
              onClick={() => removeTag(t)}
              className="cursor-pointer"
              variant="secondary"
            >
              {t} ✕
            </Badge>
          ))}
        </div>
      </div>

      {/* SUBMIT */}
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Creating..." : "Create Movie"}
      </Button>
    </form>
  );
}
