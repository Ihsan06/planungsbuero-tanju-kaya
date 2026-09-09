// Gemeinsame Grenzen und Helfer für die Upload-Endpunkte.

// Cloudflare deckelt den Anfragekörper bei 100 MB, mehr geht ohne mehrteiligen
// Upload nicht. Für Fotos und Pläne ist das reichlich.
export const MAX_BYTES = 100 * 1024 * 1024;
export const MAX_FILES = 250;                 // je Anfrage

const TYPEN = [
  "image/jpeg", "image/jpg", "image/png", "image/webp", "image/heic", "image/heif",
  "image/tiff", "image/gif", "image/bmp", "image/avif", "image/svg+xml",
  "image/x-adobe-dng", "image/x-canon-cr2", "image/x-nikon-nef",
  "application/pdf",
];

// Windows und manche Handys schicken leere oder generische Typen mit. Dann
// entscheidet die Endung.
const ENDUNGEN = [
  "jpg", "jpeg", "png", "webp", "heic", "heif", "tif", "tiff", "gif", "bmp",
  "avif", "dng", "cr2", "cr3", "nef", "arw", "raf", "orf", "rw2", "pdf",
];

export function typErlaubt(typ, name) {
  const t = String(typ || "").toLowerCase().split(";")[0].trim();
  if (TYPEN.includes(t)) return true;
  if (t && t !== "application/octet-stream" && t !== "binary/octet-stream") return false;
  const endung = String(name || "").toLowerCase().split(".").pop();
  return ENDUNGEN.includes(endung);
}

// Prüft den Code gegen ein Secret. Vergleich in konstanter Zeit, damit sich der
// Code nicht über Antwortzeiten erraten lässt.
export function codeStimmt(eingabe, erwartet) {
  const a = String(eingabe || "");
  const b = String(erwartet || "");
  if (!b || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

// Dateinamen entschärfen: Pfadtrenner und Sonderzeichen raus, Länge begrenzen.
export function nameSaeubern(name) {
  const roh = String(name || "datei").split(/[\\/]/).pop();
  const sauber = roh
    .normalize("NFKD")
    .replace(/[^\w.\- ]+/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[.-]+/, "")
    .slice(0, 80);
  return sauber || "datei";
}

export function json(daten, status = 200) {
  return new Response(JSON.stringify(daten), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
}
