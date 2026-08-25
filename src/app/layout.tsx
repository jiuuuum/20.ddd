import type { Metadata } from "next";
import Sidebar from "@/components/Sidebar";
import "./globals.css";

export const metadata: Metadata = {
  title: "북마크",
  description: "북마크 서비스",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full">
        <Sidebar />
        <div className="flex flex-1 flex-col">{children}</div>
      </body>
    </html>
  );
}
