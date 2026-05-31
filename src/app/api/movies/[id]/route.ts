import { deleteMovieController } from "@/src/app/controllers/movie.controller";
import { updateMovieController } from "@/src/app/controllers/movie.controller";
import { getMovieController } from "@/src/app/controllers/movie.controller";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  return deleteMovieController(req, { id });
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  return updateMovieController(req, { id });
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  return getMovieController(req, { id });
}
