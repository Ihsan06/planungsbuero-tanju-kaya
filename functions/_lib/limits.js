// Gemeinsame Grenzen und Helfer für die Upload-Endpunkte.

export const MAX_BYTES = 40 * 1024 * 1024;   // 40 MB je Datei
export const MAX_FILES = 40;                 // je Anfrage

const ERLAUBT = [
  "image/jpeg", "image/png", "image/webp", "image/heic", "image/heif",
  "image/tiff", "image/gif", "application/pdf",
];

export function typErlaubt(typ) {
  return ERLAUBT.includes(String(typ || "").toLowerCase());
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
