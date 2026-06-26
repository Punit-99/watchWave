"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams, useRouter } from "next/navigation";

import { useGetMovieById, useUpdateMovie } from "@/hooks/use-movie";
import { MovieForm } from "@/components/movies/MovieForm";
import { Genre, Language, AgeRating } from "@/../../generated/prisma/enums";

export default function EditMoviePage() {
  const { id } = useParams();
  const router = useRouter();

  const { data, isLoading } = useGetMovieById(id as string);
  const { mutate, isPending } = useUpdateMovie();

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center text-muted-foreground animate-pulse">
        Loading...
      </div>
    );
  }

  if (!data?.data) {
    return <div>Movie not found</div>;
  }

  const movie = data.data;

  return (
    <div className="mx-auto max-w-4xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Edit Movie</CardTitle>
        </CardHeader>

        <CardContent>
          <MovieForm
            mode="edit"
            isPending={isPending}
            initialData={{
              title: movie.title,
              description: movie.description,
              posterUrl: movie.posterUrl,
              bannerUrl: movie.bannerUrl,
              videoUrl: movie.movie.videoUrl,
              releaseYear: movie.releaseYear,
              language: movie.language as Language[],
              genre: movie.genre as Genre[],
              tags: movie.tags,
              ageRating: movie.ageRating as AgeRating,
              duration: movie.movie.duration,
            }}
            onSubmit={(values) => {
              mutate(
                {
                  id: id as string,
                  data: values,
                },
                {
                  onSuccess: () => {
                    router.push("/admin/movies");
                  },
                },
              );
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
