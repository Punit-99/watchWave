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

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    retry: false,
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: logout,
  });
}
