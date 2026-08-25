import BookmarkGrid from "@/components/BookmarkGrid";
import { bookmarks } from "@/data/bookmarks";

export default function Home() {
  return (
    <main className="flex-1 bg-[var(--background)] px-6 py-14 sm:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <header className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-[28px] font-semibold tracking-[-0.3px] text-[var(--text)]">
              전체 북마크
            </h1>
            <p className="mt-1 text-sm text-[var(--text-sub)]">
              저장한 링크 {bookmarks.length}개
            </p>
          </div>
          <button type="button" className="btn-primary">
            + 북마크 추가
          </button>
        </header>

        <BookmarkGrid bookmarks={bookmarks} />
      </div>
    </main>
  );
}
