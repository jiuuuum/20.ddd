"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { folders } from "@/data/bookmarks";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="w-56 shrink-0 border-r border-black/[.08] px-4 py-8 dark:border-white/[.145]">
      <ul className="flex flex-col gap-1">
        <li>
          <Link
            href="/"
            className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              pathname === "/"
                ? "bg-black/[.06] text-black dark:bg-white/[.08] dark:text-zinc-50"
                : "text-zinc-600 hover:bg-black/[.04] dark:text-zinc-400 dark:hover:bg-white/[.06]"
            }`}
          >
            전체
          </Link>
        </li>
        {folders.map((folder) => (
          <li key={folder.id}>
            <Link
              href={`/${folder.id}`}
              className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                pathname === `/${folder.id}`
                  ? "bg-black/[.06] text-black dark:bg-white/[.08] dark:text-zinc-50"
                  : "text-zinc-600 hover:bg-black/[.04] dark:text-zinc-400 dark:hover:bg-white/[.06]"
              }`}
            >
              {folder.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
