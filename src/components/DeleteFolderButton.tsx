"use client";

import { useBookmarks } from "@/context/BookmarkContext";
import type { Folder } from "@/data/bookmarks";

type DeleteFolderButtonProps = {
  folder: Folder;
};

export default function DeleteFolderButton({ folder }: DeleteFolderButtonProps) {
  const { requestDeleteFolder } = useBookmarks();

  return (
    <button
      type="button"
      aria-label={`${folder.name} 폴더 삭제`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        requestDeleteFolder(folder);
      }}
      className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-[var(--placeholder)] opacity-0 transition-opacity hover:bg-black/[0.06] hover:text-[var(--error)] group-hover:opacity-100"
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
