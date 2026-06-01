import api from "./axios";

import type { LoginInput, RegisterInput } from "@/validation/auth.validation";

export async function login(data: LoginInput) {
  console.log("AI HIT");
  const res = await api.post("/auth/login", data);
  return res.data;
}

export async function register(data: RegisterInput) {
  console.log("AI HIT");
  const res = await api.post("/auth/register", data);
  return res.data;
}

export async function logout() {
  console.log("AI HIT");
  const res = await api.post("/auth/logout");
  return res.data;
}

export async function getMe() {
  console.log("AI HIT");
  const res = await api.get("/auth/me");

  return res.data.data;
}
