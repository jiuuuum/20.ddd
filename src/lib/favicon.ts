export function faviconUrl(url: string) {
  const { hostname } = new URL(url);
  return `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`;
}
