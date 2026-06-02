import axios from "./axios";
import type { CreateMovieInput } from "@/validation/movie.validation";

export async function createMovie(data: CreateMovieInput) {
  const { data: res } = await axios.post("movies", data);
  return res;
}

export async function uploadMedia(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await axios.post("upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
}

export async function deleteMedia(publicId: string) {
  const { data } = await axios.delete("upload/delete", {
    data: { publicId },
  });

  return data;
}
