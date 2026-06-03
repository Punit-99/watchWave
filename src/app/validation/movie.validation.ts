import { Genre, Language, AgeRating } from "../../../generated//prisma/enums";
import { z } from "zod";

const genreEnum = z.enum(Object.values(Genre) as [string, ...string[]]);
const languageEnum = z.enum(Object.values(Language) as [string, ...string[]]);
const ageRatingEnum = z.enum(Object.values(AgeRating) as [string, ...string[]]);

// create
export const createMovieSchema = z.object({
  title: z.string().min(1, "Title is required"),

  description: z.string().optional(),

  thumbnailUrl: z.string().url().optional().or(z.literal("")),
  bannerUrl: z.string().url().optional().or(z.literal("")),
  videoUrl: z.string().url().optional().or(z.literal("")),

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

  duration: z.coerce.number().positive("Duration must be greater than 0"),
});

export type CreateMovieInput = z.infer<typeof createMovieSchema>;

// Update
export const updateMovieSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),

  description: z.string().optional(),

  thumbnailUrl: z.string().url().optional().or(z.literal("")),
  bannerUrl: z.string().url().optional().or(z.literal("")),
  videoUrl: z.string().url().optional().or(z.literal("")),

  releaseYear: z.coerce
    .number()
    .int()
    .min(1900)
    .max(new Date().getFullYear())
    .optional(),

  language: z.array(languageEnum).optional(),

  genre: z.array(genreEnum).optional(),

  tags: z.array(z.string()).optional(),

  ageRating: ageRatingEnum.optional(),

  duration: z.coerce.number().positive().optional(),

  isPublished: z.boolean().optional(),
});

export type UpdateMovieInput = z.infer<typeof updateMovieSchema>;

// get

export const MovieSchema = z.object({
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

  movie: z.object({
    id: z.string(),
    contentId: z.string(),
    duration: z.number(),
    videoUrl: z.string().url(),
  }),
});

// pagination
export const PaginationSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number(),
});

// response
export const GetMoviesResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(MovieSchema),
  pagination: PaginationSchema.optional(),
});

export const GetMovieResponseSchema = z.object({
  success: z.boolean(),
  data: MovieSchema,
});

export type GetMovieResponse = z.infer<typeof GetMovieResponseSchema>;

export type Movie = z.infer<typeof MovieSchema>;
export type Pagination = z.infer<typeof PaginationSchema>;
export type GetMoviesResponse = z.infer<typeof GetMoviesResponseSchema>;
