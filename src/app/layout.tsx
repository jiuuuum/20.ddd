import type { Metadata } from "next";
import Sidebar from "@/components/Sidebar";
import AddBookmarkModal from "@/components/AddBookmarkModal";
import AddFolderModal from "@/components/AddFolderModal";
import DeleteFolderModal from "@/components/DeleteFolderModal";
import DeleteBookmarkModal from "@/components/DeleteBookmarkModal";
import EditFolderModal from "@/components/EditFolderModal";
import { BookmarkProvider } from "@/context/BookmarkContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "북마크",
  description: "북마크 서비스",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full">
        <BookmarkProvider>
          <Sidebar />
          <div className="flex flex-1 flex-col">{children}</div>
          <AddBookmarkModal />
          <AddFolderModal />
          <DeleteFolderModal />
          <DeleteBookmarkModal />
          <EditFolderModal />
        </BookmarkProvider>
      </body>
    </html>
  );
}
