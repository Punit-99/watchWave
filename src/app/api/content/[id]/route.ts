import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!id) {
      return Response.json(
        { success: false, message: "Invalid ID" },
        { status: 400 },
      );
    }

    const content = await prisma.content.findUnique({
      where: { id },
      include: {
        movie: true,
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

    if (!content) {
      return Response.json(
        { success: false, message: "Content not found" },
        { status: 404 },
      );
    }

    return Response.json({ success: true, data: content }, { status: 200 });
  } catch (error: any) {
    return Response.json(
      { success: false, message: error.message || "Failed to fetch content" },
      { status: 500 },
    );
  }
}
