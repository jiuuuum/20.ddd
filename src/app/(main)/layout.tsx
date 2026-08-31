import type { ReactNode } from "react";
import Sidebar from "@/components/Sidebar";
import AddBookmarkModal from "@/components/AddBookmarkModal";
import AddFolderModal from "@/components/AddFolderModal";
import DeleteFolderModal from "@/components/DeleteFolderModal";
import DeleteBookmarkModal from "@/components/DeleteBookmarkModal";
import EditFolderModal from "@/components/EditFolderModal";
import EditBookmarkModal from "@/components/EditBookmarkModal";
import { BookmarkProvider } from "@/context/BookmarkContext";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <BookmarkProvider>
      <Sidebar />
      <div className="flex flex-1 flex-col">{children}</div>
      <AddBookmarkModal />
      <AddFolderModal />
      <DeleteFolderModal />
      <DeleteBookmarkModal />
      <EditFolderModal />
      <EditBookmarkModal />
    </BookmarkProvider>
  );
}
