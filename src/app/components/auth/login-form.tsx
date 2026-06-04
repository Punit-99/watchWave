"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "@/validation/auth.validation";
import { useLogin } from "@/hooks/use-auth";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import PasswordInput from "../ui/password-input";
import { useAuthStore } from "@/lib/store/auth.store";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const { mutate, isPending } = useLogin();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginInput) => {
    mutate(data, {
      onSuccess: (res) => {
        const user = res?.data;
        useAuthStore.getState().setUser(user);
        console.log("GETTED USER:", useAuthStore.getState().user);

        if (user.role === "ADMIN") {
          router.push("/admin/dashboard");
        } else {
          router.push("/");
        }
      },
      onError: (err) => {
        console.log(err);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Input placeholder="Email" {...register("email")} />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div>
        <PasswordInput placeholder="Password" {...register("password")} />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      <Button className="w-full" type="submit" disabled={isPending}>
        {isPending ? "Logging in..." : "Login"}
      </Button>
    </form>
  );
}
