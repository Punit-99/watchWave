import { MediaCard } from "../common/media-card";
import { SectionHeader } from "./section-header";

type Item = {
  id: string;
  title: string;
  image: string;
  type: "MOVIE" | "SERIES";
  description?: string;
};

type Props = {
  title: string;
  items: Item[];
};

export function MediaSection({ title, items }: Props) {
  return (
    <section className="mt-14">
      <SectionHeader title={title} />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {items.map((item) => (
          <MediaCard
            key={item.id}
            id={item.id}
            title={item.title}
            image={item.image}
            type={item.type}
            description={item.description}
          />
        ))}
      </div>
    </section>
  );
}
