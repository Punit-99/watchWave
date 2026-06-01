import axios from "./axios";
import type { CreateMovieInput } from "@/validation/movie.validation";

/**
 * CREATE MOVIE
 */
export async function createMovie(data: CreateMovieInput) {
  const { data: res } = await axios.post("movies", data);
  return res;
}

/**
 * UPLOAD FILE (IMAGE / VIDEO)
 */
export async function uploadMedia(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await axios.post("upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data; // { url, publicId }
}

/**
 * DELETE FILE FROM CLOUDINARY
 */
export async function deleteMedia(publicId: string) {
  const { data } = await axios.delete("upload", {
    data: { publicId },
  });

  return data;
}
