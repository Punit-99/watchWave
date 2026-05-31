import { z } from "zod";
import { Genre } from "../../../generated/prisma/enums";

// ---------------------
// Episode Schema
// ---------------------
export const episodeSchema = z.object({
  episodeNumber: z.coerce.number().int().positive(),
  title: z.string().min(1, "Episode title is required"),
  description: z.string().optional(),
  duration: z.coerce.number().positive(),
  videoUrl: z.string().url().optional(),
  thumbnailUrl: z.string().url().optional(),
});

// ---------------------
// Season Schema
// ---------------------
export const seasonSchema = z.object({
  seasonNumber: z.coerce.number().int().positive(),
  episodes: z.array(episodeSchema).min(1, "At least 1 episode required"),
});

// ---------------------
// CREATE SERIES
// ---------------------
export const createSeriesSchema = z.object({
  title: z.string().min(1, "Title is required"),

  description: z.string().optional(),

  thumbnailUrl: z.string().url().optional(),
  bannerUrl: z.string().url().optional(),

  releaseYear: z.coerce.number().int().optional(),

  language: z.array(z.string()).min(1),

  genre: z.array(z.nativeEnum(Genre)).min(1),

  tags: z.array(z.string()).default([]),

  ageRating: z.string().optional(),

  seasons: z.array(seasonSchema).min(1, "At least 1 season required"),
});

export type CreateSeriesInput = z.infer<typeof createSeriesSchema>;

export const updateEpisodeSchema = z.object({
  id: z.string().optional(),
  episodeNumber: z.coerce.number().int().positive().optional(),
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  duration: z.coerce.number().positive().optional(),
  videoUrl: z.string().url().optional(),
  thumbnailUrl: z.string().url().optional(),
});

export const updateSeasonSchema = z.object({
  id: z.string().optional(),
  seasonNumber: z.coerce.number().int().positive().optional(),
  episodes: z.array(updateEpisodeSchema).optional(),
});

export const updateSeriesSchema = z.object({
  title: z.string().min(1).optional(),

  description: z.string().optional(),

  thumbnailUrl: z.string().url().optional(),
  bannerUrl: z.string().url().optional(),

  releaseYear: z.coerce.number().int().optional(),

  language: z.array(z.string()).optional(),

  genre: z.array(z.nativeEnum(Genre)).optional(),

  tags: z.array(z.string()).optional(),

  ageRating: z.string().optional(),

  seasons: z.array(updateSeasonSchema).optional(),
});

export type UpdateSeriesInput = z.infer<typeof updateSeriesSchema>;
