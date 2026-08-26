"use client";

import Link from "next/link";
import BookmarkGrid from "@/components/BookmarkGrid";
import PageHeader from "@/components/PageHeader";
import { useBookmarks } from "@/context/BookmarkContext";

type FolderViewProps = {
  folderId: string;
};

export default function FolderView({ folderId }: FolderViewProps) {
  const { bookmarks, folders } = useBookmarks();
  const folder = folders.find((item) => item.id === folderId);
  const folderBookmarks = bookmarks.filter(
    (bookmark) => bookmark.folderId === folderId
  );

  if (!folder) {
    return (
      <main className="flex-1 bg-[var(--background)] px-6 py-14 sm:px-8">
        <div className="mx-auto w-full max-w-5xl">
          <p className="mb-4 text-sm text-[var(--text-sub)]">
            폴더를 찾을 수 없습니다.
          </p>
          <Link href="/" className="btn-primary inline-block">
            전체 북마크로 이동
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-[var(--background)] px-6 py-14 sm:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <PageHeader
          title={folder.name}
          count={folderBookmarks.length}
          folderId={folderId}
        />
        <BookmarkGrid bookmarks={folderBookmarks} />
      </div>
    </main>
  );
}
