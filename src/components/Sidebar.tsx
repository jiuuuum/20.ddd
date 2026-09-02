"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import DeleteFolderButton from "@/components/DeleteFolderButton";
import EditFolderButton from "@/components/EditFolderButton";
import { useBookmarks } from "@/context/BookmarkContext";
import { createClient } from "@/utils/supabase/client";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { folders } = useBookmarks();
  const [isOpen, setIsOpen] = useState(false);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <>
      <header className="flex h-12 shrink-0 items-center justify-between border-b border-[var(--divider)] px-4 md:hidden">
        <span className="text-[17px] font-semibold text-[var(--text)]">북마크</span>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="메뉴 열기"
          className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-[rgba(0,0,0,0.04)]"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M3 5.5h14M3 10h14M3 14.5h14"
              stroke="var(--text)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </header>

      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <nav
        className={`fixed inset-y-0 left-0 z-50 flex w-64 -translate-x-full flex-col bg-[var(--background)] px-4 py-8 transition-transform duration-300 md:static md:z-auto md:w-56 md:shrink-0 md:translate-x-0 md:border-r md:border-[var(--divider)] md:transition-none ${
          isOpen ? "translate-x-0" : ""
        }`}
      >
        <ul className="flex flex-1 flex-col gap-1">
          <li>
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className={`nav-link${pathname === "/" ? " is-active" : ""}`}
            >
              전체
            </Link>
          </li>
          {folders.map((folder) => (
            <li key={folder.id} className="group relative">
              <Link
                href={`/${folder.id}`}
                onClick={() => setIsOpen(false)}
                className={`nav-link pr-16${
                  pathname === `/${folder.id}` ? " is-active" : ""
                }`}
              >
                {folder.name}
              </Link>
              <EditFolderButton folder={folder} />
              <DeleteFolderButton folder={folder} />
            </li>
          ))}
        </ul>
        <button type="button" onClick={handleLogout} className="nav-link text-left">
          로그아웃
        </button>
        <Link
          href="/privacy"
          onClick={() => setIsOpen(false)}
          className="nav-link text-left text-xs text-[var(--text-sub)]"
        >
          개인정보 처리방침
        </Link>
      </nav>
    </>
  );
}
