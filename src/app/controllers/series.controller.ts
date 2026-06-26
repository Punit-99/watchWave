import { prisma } from "../lib/prisma";
import {
  createSeriesSchema,
  updateSeriesSchema,
} from "../validation/series.validation";

import { ZodError } from "zod";
import { deleteFromCloudinary } from "@/lib/cloudinary";
// Create
export async function createSeriesController(req: Request) {
  try {
    const body = await req.json();

    const data = createSeriesSchema.parse(body);

    const series = await prisma.content.create({
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

    // Clean up assets in Cloudinary
    try {
      const deletePromises = [];
      if (series.posterUrl) {
        deletePromises.push(deleteFromCloudinary(series.posterUrl, "image"));
      }
      if (series.bannerUrl) {
        deletePromises.push(deleteFromCloudinary(series.bannerUrl, "image"));
      }

      if (series.series.seasons) {
        for (const season of series.series.seasons) {
          if (season.episodes) {
            for (const episode of season.episodes) {
              if (episode.thumbnailUrl) {
                deletePromises.push(
                  deleteFromCloudinary(episode.thumbnailUrl, "image"),
                );
              }
              if (episode.videoUrl) {
                deletePromises.push(
                  deleteFromCloudinary(episode.videoUrl, "video"),
                );
              }
            }
          }
        }
      }

      await Promise.allSettled(deletePromises);
    } catch (cloudinaryError) {
      console.error("Cloudinary cleanup error:", cloudinaryError);
    }

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

export async function updateSeriesController(
  req: Request,
  params: { id: string },
) {
  try {
    const body = await req.json();
    const data = updateSeriesSchema.parse(body);

    const content = await prisma.content.findUnique({
      where: { id: params.id },
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

    if (!content || !content.series) {
      return Response.json(
        { success: false, message: "Series not found" },
        { status: 404 },
      );
    }

    const series = content.series;

    // =========================
    // UPDATE CONTENT (PATCH SAFE)
    // =========================
    await prisma.content.update({
      where: { id: params.id },

      data: {
        title: data.title ?? undefined,
        description: data.description ?? undefined,
        posterUrl: data.posterUrl ?? undefined,
        bannerUrl: data.bannerUrl ?? undefined,
        releaseYear: data.releaseYear ?? undefined,
        language: data.language ?? undefined,
        genre: data.genre ?? undefined,
        tags: data.tags ?? undefined,
        ageRating: data.ageRating ?? undefined,
      },
    });

    // =====================================
    // DIFFERENTIAL SYNC & CLOUDINARY CLEANUP
    // =====================================
    if (data.seasons) {
      const existingSeasons = series.seasons || [];
      const incomingSeasons = data.seasons;

      const deletePromises: Promise<any>[] = [];

      // 1. Identify deleted seasons and their episodes
      const incomingSeasonNumbers = new Set(
        incomingSeasons.map((s) => s.seasonNumber),
      );
      const seasonsToDelete = existingSeasons.filter(
        (s) => !incomingSeasonNumbers.has(s.seasonNumber),
      );

      for (const season of seasonsToDelete) {
        if (season.episodes) {
          for (const episode of season.episodes) {
            if (episode.videoUrl) {
              deletePromises.push(
                deleteFromCloudinary(episode.videoUrl, "video"),
              );
            }
            if (episode.thumbnailUrl) {
              deletePromises.push(
                deleteFromCloudinary(episode.thumbnailUrl, "image"),
              );
            }
          }
        }
      }

      // 2. Identify deleted episodes or updated media from remaining seasons
      for (const incomingSeason of incomingSeasons) {
        const existingSeason = existingSeasons.find(
          (s) => s.seasonNumber === incomingSeason.seasonNumber,
        );

        if (existingSeason && existingSeason.episodes) {
          const incomingEpisodeNumbers = new Set(
            incomingSeason.episodes?.map((e) => e.episodeNumber) || [],
          );

          // Episode deleted
          const episodesToDelete = existingSeason.episodes.filter(
            (e) => !incomingEpisodeNumbers.has(e.episodeNumber),
          );
          for (const episode of episodesToDelete) {
            if (episode.videoUrl) {
              deletePromises.push(
                deleteFromCloudinary(episode.videoUrl, "video"),
              );
            }
            if (episode.thumbnailUrl) {
              deletePromises.push(
                deleteFromCloudinary(episode.thumbnailUrl, "image"),
              );
            }
          }

          // Episode media updated
          if (incomingSeason.episodes) {
            for (const incomingEpisode of incomingSeason.episodes) {
              const existingEpisode = existingSeason.episodes.find(
                (e) => e.episodeNumber === incomingEpisode.episodeNumber,
              );
              if (existingEpisode) {
                if (
                  existingEpisode.videoUrl &&
                  existingEpisode.videoUrl !== incomingEpisode.videoUrl
                ) {
                  deletePromises.push(
                    deleteFromCloudinary(existingEpisode.videoUrl, "video"),
                  );
                }
                if (
                  existingEpisode.thumbnailUrl &&
                  existingEpisode.thumbnailUrl !== incomingEpisode.thumbnailUrl
                ) {
                  deletePromises.push(
                    deleteFromCloudinary(existingEpisode.thumbnailUrl, "image"),
                  );
                }
              }
            }
          }
        }
      }

      // Sync replaced series poster/banner
      if (
        data.posterUrl !== undefined &&
        content.posterUrl &&
        content.posterUrl !== data.posterUrl
      ) {
        deletePromises.push(deleteFromCloudinary(content.posterUrl, "image"));
      }
      if (
        data.bannerUrl !== undefined &&
        content.bannerUrl &&
        content.bannerUrl !== data.bannerUrl
      ) {
        deletePromises.push(deleteFromCloudinary(content.bannerUrl, "image"));
      }

      // Delete from Cloudinary
      try {
        await Promise.allSettled(deletePromises);
      } catch (cloudinaryError) {
        console.error(
          "Cloudinary cleanup error during series update:",
          cloudinaryError,
        );
      }

      // 3. Database Modifications
      if (seasonsToDelete.length > 0) {
        await prisma.season.deleteMany({
          where: {
            id: { in: seasonsToDelete.map((s) => s.id) },
          },
        });
      }

      for (const incomingSeason of incomingSeasons) {
        const existingSeason = existingSeasons.find(
          (s) => s.seasonNumber === incomingSeason.seasonNumber,
        );

        if (existingSeason) {
          // Delete episodes that are no longer present
          const incomingEpisodeNumbers = new Set(
            incomingSeason.episodes?.map((e) => e.episodeNumber) || [],
          );
          const episodesToDelete = existingSeason.episodes.filter(
            (e) => !incomingEpisodeNumbers.has(e.episodeNumber),
          );

          if (episodesToDelete.length > 0) {
            await prisma.episode.deleteMany({
              where: {
                id: { in: episodesToDelete.map((e) => e.id) },
              },
            });
          }

          // Create/update remaining episodes
          if (incomingSeason.episodes) {
            for (const incomingEpisode of incomingSeason.episodes) {
              const existingEpisode = existingSeason.episodes.find(
                (e) => e.episodeNumber === incomingEpisode.episodeNumber,
              );

              if (existingEpisode) {
                await prisma.episode.update({
                  where: { id: existingEpisode.id },
                  data: {
                    title: incomingEpisode.title,
                    description: incomingEpisode.description ?? null,
                    duration: incomingEpisode.duration,
                    videoUrl: incomingEpisode.videoUrl,
                    thumbnailUrl: incomingEpisode.thumbnailUrl,
                  },
                });
              } else {
                await prisma.episode.create({
                  data: {
                    seasonId: existingSeason.id,
                    episodeNumber: incomingEpisode.episodeNumber,
                    title: incomingEpisode.title,
                    description: incomingEpisode.description ?? null,
                    duration: incomingEpisode.duration,
                    videoUrl: incomingEpisode.videoUrl,
                    thumbnailUrl: incomingEpisode.thumbnailUrl,
                  },
                });
              }
            }
          }
        } else {
          // Create new season and episodes
          await prisma.season.create({
            data: {
              seriesId: series.id,
              seasonNumber: incomingSeason.seasonNumber,
              episodes: {
                create:
                  incomingSeason.episodes?.map((ep) => ({
                    episodeNumber: ep.episodeNumber,
                    title: ep.title,
                    description: ep.description ?? null,
                    duration: ep.duration,
                    videoUrl: ep.videoUrl,
                    thumbnailUrl: ep.thumbnailUrl,
                  })) || [],
              },
            },
          });
        }
      }

      // Update totalSeasons count on Series
      await prisma.series.update({
        where: { id: series.id },
        data: {
          totalSeasons: incomingSeasons.length,
        },
      });
    }

    // =========================
    // RETURN FULL UPDATED DATA
    // =========================
    const finalData = await prisma.content.findUnique({
      where: { id: params.id },
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
        data: finalData,
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
