"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useCreateSeries } from "@/hooks/use-series";
import { useRouter } from "next/navigation";

import { SeriesForm } from "@/components/series/SeriesForm";
import { CreateSeriesInput } from "@/validation/series.validation";

export default function CreateSeriesPage() {
  const router = useRouter();

  const { mutate, isPending } = useCreateSeries();

  return (
    <div className="mx-auto max-w-4xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Create Series</CardTitle>
        </CardHeader>

        <CardContent>
          <SeriesForm
            mode="create"
            isPending={isPending}
            onSubmit={(data) => {
              console.log("PAGE RECEIVED SERIES", data);

              mutate(data as CreateSeriesInput, {
                onSuccess: () => {
                  router.push("/admin/series");
                },
              });
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
