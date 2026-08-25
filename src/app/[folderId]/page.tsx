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
    <main className="flex-1 bg-zinc-50 px-6 py-16 sm:px-8 dark:bg-black">
      <div className="mx-auto w-full max-w-5xl">
        <header className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
              {folder.name}
            </h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              저장한 링크 {folderBookmarks.length}개
            </p>
          </div>
          <button
            type="button"
            className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
          >
            + 북마크 추가
          </button>
        </header>

        <BookmarkGrid bookmarks={folderBookmarks} />
      </div>
    </main>
  );
}
