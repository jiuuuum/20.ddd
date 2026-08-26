"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  bookmarks as initialBookmarks,
  folders as initialFolders,
  type Bookmark,
  type Folder,
} from "@/data/bookmarks";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const BOOKMARKS_STORAGE_KEY = "bookmarks:list";
const FOLDERS_STORAGE_KEY = "bookmarks:folders";

type NewBookmark = {
  folderId: string;
  title: string;
  url: string;
  description: string;
  tags: string[];
};

function createId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}`;
}

type BookmarkContextValue = {
  bookmarks: Bookmark[];
  folders: Folder[];
  isModalOpen: boolean;
  defaultFolderId: string | null;
  openAddModal: (folderId?: string) => void;
  closeAddModal: () => void;
  addBookmark: (bookmark: NewBookmark) => void;
  isFolderModalOpen: boolean;
  openAddFolderModal: () => void;
  closeAddFolderModal: () => void;
  addFolder: (name: string) => void;
  folderPendingDeletion: Folder | null;
  requestDeleteFolder: (folder: Folder) => void;
  cancelDeleteFolder: () => void;
  confirmDeleteFolder: () => void;
  folderPendingEdit: Folder | null;
  requestEditFolder: (folder: Folder) => void;
  closeEditFolderModal: () => void;
  renameFolder: (name: string) => void;
};

const BookmarkContext = createContext<BookmarkContextValue | null>(null);

export function BookmarkProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [bookmarks, setBookmarks] = useLocalStorage<Bookmark[]>(
    BOOKMARKS_STORAGE_KEY,
    initialBookmarks
  );
  const [folders, setFolders] = useLocalStorage<Folder[]>(
    FOLDERS_STORAGE_KEY,
    initialFolders
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [defaultFolderId, setDefaultFolderId] = useState<string | null>(null);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [folderPendingDeletion, setFolderPendingDeletion] =
    useState<Folder | null>(null);
  const [folderPendingEdit, setFolderPendingEdit] = useState<Folder | null>(
    null
  );

  function openAddModal(folderId?: string) {
    setDefaultFolderId(folderId ?? null);
    setIsModalOpen(true);
  }

  function closeAddModal() {
    setIsModalOpen(false);
  }

  function addBookmark(bookmark: NewBookmark) {
    const newBookmark: Bookmark = {
      id: createId(),
      createdAt: new Date().toISOString().slice(0, 10),
      ...bookmark,
    };
    setBookmarks([newBookmark, ...bookmarks]);
    setIsModalOpen(false);
  }

  function openAddFolderModal() {
    setIsFolderModalOpen(true);
  }

  function closeAddFolderModal() {
    setIsFolderModalOpen(false);
  }

  function addFolder(name: string) {
    const newFolder: Folder = { id: createId(), name };
    setFolders([...folders, newFolder]);
    setIsFolderModalOpen(false);
  }

  function requestDeleteFolder(folder: Folder) {
    setFolderPendingDeletion(folder);
  }

  function cancelDeleteFolder() {
    setFolderPendingDeletion(null);
  }

  function confirmDeleteFolder() {
    if (!folderPendingDeletion) return;
    const folderId = folderPendingDeletion.id;
    setFolders(folders.filter((folder) => folder.id !== folderId));
    setBookmarks(bookmarks.filter((bookmark) => bookmark.folderId !== folderId));
    setFolderPendingDeletion(null);

    if (pathname === `/${folderId}`) {
      router.push("/");
    }
  }

  function requestEditFolder(folder: Folder) {
    setFolderPendingEdit(folder);
  }

  function closeEditFolderModal() {
    setFolderPendingEdit(null);
  }

  function renameFolder(name: string) {
    if (!folderPendingEdit) return;
    const folderId = folderPendingEdit.id;
    setFolders(
      folders.map((folder) =>
        folder.id === folderId ? { ...folder, name } : folder
      )
    );
    setFolderPendingEdit(null);
  }

  return (
    <BookmarkContext.Provider
      value={{
        bookmarks,
        folders,
        isModalOpen,
        defaultFolderId,
        openAddModal,
        closeAddModal,
        addBookmark,
        isFolderModalOpen,
        openAddFolderModal,
        closeAddFolderModal,
        addFolder,
        folderPendingDeletion,
        requestDeleteFolder,
        cancelDeleteFolder,
        confirmDeleteFolder,
        folderPendingEdit,
        requestEditFolder,
        closeEditFolderModal,
        renameFolder,
      }}
    >
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmarks() {
  const context = useContext(BookmarkContext);
  if (!context) {
    throw new Error("useBookmarks must be used within a BookmarkProvider");
  }
  return context;
}
