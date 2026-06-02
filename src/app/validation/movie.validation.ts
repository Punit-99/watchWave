import { Genre, Language, AgeRating } from "../../../generated//prisma/enums";
import { z } from "zod";

const genreEnum = z.enum(Object.values(Genre) as [string, ...string[]]);
const languageEnum = z.enum(Object.values(Language) as [string, ...string[]]);
const ageRatingEnum = z.enum(Object.values(AgeRating) as [string, ...string[]]);

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
  title: z.string().min(1).optional(),

  description: z.string().optional(),

  thumbnailUrl: z.string().url().optional(),
  bannerUrl: z.string().url().optional(),

  releaseYear: z.coerce.number().int().optional(),

  language: z.array(z.string()).optional(),

  genre: z.array(z.nativeEnum(Genre)).optional(),

  tags: z.array(z.string()).optional(),

  ageRating: z.string().optional(),

  duration: z.coerce.number().positive().optional(),

  videoUrl: z.string().url().optional(),

  isPublished: z.boolean().optional(),
});

export type UpdateMovieInput = z.infer<typeof updateMovieSchema>;
