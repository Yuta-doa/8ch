export function splitAnchors(text: string) {
  return text.split(/(>>\d+)/g).filter(Boolean);
}

export function anchorToPostNumber(token: string) {
  const match = token.match(/^>>(\d+)$/);
  return match ? Number(match[1]) : null;
}