"use client";

import BookmarkGrid from "@/components/BookmarkGrid";
import PageHeader from "@/components/PageHeader";
import { useBookmarks } from "@/context/BookmarkContext";

export default function Home() {
  const { bookmarks } = useBookmarks();

  return (
    <main className="flex-1 bg-[var(--background)] px-6 py-14 sm:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <PageHeader title="전체 북마크" count={bookmarks.length} />
        <BookmarkGrid bookmarks={bookmarks} />
      </div>
    </main>
  );
}
