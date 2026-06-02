import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CreateSeriesForm from "@/components/series/create-series-form";

export default function CreateSeriesPage() {
  return (
    <div className="mx-auto max-w-4xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Create Series</CardTitle>
        </CardHeader>

        <CardContent>
          <CreateSeriesForm />
        </CardContent>
      </Card>
    </div>
  );
}
