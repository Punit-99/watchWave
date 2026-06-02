import api from "../axios";

export async function uploadMedia(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await api.post("upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
}

export async function deleteMedia(publicId: string) {
  const { data } = await api.delete("upload/delete", {
    data: { publicId },
  });

  return data;
}
