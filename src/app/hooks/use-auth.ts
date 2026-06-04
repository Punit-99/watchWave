import { useMutation, useQuery } from "@tanstack/react-query";

import { login, register, getMe, logout } from "@/lib/api/auth.api";

export function useLogin() {
  return useMutation({
    mutationFn: login,
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: register,
  });
}

export function useMe(enabled = true) {
  console.log("useMe mounted", enabled);

  return useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    retry: false,
    enabled,
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: logout,
  });
}
