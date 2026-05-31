import { createMovieController } from "../../controllers/movie.controller";
import { getMoviesController } from "../../controllers/movie.controller";

export async function POST(req: Request) {
  return createMovieController(req);
}

export async function GET(req: Request) {
  return getMoviesController(req);
}
