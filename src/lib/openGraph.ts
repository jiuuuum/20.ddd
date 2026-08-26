export type OpenGraphData = {
  title: string | null;
  description: string | null;
  thumbnail: string | null;
};

const ENTITY_MAP: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  "#039": "'",
  apos: "'",
  nbsp: " ",
};

function decodeHtmlEntities(value: string) {
  return value.replace(/&(#?\w+);/g, (match, entity) => {
    if (entity in ENTITY_MAP) return ENTITY_MAP[entity];
    if (entity.startsWith("#")) {
      const codePoint = Number(entity.slice(1));
      return Number.isNaN(codePoint) ? match : String.fromCodePoint(codePoint);
    }
    return match;
  });
}

function extractMetaContent(html: string, keys: string[]) {
  for (const key of keys) {
    const forward = new RegExp(
      `<meta[^>]+(?:property|name)=["']${key}["'][^>]*content=["']([^"']*)["'][^>]*>`,
      "i"
    );
    const reversed = new RegExp(
      `<meta[^>]+content=["']([^"']*)["'][^>]*(?:property|name)=["']${key}["'][^>]*>`,
      "i"
    );
    const match = html.match(forward) ?? html.match(reversed);
    if (match) return decodeHtmlEntities(match[1].trim());
  }
  return null;
}

function extractTitleTag(html: string) {
  const match = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  return match ? decodeHtmlEntities(match[1].trim()) : null;
}

function resolveUrl(value: string | null, base: URL) {
  if (!value) return null;
  try {
    return new URL(value, base).toString();
  } catch {
    return null;
  }
}

export function parseOpenGraph(html: string, pageUrl: URL): OpenGraphData {
  const title =
    extractMetaContent(html, ["og:title", "twitter:title"]) ??
    extractTitleTag(html);
  const description = extractMetaContent(html, [
    "og:description",
    "twitter:description",
    "description",
  ]);
  const image = extractMetaContent(html, ["og:image", "twitter:image"]);

  return {
    title,
    description,
    thumbnail: resolveUrl(image, pageUrl),
  };
}
