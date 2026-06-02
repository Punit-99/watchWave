import { Genre, Language, AgeRating } from "../../../generated/prisma/enums";
import { z } from "zod";

const genreEnum = z.enum(Object.values(Genre) as [string, ...string[]]);
const languageEnum = z.enum(Object.values(Language) as [string, ...string[]]);
const ageRatingEnum = z.enum(Object.values(AgeRating) as [string, ...string[]]);

// ======================
// CREATE
// ======================

export const episodeCreateSchema = z.object({
  episodeNumber: z.coerce.number().int().positive(),

  title: z.string().min(1, "Episode title is required"),

  description: z.string().optional(),

  duration: z.coerce.number().positive(),

  videoUrl: z.string().url(),

  thumbnailUrl: z.string().url(),
});

export const seasonCreateSchema = z.object({
  seasonNumber: z.coerce.number().int().positive(),

  episodes: z.array(episodeCreateSchema).min(1),
});

export const createSeriesSchema = z.object({
  title: z.string().min(1, "Title is required"),

  description: z.string().optional(),

  thumbnailUrl: z.string().url().optional().or(z.literal("")),

  bannerUrl: z.string().url().optional().or(z.literal("")),

  releaseYear: z.coerce
    .number()
    .int()
    .min(1900)
    .max(new Date().getFullYear())
    .optional(),

  language: z.array(languageEnum).min(1),

  genre: z.array(genreEnum).min(1),

  tags: z.array(z.string()).default([]),

  ageRating: ageRatingEnum.optional(),

  seasons: z.array(seasonCreateSchema).min(1),
});

export type CreateSeriesInput = z.infer<typeof createSeriesSchema>;
export type CreateSeasonInput = z.infer<typeof seasonCreateSchema>;
export type CreateEpisodeInput = z.infer<typeof episodeCreateSchema>;

// ======================
// UPDATE
// ======================

export const updateSeriesSchema = z.object({
  title: z.string().min(1).optional(),

  description: z.string().optional(),

  thumbnailUrl: z.string().url().optional(),

  bannerUrl: z.string().url().optional(),

  releaseYear: z.coerce.number().int().optional(),

  language: z.array(languageEnum).optional(),

  genre: z.array(genreEnum).optional(),

  tags: z.array(z.string()).optional(),

  ageRating: ageRatingEnum.optional(),

  totalSeasons: z.coerce.number().int().positive().optional(),

  isPublished: z.boolean().optional(),
});

export type UpdateSeriesInput = z.infer<typeof updateSeriesSchema>;

// ======================
// GET
// ======================

export const EpisodeSchema = z.object({
  id: z.string(),
  seasonId: z.string(),

  title: z.string(),
  description: z.string(),

  episodeNumber: z.number(),
  duration: z.number(),

  videoUrl: z.string().url(),
  thumbnailUrl: z.string().url(),

  createdAt: z.string(),
});

export const SeasonSchema = z.object({
  id: z.string(),
  seriesId: z.string(),

  seasonNumber: z.number(),

  createdAt: z.string(),

  episodes: z.array(EpisodeSchema),
});

export const SeriesDetailsSchema = z.object({
  id: z.string(),
  contentId: z.string(),

  totalSeasons: z.number(),

  seasons: z.array(SeasonSchema),
});

export const SeriesSchema = z.object({
  id: z.string(),

  title: z.string(),
  description: z.string(),

  thumbnailUrl: z.string().url(),
  bannerUrl: z.string().url(),

  releaseYear: z.number(),

  language: z.array(z.string()),
  genre: z.array(z.string()),
  tags: z.array(z.string()),

  ageRating: z.string(),
  type: z.string(),

  createdAt: z.string(),
  updatedAt: z.string(),

  series: z.array(SeriesDetailsSchema),
});

export const PaginationSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number(),
});

export const GetSeriesResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(SeriesSchema),
  pagination: PaginationSchema.optional(),
});

export type Episode = z.infer<typeof EpisodeSchema>;
export type Season = z.infer<typeof SeasonSchema>;
export type SeriesDetails = z.infer<typeof SeriesDetailsSchema>;
export type Series = z.infer<typeof SeriesSchema>;

export type Pagination = z.infer<typeof PaginationSchema>;
export type GetSeriesResponse = z.infer<typeof GetSeriesResponseSchema>;
