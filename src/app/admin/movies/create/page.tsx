import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { CreateMovieForm } from "@/components/movies/create-movie-form";

export default function CreateMoviePage() {
  return (
    <div className="mx-auto max-w-4xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Create Movie</CardTitle>
        </CardHeader>

        <CardContent>
          <CreateMovieForm />
        </CardContent>
      </Card>
    </div>
  );
}
