import { createMovieController } from "../../controller/movie.controller";
import { getMoviesController } from "../../controller/movie.controller";

export async function POST(req: Request) {
  return createMovieController(req);
}

export async function GET(req: Request) {
  return getMoviesController(req);
}
