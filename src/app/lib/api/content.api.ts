import api from "../axios";

export async function getContentById(id: string): Promise<any> {
  const { data } = await api.get(`/content/${id}`);
  return data;
}
