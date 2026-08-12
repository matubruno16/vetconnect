import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  hasMore: boolean;
  basePath: string;
  searchParams: Record<string, string | undefined>;
}

function buildHref(
  basePath: string,
  searchParams: Record<string, string | undefined>,
  page: number,
) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams)) {
    if (value && key !== "page") {
      params.set(key, value);
    }
  }

  if (page > 1) {
    params.set("page", String(page));
  }

  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}

export function Pagination({
  page,
  hasMore,
  basePath,
  searchParams,
}: PaginationProps) {
  if (page === 1 && !hasMore) {
    return null;
  }

  return (
    <div className="mt-8 flex items-center justify-center gap-3">
      {page > 1 ? (
        <Link
          href={buildHref(basePath, searchParams, page - 1)}
          className="inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium hover:bg-muted"
        >
          <ChevronLeft size={16} />
          Anterior
        </Link>
      ) : (
        <span className="inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium text-muted-foreground opacity-50">
          <ChevronLeft size={16} />
          Anterior
        </span>
      )}

      <span className="text-sm text-muted-foreground">Página {page}</span>

      {hasMore ? (
        <Link
          href={buildHref(basePath, searchParams, page + 1)}
          className="inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium hover:bg-muted"
        >
          Siguiente
          <ChevronRight size={16} />
        </Link>
      ) : (
        <span className="inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium text-muted-foreground opacity-50">
          Siguiente
          <ChevronRight size={16} />
        </span>
      )}
    </div>
  );
}
