import BookmarkCard from "@/components/BookmarkCard";
import type { Bookmark } from "@/data/bookmarks";

type BookmarkGridProps = {
  bookmarks: Bookmark[];
};

export default function BookmarkGrid({ bookmarks }: BookmarkGridProps) {
  if (bookmarks.length === 0) {
    return (
      <p className="py-16 text-center text-sm text-[var(--text-sub)]">
        저장된 북마크가 없습니다.
      </p>
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {bookmarks.map((bookmark) => (
        <li key={bookmark.id}>
          <BookmarkCard bookmark={bookmark} />
        </li>
      ))}
    </ul>
  );
}
