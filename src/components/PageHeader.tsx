"use client";

import { useBookmarks } from "@/context/BookmarkContext";

type PageHeaderProps = {
  title: string;
  count: number;
  folderId?: string;
};

export default function PageHeader({ title, count, folderId }: PageHeaderProps) {
  const { openAddModal, openAddFolderModal } = useBookmarks();

  return (
    <header className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-[28px] font-semibold tracking-[-0.3px] text-[var(--text)]">
          {title}
        </h1>
        <p className="mt-1 text-sm text-[var(--text-sub)]">
          저장한 링크 {count}개
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="btn-secondary"
          onClick={() => openAddFolderModal()}
        >
          + 새 폴더
        </button>
        <button
          type="button"
          className="btn-primary"
          onClick={() => openAddModal(folderId)}
        >
          + 북마크 추가
        </button>
      </div>
    </header>
  );
}
