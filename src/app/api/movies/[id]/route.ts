import { deleteMovieController } from "@/controllers/movie.controller";
import { updateMovieController } from "@/controllers/movie.controller";
import { getMovieByIdController } from "@/controllers/movie.controller";

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

  return getMovieByIdController(req, { id });
}
