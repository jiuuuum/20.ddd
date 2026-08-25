import { faviconUrl } from "@/lib/favicon";
import type { Bookmark } from "@/data/bookmarks";

type BookmarkCardProps = {
  bookmark: Bookmark;
};

export default function BookmarkCard({ bookmark }: BookmarkCardProps) {
  return (
    <a
      href={bookmark.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex h-full flex-col gap-3 rounded-xl border border-black/[.08] bg-white p-4 transition-colors hover:border-transparent hover:bg-black/[.03] dark:border-white/[.145] dark:bg-zinc-950 dark:hover:bg-[#1a1a1a]"
    >
      <div className="flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={faviconUrl(bookmark.url)}
          alt=""
          width={32}
          height={32}
          className="h-8 w-8 shrink-0 rounded"
        />
        <h2 className="min-w-0 truncate text-base font-medium text-black dark:text-zinc-50">
          {bookmark.title}
        </h2>
      </div>
      <p className="truncate text-sm text-zinc-500 dark:text-zinc-400">
        {bookmark.url}
      </p>
      <p className="line-clamp-2 flex-1 text-sm text-zinc-600 dark:text-zinc-400">
        {bookmark.description}
      </p>
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          {bookmark.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-black/[.06] px-2 py-0.5 text-xs text-zinc-600 dark:bg-white/[.08] dark:text-zinc-300"
            >
              {tag}
            </span>
          ))}
        </div>
        <time className="shrink-0 text-xs text-zinc-400">
          {bookmark.createdAt}
        </time>
      </div>
    </a>
  );
}
