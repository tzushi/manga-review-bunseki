import { Link } from "react-router-dom";

interface ReviewCardProps {
  id: string;
  title: string;
  coverImage: string;
  summary: string;
  date: string;
}

export const ReviewCard = ({
  id,
  title,
  coverImage,
  summary,
  date,
}: ReviewCardProps) => {
  return (
    <Link to={`/review/${id}`} className="block">
      <div className="card-hover group rounded-xl border bg-card p-4 transition-all">
        <div className="aspect-[16/9] overflow-hidden rounded-lg">
          <img
            src={coverImage}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <div className="mt-4">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
              新着レビュー
            </span>
            <span className="text-sm text-muted-foreground">{date}</span>
          </div>
          <h3 className="mt-2 text-xl font-semibold tracking-tight">{title}</h3>
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
            {summary}
          </p>
        </div>
      </div>
    </Link>
  );
};
