import { removeUndefined } from "@/utils/remove-undefined";
import { prisma } from "../lib/prisma";
import {
  createMovieSchema,
  updateMovieSchema,
} from "../validation/movie.validation";
import { ZodError } from "zod";

// create
export async function createMovieController(req: Request) {
  try {
    const body = await req.json();

    const data = createMovieSchema.parse(body);

    const movie = await prisma.content.create({
      data: {
        title: data.title,
        description: data.description,

        posterUrl: data.posterUrl,
        bannerUrl: data.bannerUrl,

        releaseYear: data.releaseYear,

        language: data.language,
        genre: data.genre,
        tags: data.tags,

        ageRating: data.ageRating,

        type: "MOVIE",

        movie: {
          create: {
            duration: data.duration,
            videoUrl: data.videoUrl,
          },
        },
      },
      include: {
        movie: true,
      },
    });

    return Response.json(
      {
        success: true,
        message: "Movie created successfully",
        data: movie,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      {
        status: 500,
      },
    );
  }
}

// delete
export async function deleteMovieController(
  _: Request,
  params: { id: string },
) {
  try {
    const movie = await prisma.content.findUnique({
      where: {
        id: params.id,
      },
      include: {
        movie: true,
      },
    });

    if (!movie || !movie.movie) {
      return Response.json(
        {
          success: false,
          message: "Movie not found",
        },
        {
          status: 404,
        },
      );
    }

    await prisma.content.delete({
      where: {
        id: params.id,
      },
    });

    return Response.json(
      {
        success: true,
        message: "Movie deleted successfully",
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      {
        status: 500,
      },
    );
  }
}

// update : PATCH
export async function updateMovieController(
  req: Request,
  params: { id: string },
) {
  try {
    const body = await req.json();

    const data = updateMovieSchema.parse(body);

    const existingMovie = await prisma.content.findUnique({
      where: {
        id: params.id,
      },
      include: {
        movie: true,
      },
    });

    if (!existingMovie || !existingMovie.movie) {
      return Response.json(
        {
          success: false,
          message: "Movie not found",
        },
        { status: 404 },
      );
    }

    const contentUpdateData = removeUndefined({
      title: data.title,
      description: data.description,
      posterUrl: data.posterUrl,
      bannerUrl: data.bannerUrl,
      releaseYear: data.releaseYear,
      language: data.language,
      genre: data.genre,
      tags: data.tags,
      ageRating: data.ageRating,
    });

    const movieUpdateData = removeUndefined({
      duration: data.duration,
      videoUrl: data.videoUrl,
    });

    if (
      Object.keys(contentUpdateData).length === 0 &&
      Object.keys(movieUpdateData).length === 0
    ) {
      return Response.json(
        {
          success: false,
          message: "No fields provided for update",
        },
        { status: 400 },
      );
    }

    const updatedMovie = await prisma.content.update({
      where: {
        id: params.id,
      },
      data: {
        ...contentUpdateData,

        ...(Object.keys(movieUpdateData).length > 0 && {
          movie: {
            update: movieUpdateData,
          },
        }),
      },
      include: {
        movie: true,
      },
    });

    return Response.json(
      {
        success: true,
        data: updatedMovie,
      },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return Response.json(
        {
          success: false,
          errors: error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 },
    );
  }
}

// Get all movies
export async function getMoviesController(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;

    const movies = await prisma.content.findMany({
      where: {
        type: "MOVIE",
      },
      include: {
        movie: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    const totalMovies = await prisma.content.count({
      where: {
        type: "MOVIE",
      },
    });

    return Response.json(
      {
        success: true,
        data: movies,
        pagination: {
          page,
          limit,
          total: totalMovies,
          totalPages: Math.ceil(totalMovies / limit),
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Failed to fetch movies",
      },
      { status: 500 },
    );
  }
}

// get movie by id
export async function getMovieByIdController(
  _: Request,
  params: { id: string },
) {
  try {
    const movie = await prisma.content.findUnique({
      where: {
        id: params.id,
      },
      include: {
        movie: true,
      },
    });

    if (!movie || !movie.movie) {
      return Response.json(
        {
          success: false,
          message: "Movie not found",
        },
        { status: 404 },
      );
    }

    return Response.json(
      {
        success: true,
        data: movie,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Failed to fetch movie",
      },
      { status: 500 },
    );
  }
}
