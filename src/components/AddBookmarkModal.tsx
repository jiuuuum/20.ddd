"use client";

import { useState, type FormEvent } from "react";
import { useBookmarks } from "@/context/BookmarkContext";

export default function AddBookmarkModal() {
  const { isModalOpen } = useBookmarks();

  // Mounting a fresh form instance each time the modal opens keeps the
  // fields reset without needing an effect to sync them.
  if (!isModalOpen) return null;

  return <AddBookmarkForm />;
}

function AddBookmarkForm() {
  const { closeAddModal, addBookmark, folders, defaultFolderId } =
    useBookmarks();

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [folderId, setFolderId] = useState(
    defaultFolderId ?? folders[0]?.id ?? ""
  );
  const [error, setError] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!title.trim() || !url.trim()) {
      setError("제목과 URL은 필수입니다.");
      return;
    }

    let normalizedUrl = url.trim();
    if (!/^https?:\/\//i.test(normalizedUrl)) {
      normalizedUrl = `https://${normalizedUrl}`;
    }

    addBookmark({
      folderId,
      title: title.trim(),
      url: normalizedUrl,
      description: description.trim(),
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={closeAddModal}
    >
      <div
        className="card w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-5 text-lg font-semibold text-[var(--text)]">
          북마크 추가
        </h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-1.5 text-sm text-[var(--text-sub)]">
            제목
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: Next.js Documentation"
              className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm text-[var(--text-sub)]">
            URL
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm text-[var(--text-sub)]">
            설명
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="간단한 설명"
              className="resize-none rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm text-[var(--text-sub)]">
            폴더
            <select
              value={folderId}
              onChange={(e) => setFolderId(e.target.value)}
              className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]"
            >
              {folders.map((folder) => (
                <option key={folder.id} value={folder.id}>
                  {folder.name}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5 text-sm text-[var(--text-sub)]">
            태그 (쉼표로 구분)
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Docs, Tool"
              className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]"
            />
          </label>

          {error && <p className="text-sm text-[var(--error)]">{error}</p>}

          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={closeAddModal}
              className="rounded-full px-5 py-2.5 text-sm font-medium text-[var(--text-sub)] hover:bg-black/[0.04]"
            >
              취소
            </button>
            <button type="submit" className="btn-primary text-sm">
              추가
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
