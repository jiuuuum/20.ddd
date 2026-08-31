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
import { type Bookmark, type Folder } from "@/data/bookmarks";
import { createClient } from "@/utils/supabase/client";

type NewBookmark = {
  folderId: string;
  title: string;
  url: string;
  description: string;
  thumbnail?: string;
  tags: string[];
};

type LinkRow = {
  id: number;
  url: string;
  title: string | null;
  description: string | null;
  thumbnail_url: string | null;
  created_at: string;
  folder_id: number | null;
};

function mapLinkRow(row: LinkRow): Bookmark {
  return {
    id: String(row.id),
    folderId: row.folder_id != null ? String(row.folder_id) : "",
    title: row.title ?? row.url,
    url: row.url,
    description: row.description ?? "",
    thumbnail: row.thumbnail_url ?? undefined,
    tags: [],
    createdAt: row.created_at.slice(0, 10),
  };
}

type BookmarkContextValue = {
  bookmarks: Bookmark[];
  folders: Folder[];
  isModalOpen: boolean;
  defaultFolderId: string | null;
  openAddModal: (folderId?: string) => void;
  closeAddModal: () => void;
  addBookmark: (bookmark: NewBookmark) => void;
  isAddingBookmark: boolean;
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
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [defaultFolderId, setDefaultFolderId] = useState<string | null>(null);
  const [isAddingBookmark, setIsAddingBookmark] = useState(false);
  const isAddingBookmarkRef = useRef(false);
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

    async function loadBookmarks() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("links")
        .select("id, url, title, description, thumbnail_url, created_at, folder_id")
        .order("created_at", { ascending: false });

      if (!active || error || !data) return;
      setBookmarks(data.map(mapLinkRow));
    }

    loadFolders();
    loadBookmarks();
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

  async function addBookmark(bookmark: NewBookmark) {
    if (isAddingBookmarkRef.current) return;
    isAddingBookmarkRef.current = true;
    setIsAddingBookmark(true);

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("links")
        .insert({
          url: bookmark.url,
          title: bookmark.title || null,
          description: bookmark.description || null,
          thumbnail_url: bookmark.thumbnail ?? null,
          folder_id: bookmark.folderId ? Number(bookmark.folderId) : null,
        })
        .select("id, url, title, description, thumbnail_url, created_at, folder_id")
        .single();

      if (!error && data) {
        setBookmarks((prev) => [mapLinkRow(data), ...prev]);
        setIsModalOpen(false);
      }
    } finally {
      isAddingBookmarkRef.current = false;
      setIsAddingBookmark(false);
    }
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

  async function confirmDeleteFolder() {
    if (!folderPendingDeletion) return;
    const folderId = folderPendingDeletion.id;

    const supabase = createClient();
    const { error } = await supabase
      .from("folders")
      .delete()
      .eq("id", Number(folderId));

    if (!error) {
      setFolders(folders.filter((folder) => folder.id !== folderId));
      setBookmarks(bookmarks.filter((bookmark) => bookmark.folderId !== folderId));
      setFolderPendingDeletion(null);

      if (pathname === `/${folderId}`) {
        router.push("/");
      }
    }
  }

  function requestEditFolder(folder: Folder) {
    setFolderPendingEdit(folder);
  }

  function closeEditFolderModal() {
    setFolderPendingEdit(null);
  }

  async function renameFolder(name: string) {
    if (!folderPendingEdit) return;
    const folderId = folderPendingEdit.id;

    const supabase = createClient();
    const { error } = await supabase
      .from("folders")
      .update({ name })
      .eq("id", Number(folderId));

    if (!error) {
      setFolders(
        folders.map((folder) =>
          folder.id === folderId ? { ...folder, name } : folder
        )
      );
      setFolderPendingEdit(null);
    }
  }

  function requestDeleteBookmark(bookmark: Bookmark) {
    setBookmarkPendingDeletion(bookmark);
  }

  function cancelDeleteBookmark() {
    setBookmarkPendingDeletion(null);
  }

  async function confirmDeleteBookmark() {
    if (!bookmarkPendingDeletion) return;
    const bookmarkId = bookmarkPendingDeletion.id;

    const supabase = createClient();
    const { error } = await supabase
      .from("links")
      .delete()
      .eq("id", Number(bookmarkId));

    if (!error) {
      setBookmarks(bookmarks.filter((bookmark) => bookmark.id !== bookmarkId));
      setBookmarkPendingDeletion(null);
    }
  }

  function requestEditBookmark(bookmark: Bookmark) {
    setBookmarkPendingEdit(bookmark);
  }

  function closeEditBookmarkModal() {
    setBookmarkPendingEdit(null);
  }

  async function editBookmark(fields: { title: string; description: string }) {
    if (!bookmarkPendingEdit) return;
    const bookmarkId = bookmarkPendingEdit.id;

    const supabase = createClient();
    const { error } = await supabase
      .from("links")
      .update({ title: fields.title, description: fields.description })
      .eq("id", Number(bookmarkId));

    if (!error) {
      setBookmarks(
        bookmarks.map((bookmark) =>
          bookmark.id === bookmarkId ? { ...bookmark, ...fields } : bookmark
        )
      );
      setBookmarkPendingEdit(null);
    }
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
        isAddingBookmark,
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
