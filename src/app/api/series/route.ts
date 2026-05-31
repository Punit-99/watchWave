import {
  getSeriesController,
  createSeriesController,
} from "@/controllers/series.controller";

// GET
export async function GET(req: Request) {
  return getSeriesController(req);
}

// POST
export async function POST(req: Request) {
  return createSeriesController(req);
}
