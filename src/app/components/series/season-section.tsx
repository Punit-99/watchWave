"use client";

import { useEffect } from "react";
import {
  Control,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
  useFieldArray,
} from "react-hook-form";

import { CreateSeriesInput } from "@/validation/series.validation";

import { Button } from "@/components/ui/button";
import { EpisodeSection } from "./episode-section";
import { Plus, Trash2 } from "lucide-react";

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

  useEffect(() => {
    setValue(`seasons.${seasonIndex}.seasonNumber`, seasonIndex + 1);
  }, [seasonIndex, setValue]);

  return (
    <section className="space-y-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20 p-6 shadow-sm">
      <div className="flex items-center justify-between border-b pb-3 border-zinc-200/80 dark:border-zinc-800/85">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-zinc-900 text-[10px] font-bold text-white dark:bg-white dark:text-zinc-950">
            S{seasonIndex + 1}
          </span>
          <h4 className="text-sm font-semibold tracking-wide uppercase text-zinc-700 dark:text-zinc-300">
            Season {seasonIndex + 1}
          </h4>
        </div>

        <Button
          type="button"
          variant="outline"
          className="h-8 rounded-lg text-xs hover:bg-red-500/10 hover:text-red-500 transition-colors border-zinc-200 dark:border-zinc-800"
          onClick={() => removeSeason(seasonIndex)}
        >
          <Trash2 className="mr-1 h-3.5 w-3.5" />
          <span>Remove Season</span>
        </Button>
      </div>

      <input
        type="hidden"
        {...register(`seasons.${seasonIndex}.seasonNumber`, {
          valueAsNumber: true,
        })}
      />

      <div className="space-y-6">
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
        className="w-full h-10 border-dashed rounded-xl flex items-center justify-center gap-2 hover:bg-background transition-colors text-xs font-semibold"
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
        <Plus className="h-3.5 w-3.5" />
        <span>Add Episode</span>
      </Button>
    </section>
  );
}

export default SeasonSection;
