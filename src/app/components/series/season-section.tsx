"use client";

import {
  Control,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
  useFieldArray,
} from "react-hook-form";

import { CreateSeriesInput } from "@/validation/series.validation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { EpisodeSection } from "./episode-section";

type Props = {
  seasonIndex: number;

  control: Control<CreateSeriesInput>;
  register: UseFormRegister<CreateSeriesInput>;

  setValue: UseFormSetValue<CreateSeriesInput>;
  watch: UseFormWatch<CreateSeriesInput>;

  removeSeason: (index: number) => void;
};

export function SeasonSection({
  seasonIndex,
  control,
  register,
  setValue,
  watch,
  removeSeason,
}: Props) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `seasons.${seasonIndex}.episodes`,
  });

  return (
    <section className="space-y-6 rounded-xl border p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Season {seasonIndex + 1}</h2>

        <Button
          type="button"
          variant="destructive"
          onClick={() => removeSeason(seasonIndex)}
        >
          Remove Season
        </Button>
      </div>

      <Input
        type="number"
        placeholder="Season Number"
        {...register(`seasons.${seasonIndex}.seasonNumber`)}
      />

      <div className="space-y-8">
        {fields.map((episode, episodeIndex) => (
          <EpisodeSection
            key={episode.id}
            seasonIndex={seasonIndex}
            episodeIndex={episodeIndex}
            register={register}
            setValue={setValue}
            watch={watch}
            removeEpisode={remove}
          />
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={() =>
          append({
            episodeNumber: fields.length + 1,
            title: "",
            description: "",
            duration: 0,
            videoUrl: "",
            thumbnailUrl: "",
          })
        }
      >
        Add Episode
      </Button>
    </section>
  );
}

export default SeasonSection;
