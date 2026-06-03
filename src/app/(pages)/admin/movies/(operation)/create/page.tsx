"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { MovieForm } from "@/components/movies/MovieForm";
import { useCreateMovie } from "@/hooks/use-movie";

export default function CreateMoviePage() {
  const { mutate, isPending } = useCreateMovie();

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
              mutate(data);
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
