"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import DeleteFolderButton from "@/components/DeleteFolderButton";
import { useBookmarks } from "@/context/BookmarkContext";

export default function Sidebar() {
  const pathname = usePathname();
  const { folders } = useBookmarks();

  return (
    <nav className="w-56 shrink-0 border-r border-[var(--divider)] px-4 py-8">
      <ul className="flex flex-col gap-1">
        <li>
          <Link
            href="/"
            className={`nav-link${pathname === "/" ? " is-active" : ""}`}
          >
            전체
          </Link>
        </li>
        {folders.map((folder) => (
          <li key={folder.id} className="group relative">
            <Link
              href={`/${folder.id}`}
              className={`nav-link pr-9${
                pathname === `/${folder.id}` ? " is-active" : ""
              }`}
            >
              {folder.name}
            </Link>
            <DeleteFolderButton folder={folder} />
          </li>
        ))}
      </ul>
    </nav>
  );
}
