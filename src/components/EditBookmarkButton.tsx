"use client";

import { useBookmarks } from "@/context/BookmarkContext";
import type { Bookmark } from "@/data/bookmarks";

type EditBookmarkButtonProps = {
  bookmark: Bookmark;
};

export default function EditBookmarkButton({
  bookmark,
}: EditBookmarkButtonProps) {
  const { requestEditBookmark } = useBookmarks();

  return (
    <button
      type="button"
      aria-label={`${bookmark.title} 수정`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        requestEditBookmark(bookmark);
      }}
      className="absolute right-9 top-2 flex h-7 w-7 items-center justify-center rounded-md bg-[var(--surface)] text-[var(--placeholder)] opacity-0 shadow-sm transition-opacity hover:bg-black/[0.06] hover:text-[var(--accent)] group-hover:opacity-100"
    >
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
      </svg>
    </button>
  );
}
