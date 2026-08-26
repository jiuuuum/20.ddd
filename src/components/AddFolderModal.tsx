"use client";

import { useState, type FormEvent } from "react";
import { useBookmarks } from "@/context/BookmarkContext";
import type { Folder } from "@/data/bookmarks";

const BASE_FOLDER_NAME = "새폴더";

function getDefaultFolderName(folders: Folder[]) {
  const pattern = new RegExp(`^${BASE_FOLDER_NAME}(?: \\((\\d+)\\))?$`);
  let maxUsed = 0;
  let baseTaken = false;

  for (const folder of folders) {
    const match = folder.name.match(pattern);
    if (!match) continue;
    if (match[1]) {
      maxUsed = Math.max(maxUsed, Number(match[1]));
    } else {
      baseTaken = true;
    }
  }

  if (!baseTaken && maxUsed === 0) return BASE_FOLDER_NAME;
  return `${BASE_FOLDER_NAME} (${Math.max(maxUsed, 1) + 1})`;
}

export default function AddFolderModal() {
  const { isFolderModalOpen, folders } = useBookmarks();

  // Mounting a fresh form instance each time the modal opens keeps the
  // fields reset without needing an effect to sync them.
  if (!isFolderModalOpen) return null;

  return <AddFolderForm defaultName={getDefaultFolderName(folders)} />;
}

function AddFolderForm({ defaultName }: { defaultName: string }) {
  const { closeAddFolderModal, addFolder } = useBookmarks();

  const [name, setName] = useState(defaultName);
  const [error, setError] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!name.trim()) {
      setError("폴더 이름을 입력해주세요.");
      return;
    }

    addFolder(name.trim());
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={closeAddFolderModal}
    >
      <div className="card w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
        <h2 className="mb-5 text-lg font-semibold text-[var(--text)]">
          새 폴더
        </h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-1.5 text-sm text-[var(--text-sub)]">
            폴더 이름
            <input
              autoFocus
              onFocus={(e) => e.target.select()}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 업무"
              className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]"
            />
          </label>

          {error && <p className="text-sm text-[var(--error)]">{error}</p>}

          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={closeAddFolderModal}
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
