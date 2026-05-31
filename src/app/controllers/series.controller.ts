import { prisma } from "../lib/prisma";
import {
  createSeriesSchema,
  updateSeriesSchema,
} from "../validation/series.validation";
import { ZodError } from "zod";

// Create
export async function createSeriesController(req: Request) {
  try {
    const body = await req.json();

    const data = createSeriesSchema.parse(body);

    const series = await prisma.content.create({
      data: {
        title: data.title,
        description: data.description,

        thumbnailUrl: data.thumbnailUrl,
        bannerUrl: data.bannerUrl,

        releaseYear: data.releaseYear,

        language: data.language,
        genre: data.genre,
        tags: data.tags,

        ageRating: data.ageRating,

        type: "SERIES",

        series: {
          create: {
            totalSeasons: data.seasons.length,

            seasons: {
              create: data.seasons.map((season) => ({
                seasonNumber: season.seasonNumber,

                episodes: {
                  create: season.episodes.map((ep) => ({
                    episodeNumber: ep.episodeNumber,
                    title: ep.title,
                    description: ep.description,
                    duration: ep.duration,
                    videoUrl: ep.videoUrl,
                    thumbnailUrl: ep.thumbnailUrl,
                  })),
                },
              })),
            },
          },
        },
      },
      include: {
        series: {
          include: {
            seasons: {
              include: {
                episodes: true,
              },
            },
          },
        },
      },
    });

    return Response.json(
      {
        success: true,
        message: "Series created successfully",
        data: series,
      },
      { status: 201 },
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

// Delete
export async function deleteSeriesController(
  _: Request,
  params: { id: string },
) {
  try {
    const series = await prisma.content.findUnique({
      where: { id: params.id },
      include: { series: true },
    });

    if (!series || !series.series) {
      return Response.json(
        {
          success: false,
          message: "Series not found",
        },
        { status: 404 },
      );
    }

    await prisma.content.delete({
      where: { id: params.id },
    });

    return Response.json(
      {
        success: true,
        message: "Series deleted successfully",
      },
      { status: 200 },
    );
  } catch (error) {
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

// Update
export async function updateSeriesController(
  req: Request,
  params: { id: string },
) {
  try {
    const body = await req.json();

    const data = updateSeriesSchema.parse(body);

    const existingSeries = await prisma.content.findUnique({
      where: { id: params.id },
      include: { series: true },
    });

    if (!existingSeries || !existingSeries.series) {
      return Response.json(
        {
          success: false,
          message: "Series not found",
        },
        { status: 404 },
      );
    }

    const updatedSeries = await prisma.content.update({
      where: { id: params.id },
      data: {
        title: data.title,
        description: data.description,
        thumbnailUrl: data.thumbnailUrl,
        bannerUrl: data.bannerUrl,
        releaseYear: data.releaseYear,
        language: data.language,
        genre: data.genre,
        tags: data.tags,
        ageRating: data.ageRating,

        series: {
          update: {
            seasons: data.seasons
              ? {
                  deleteMany: {}, // 🔥 simple reset approach (can optimize later)

                  create: data.seasons.map((season) => ({
                    seasonNumber: season.seasonNumber,

                    episodes: {
                      create:
                        season.episodes?.map((ep) => ({
                          episodeNumber: ep.episodeNumber,
                          title: ep.title,
                          description: ep.description,
                          duration: ep.duration,
                          videoUrl: ep.videoUrl,
                          thumbnailUrl: ep.thumbnailUrl,
                        })) || [],
                    },
                  })),
                }
              : undefined,
          },
        },
      },
      include: {
        series: {
          include: {
            seasons: {
              include: {
                episodes: true,
              },
            },
          },
        },
      },
    });

    return Response.json(
      {
        success: true,
        data: updatedSeries,
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

// Get all
export async function getSeriesController(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;

    const series = await prisma.content.findMany({
      where: {
        type: "SERIES",
      },
      include: {
        series: {
          include: {
            seasons: {
              include: {
                episodes: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    const totalSeries = await prisma.content.count({
      where: { type: "SERIES" },
    });

    return Response.json(
      {
        success: true,
        data: series,
        pagination: {
          page,
          limit,
          total: totalSeries,
          totalPages: Math.ceil(totalSeries / limit),
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Failed to fetch series",
      },
      { status: 500 },
    );
  }
}

// Get by id
export async function getSeriesByIdController(
  _: Request,
  params: { id: string },
) {
  try {
    if (!params?.id) {
      return Response.json(
        { success: false, message: "Invalid ID" },
        { status: 400 },
      );
    }
    const series = await prisma.content.findUnique({
      where: { id: params.id },
      include: {
        series: {
          include: {
            seasons: {
              orderBy: { seasonNumber: "asc" },
              include: {
                episodes: {
                  orderBy: { episodeNumber: "asc" },
                },
              },
            },
          },
        },
      },
    });

    if (!series || !series.series) {
      return Response.json(
        {
          success: false,
          message: "Series not found",
        },
        { status: 404 },
      );
    }

    return Response.json(
      {
        success: true,
        data: series,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Failed to fetch series",
      },
      { status: 500 },
    );
  }
}
