import { Genre } from "../../../generated/prisma/enums";
import { z } from "zod";

// create
export const createMovieSchema = z.object({
  title: z.string().min(1, "Title is required"),

  description: z.string().optional(),

  thumbnailUrl: z.string().url().optional(),
  bannerUrl: z.string().url().optional(),

  releaseYear: z.coerce.number().int().optional(),

  language: z.array(z.string()).min(1),

  genre: z.array(z.enum(Genre)).min(1),

  tags: z.array(z.string()).default([]),

  ageRating: z.string().optional(),

  duration: z.coerce.number().positive(),

  videoUrl: z.string().url().optional(),
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
