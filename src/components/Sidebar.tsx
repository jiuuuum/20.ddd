"use client";

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

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <nav className="flex h-full w-56 shrink-0 flex-col border-r border-[var(--divider)] px-4 py-8">
      <ul className="flex flex-1 flex-col gap-1">
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
    </nav>
  );
}
