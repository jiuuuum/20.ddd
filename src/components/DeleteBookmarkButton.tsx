"use client";

import { useBookmarks } from "@/context/BookmarkContext";
import type { Bookmark } from "@/data/bookmarks";

type DeleteBookmarkButtonProps = {
  bookmark: Bookmark;
};

export default function DeleteBookmarkButton({
  bookmark,
}: DeleteBookmarkButtonProps) {
  const { requestDeleteBookmark } = useBookmarks();

  return (
    <button
      type="button"
      aria-label={`${bookmark.title} 삭제`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        requestDeleteBookmark(bookmark);
      }}
      className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-md bg-[var(--surface)] text-[var(--placeholder)] opacity-0 shadow-sm transition-opacity hover:bg-black/[0.06] hover:text-[var(--error)] group-hover:opacity-100"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 6h18" />
        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
        <path d="M10 11v6" />
        <path d="M14 11v6" />
      </svg>
    </button>
  );
}
