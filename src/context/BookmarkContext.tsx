"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  bookmarks as initialBookmarks,
  type Bookmark,
  type Folder,
} from "@/data/bookmarks";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { createClient } from "@/utils/supabase/client";

const BOOKMARKS_STORAGE_KEY = "bookmarks:list";

type NewBookmark = {
  folderId: string;
  title: string;
  url: string;
  description: string;
  thumbnail?: string;
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
  isAddingFolder: boolean;
  folderPendingDeletion: Folder | null;
  requestDeleteFolder: (folder: Folder) => void;
  cancelDeleteFolder: () => void;
  confirmDeleteFolder: () => void;
  folderPendingEdit: Folder | null;
  requestEditFolder: (folder: Folder) => void;
  closeEditFolderModal: () => void;
  renameFolder: (name: string) => void;
  bookmarkPendingDeletion: Bookmark | null;
  requestDeleteBookmark: (bookmark: Bookmark) => void;
  cancelDeleteBookmark: () => void;
  confirmDeleteBookmark: () => void;
  bookmarkPendingEdit: Bookmark | null;
  requestEditBookmark: (bookmark: Bookmark) => void;
  closeEditBookmarkModal: () => void;
  editBookmark: (fields: { title: string; description: string }) => void;
};

const BookmarkContext = createContext<BookmarkContextValue | null>(null);

export function BookmarkProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [bookmarks, setBookmarks] = useLocalStorage<Bookmark[]>(
    BOOKMARKS_STORAGE_KEY,
    initialBookmarks
  );
  const [folders, setFolders] = useState<Folder[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [defaultFolderId, setDefaultFolderId] = useState<string | null>(null);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const isAddingFolderRef = useRef(false);
  const [folderPendingDeletion, setFolderPendingDeletion] =
    useState<Folder | null>(null);
  const [folderPendingEdit, setFolderPendingEdit] = useState<Folder | null>(
    null
  );
  const [bookmarkPendingDeletion, setBookmarkPendingDeletion] =
    useState<Bookmark | null>(null);
  const [bookmarkPendingEdit, setBookmarkPendingEdit] =
    useState<Bookmark | null>(null);

  useEffect(() => {
    let active = true;

    async function loadFolders() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("folders")
        .select("id, name")
        .order("created_at", { ascending: true });

      if (!active || error || !data) return;
      setFolders(data.map((row) => ({ id: String(row.id), name: row.name })));
    }

    loadFolders();
    return () => {
      active = false;
    };
  }, []);

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

  async function addFolder(name: string) {
    if (isAddingFolderRef.current) return;
    isAddingFolderRef.current = true;
    setIsAddingFolder(true);

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("folders")
        .insert({ name })
        .select("id, name")
        .single();

      if (!error && data) {
        setFolders((prev) => [...prev, { id: String(data.id), name: data.name }]);
        setIsFolderModalOpen(false);
      }
    } finally {
      isAddingFolderRef.current = false;
      setIsAddingFolder(false);
    }
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

  function requestDeleteBookmark(bookmark: Bookmark) {
    setBookmarkPendingDeletion(bookmark);
  }

  function cancelDeleteBookmark() {
    setBookmarkPendingDeletion(null);
  }

  function confirmDeleteBookmark() {
    if (!bookmarkPendingDeletion) return;
    const bookmarkId = bookmarkPendingDeletion.id;
    setBookmarks(bookmarks.filter((bookmark) => bookmark.id !== bookmarkId));
    setBookmarkPendingDeletion(null);
  }

  function requestEditBookmark(bookmark: Bookmark) {
    setBookmarkPendingEdit(bookmark);
  }

  function closeEditBookmarkModal() {
    setBookmarkPendingEdit(null);
  }

  function editBookmark(fields: { title: string; description: string }) {
    if (!bookmarkPendingEdit) return;
    const bookmarkId = bookmarkPendingEdit.id;
    setBookmarks(
      bookmarks.map((bookmark) =>
        bookmark.id === bookmarkId ? { ...bookmark, ...fields } : bookmark
      )
    );
    setBookmarkPendingEdit(null);
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
        isAddingFolder,
        folderPendingDeletion,
        requestDeleteFolder,
        cancelDeleteFolder,
        confirmDeleteFolder,
        folderPendingEdit,
        requestEditFolder,
        closeEditFolderModal,
        renameFolder,
        bookmarkPendingDeletion,
        requestDeleteBookmark,
        cancelDeleteBookmark,
        confirmDeleteBookmark,
        bookmarkPendingEdit,
        requestEditBookmark,
        closeEditBookmarkModal,
        editBookmark,
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
