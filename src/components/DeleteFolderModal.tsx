"use client";

import { useBookmarks } from "@/context/BookmarkContext";

export default function DeleteFolderModal() {
  const { folderPendingDeletion, cancelDeleteFolder, confirmDeleteFolder } =
    useBookmarks();

  if (!folderPendingDeletion) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={cancelDeleteFolder}
    >
      <div className="card w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
        <h2 className="mb-2 text-lg font-semibold text-[var(--text)]">
          폴더 삭제
        </h2>
        <p className="mb-6 text-sm text-[var(--text-sub)]">
          &apos;{folderPendingDeletion.name}&apos; 폴더를 삭제하시겠습니까?
          <br />
          폴더 안의 북마크도 함께 삭제되며 되돌릴 수 없습니다.
        </p>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={cancelDeleteFolder}
            className="rounded-full px-5 py-2.5 text-sm font-medium text-[var(--text-sub)] hover:bg-black/[0.04]"
          >
            취소
          </button>
          <button
            type="button"
            onClick={confirmDeleteFolder}
            className="btn-danger text-sm"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}
