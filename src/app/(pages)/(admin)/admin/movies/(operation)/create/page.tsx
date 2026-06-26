"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { MovieForm } from "@/components/movies/MovieForm";
import { useCreateMovie } from "@/hooks/use-movie";
import { CreateMovieInput } from "@/validation/movie.validation";
import { useRouter } from "next/navigation";
import { appToast } from "@/lib/toast";

export default function CreateMoviePage() {
  const { mutate, isPending } = useCreateMovie();
  const router = useRouter();

  return (
    <div className="mx-auto max-w-4xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Create Movie</CardTitle>
        </CardHeader>

        <CardContent>
          <MovieForm
            mode="create"
            isPending={isPending}
            onSubmit={(data) => {
              console.log("PAGE RECEIVED", data);
              mutate(data as CreateMovieInput, {
                onSuccess: () => {
                  appToast.created("Movie");
                  router.push("/admin/movies");
                },
                onError: (err: any) => {
                  appToast.error(
                    err?.response?.data?.message ?? "Failed to create movie",
                  );
                },
              });
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
