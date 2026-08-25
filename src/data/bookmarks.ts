export type Folder = {
  id: string;
  name: string;
};

export type Bookmark = {
  id: string;
  folderId: string;
  title: string;
  url: string;
  description: string;
  tags: string[];
  createdAt: string;
};

export const folders: Folder[] = [
  { id: "dev", name: "개발" },
  { id: "design", name: "디자인" },
  { id: "life", name: "일상" },
];

export const bookmarks: Bookmark[] = [
  {
    id: "1",
    folderId: "dev",
    title: "Next.js Documentation",
    url: "https://nextjs.org/docs",
    description: "Next.js 공식 문서, App Router와 서버 컴포넌트 가이드",
    tags: ["Next.js", "Docs"],
    createdAt: "2026-08-20",
  },
  {
    id: "2",
    folderId: "dev",
    title: "Tailwind CSS",
    url: "https://tailwindcss.com/docs",
    description: "유틸리티 우선 CSS 프레임워크 공식 문서",
    tags: ["CSS", "Docs"],
    createdAt: "2026-08-18",
  },
  {
    id: "3",
    folderId: "dev",
    title: "MDN Web Docs",
    url: "https://developer.mozilla.org",
    description: "웹 표준, HTML/CSS/JS 레퍼런스",
    tags: ["Reference"],
    createdAt: "2026-08-15",
  },
  {
    id: "4",
    folderId: "design",
    title: "Dribbble",
    url: "https://dribbble.com",
    description: "UI/UX 디자인 영감을 얻을 수 있는 커뮤니티",
    tags: ["Inspiration"],
    createdAt: "2026-08-12",
  },
  {
    id: "5",
    folderId: "design",
    title: "Figma",
    url: "https://figma.com",
    description: "협업 인터페이스 디자인 툴",
    tags: ["Tool"],
    createdAt: "2026-08-10",
  },
  {
    id: "6",
    folderId: "life",
    title: "Notion",
    url: "https://notion.so",
    description: "메모, 일정, 문서를 정리하는 올인원 워크스페이스",
    tags: ["Productivity"],
    createdAt: "2026-08-05",
  },
];

export function getFolder(folderId: string) {
  return folders.find((folder) => folder.id === folderId);
}

export function getBookmarksByFolder(folderId: string) {
  return bookmarks.filter((bookmark) => bookmark.folderId === folderId);
}
