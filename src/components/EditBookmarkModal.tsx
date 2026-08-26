"use client";

import { useState, type FormEvent } from "react";
import { useBookmarks } from "@/context/BookmarkContext";
import type { Bookmark } from "@/data/bookmarks";

export default function EditBookmarkModal() {
  const { bookmarkPendingEdit } = useBookmarks();

  // Mounting a fresh form instance each time the modal opens keeps the
  // fields synced to the bookmark being edited without needing an effect.
  if (!bookmarkPendingEdit) return null;

  return <EditBookmarkForm bookmark={bookmarkPendingEdit} />;
}

function EditBookmarkForm({ bookmark }: { bookmark: Bookmark }) {
  const { closeEditBookmarkModal, editBookmark } = useBookmarks();

  const [title, setTitle] = useState(bookmark.title);
  const [description, setDescription] = useState(bookmark.description);
  const [error, setError] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!title.trim()) {
      setError("제목을 입력해주세요.");
      return;
    }

    editBookmark({ title: title.trim(), description: description.trim() });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={closeEditBookmarkModal}
    >
      <div
        className="card w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-5 text-lg font-semibold text-[var(--text)]">
          링크 수정
        </h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-1.5 text-sm text-[var(--text-sub)]">
            제목
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="링크 제목"
              className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm text-[var(--text-sub)]">
            설명
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="링크 설명"
              rows={3}
              className="resize-none rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]"
            />
          </label>

          {error && <p className="text-sm text-[var(--error)]">{error}</p>}

          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={closeEditBookmarkModal}
              className="rounded-full px-5 py-2.5 text-sm font-medium text-[var(--text-sub)] hover:bg-black/[0.04]"
            >
              취소
            </button>
            <button type="submit" className="btn-primary text-sm">
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
