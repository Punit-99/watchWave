import Link from "next/link";

type Props = {
  title: string;
  href?: string;
};

export function SectionHeader({ title, href }: Props) {
  return (
    <div className="mb-5 flex items-center justify-between">
      <h2 className="text-2xl font-bold">{title}</h2>

      {href && (
        <Link
          href={href}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          View All
        </Link>
      )}
    </div>
  );
}
