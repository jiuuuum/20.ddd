import { notFound } from "next/navigation";
import BookmarkGrid from "@/components/BookmarkGrid";
import { getBookmarksByFolder, getFolder } from "@/data/bookmarks";

type FolderPageProps = {
  params: Promise<{ folderId: string }>;
};

export default async function FolderPage({ params }: FolderPageProps) {
  const { folderId } = await params;
  const folder = getFolder(folderId);

  if (!folder) {
    notFound();
  }

  const folderBookmarks = getBookmarksByFolder(folderId);

  return (
    <main className="flex-1 bg-[var(--background)] px-6 py-14 sm:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <header className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-[28px] font-semibold tracking-[-0.3px] text-[var(--text)]">
              {folder.name}
            </h1>
            <p className="mt-1 text-sm text-[var(--text-sub)]">
              저장한 링크 {folderBookmarks.length}개
            </p>
          </div>
          <button type="button" className="btn-primary">
            + 북마크 추가
          </button>
        </header>

        <BookmarkGrid bookmarks={folderBookmarks} />
      </div>
    </main>
  );
}
