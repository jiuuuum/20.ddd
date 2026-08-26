import { faviconUrl } from "@/lib/favicon";
import DeleteBookmarkButton from "@/components/DeleteBookmarkButton";
import EditBookmarkButton from "@/components/EditBookmarkButton";
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
      className="card group relative flex h-full flex-col gap-3"
    >
      <EditBookmarkButton bookmark={bookmark} />
      <DeleteBookmarkButton bookmark={bookmark} />
      {bookmark.thumbnail && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={bookmark.thumbnail}
          alt=""
          className="h-32 w-full rounded-lg object-cover"
        />
      )}
      <div className="flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={faviconUrl(bookmark.url)}
          alt=""
          width={32}
          height={32}
          className="h-8 w-8 shrink-0 rounded"
        />
        <h2 className="min-w-0 truncate text-base font-medium text-[var(--text)]">
          {bookmark.title}
        </h2>
      </div>
      <p className="truncate text-sm text-[var(--text-sub)]">
        {bookmark.url}
      </p>
      <p className="line-clamp-2 flex-1 text-sm text-[var(--text-sub)]">
        {bookmark.description}
      </p>
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          {bookmark.tags.map((tag) => (
            <span key={tag} className="badge">
              {tag}
            </span>
          ))}
        </div>
        <time className="shrink-0 text-xs text-[var(--placeholder)]">
          {bookmark.createdAt}
        </time>
      </div>
    </a>
  );
}
