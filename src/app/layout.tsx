import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "북마크",
    template: "%s | 북마크",
  },
  description: "북마크 서비스",
  openGraph: {
    siteName: "북마크",
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="flex min-h-full flex-col md:flex-row">
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
