// /hooks/use-auth.ts

import { useMutation } from "@tanstack/react-query";
import { LoginInput, RegisterInput } from "@/validation/auth.validation";

async function loginApi(data: LoginInput) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Login failed");
  return res.json();
}

async function registerApi(data: RegisterInput) {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Register failed");
  return res.json();
}

export function useLogin() {
  return useMutation({
    mutationFn: loginApi,
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: registerApi,
  });
}
