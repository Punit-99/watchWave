import {
  getSeriesByIdController,
  updateSeriesController,
  deleteSeriesController,
} from "@/controllers/series.controller";

// delete
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  return deleteSeriesController(req, { id });
}

// update
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  return updateSeriesController(req, { id });
}

// get by id
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  return getSeriesByIdController(req, { id });
}
