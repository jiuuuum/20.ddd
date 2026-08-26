import { NextRequest, NextResponse } from "next/server";
import { parseOpenGraph } from "@/lib/openGraph";

export async function GET(request: NextRequest) {
  const targetUrl = request.nextUrl.searchParams.get("url");

  if (!targetUrl) {
    return NextResponse.json(
      { error: "url query parameter is required" },
      { status: 400 }
    );
  }

  let pageUrl: URL;
  try {
    pageUrl = new URL(targetUrl);
  } catch {
    return NextResponse.json({ error: "invalid url" }, { status: 400 });
  }

  if (pageUrl.protocol !== "http:" && pageUrl.protocol !== "https:") {
    return NextResponse.json({ error: "unsupported protocol" }, { status: 400 });
  }

  const empty = {
    title: null,
    description: null,
    thumbnail: null,
    url: pageUrl.toString(),
  };

  try {
    const response = await fetch(pageUrl.toString(), {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; BookmarkOGBot/1.0)",
        Accept: "text/html",
      },
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      return NextResponse.json(empty);
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("text/html")) {
      return NextResponse.json(empty);
    }

    const html = await response.text();
    const og = parseOpenGraph(html, pageUrl);

    return NextResponse.json({ ...og, url: pageUrl.toString() });
  } catch {
    return NextResponse.json(empty);
  }
}
