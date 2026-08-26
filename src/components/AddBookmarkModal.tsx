"use client";

import { useState, type FormEvent } from "react";
import { useBookmarks } from "@/context/BookmarkContext";
import type { OpenGraphData } from "@/lib/openGraph";

export default function AddBookmarkModal() {
  const { isModalOpen } = useBookmarks();

  // Mounting a fresh form instance each time the modal opens keeps the
  // fields reset without needing an effect to sync them.
  if (!isModalOpen) return null;

  return <AddBookmarkForm />;
}

function fallbackTitle(url: string) {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

async function fetchOpenGraph(url: string): Promise<OpenGraphData> {
  const response = await fetch(`/api/og?url=${encodeURIComponent(url)}`);
  if (!response.ok) {
    return { title: null, description: null, thumbnail: null };
  }
  return response.json();
}

function AddBookmarkForm() {
  const { closeAddModal, addBookmark, folders, defaultFolderId } =
    useBookmarks();

  const [url, setUrl] = useState("");
  const [tags, setTags] = useState("");
  const [folderId, setFolderId] = useState(
    defaultFolderId ?? folders[0]?.id ?? ""
  );
  const [error, setError] = useState("");
  const [isFetching, setIsFetching] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!url.trim()) {
      setError("URL을 입력해주세요.");
      return;
    }

    let normalizedUrl = url.trim();
    if (!/^https?:\/\//i.test(normalizedUrl)) {
      normalizedUrl = `https://${normalizedUrl}`;
    }

    setError("");
    setIsFetching(true);

    const og = await fetchOpenGraph(normalizedUrl).catch(() => ({
      title: null,
      description: null,
      thumbnail: null,
    }));

    setIsFetching(false);

    addBookmark({
      folderId,
      title: og.title ?? fallbackTitle(normalizedUrl),
      url: normalizedUrl,
      description: og.description ?? "",
      thumbnail: og.thumbnail ?? undefined,
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
        <h2 className="mb-1 text-lg font-semibold text-[var(--text)]">
          북마크 추가
        </h2>
        <p className="mb-5 text-xs text-[var(--text-sub)]">
          URL만 입력하면 제목·설명·썸네일을 자동으로 가져와요.
        </p>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-1.5 text-sm text-[var(--text-sub)]">
            URL
            <input
              autoFocus
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              disabled={isFetching}
              className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)] disabled:opacity-60"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm text-[var(--text-sub)]">
            폴더
            <select
              value={folderId}
              onChange={(e) => setFolderId(e.target.value)}
              disabled={isFetching}
              className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)] disabled:opacity-60"
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
              disabled={isFetching}
              className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)] disabled:opacity-60"
            />
          </label>

          {error && <p className="text-sm text-[var(--error)]">{error}</p>}

          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={closeAddModal}
              disabled={isFetching}
              className="rounded-full px-5 py-2.5 text-sm font-medium text-[var(--text-sub)] hover:bg-black/[0.04] disabled:opacity-60"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isFetching}
              className="btn-primary text-sm"
            >
              {isFetching ? "가져오는 중..." : "추가"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
