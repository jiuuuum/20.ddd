"use client";

import { useBookmarks } from "@/context/BookmarkContext";

export default function DeleteBookmarkModal() {
  const { bookmarkPendingDeletion, cancelDeleteBookmark, confirmDeleteBookmark } =
    useBookmarks();

  if (!bookmarkPendingDeletion) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={cancelDeleteBookmark}
    >
      <div className="card w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
        <h2 className="mb-2 text-lg font-semibold text-[var(--text)]">
          링크 삭제
        </h2>
        <p className="mb-6 text-sm text-[var(--text-sub)]">
          &apos;{bookmarkPendingDeletion.title}&apos; 링크를 삭제하시겠습니까?
          <br />
          삭제 후에는 되돌릴 수 없습니다.
        </p>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={cancelDeleteBookmark}
            className="rounded-full px-5 py-2.5 text-sm font-medium text-[var(--text-sub)] hover:bg-black/[0.04]"
          >
            취소
          </button>
          <button
            type="button"
            onClick={confirmDeleteBookmark}
            className="btn-danger text-sm"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}
