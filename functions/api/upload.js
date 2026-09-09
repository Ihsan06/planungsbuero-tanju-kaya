// POST /api/upload – nimmt Fotos und Pläne entgegen und legt sie in R2 ab.
// Zugang über den Code aus UPLOAD_CODE (Header x-code oder Feld "code").

import { MAX_BYTES, MAX_FILES, typErlaubt, codeStimmt, nameSaeubern, json } from "../_lib/limits.js";

export async function onRequestPost({ request, env }) {
  if (!env.BILDER) return json({ ok: false, fehler: "Speicher nicht eingerichtet." }, 503);

  let form;
  try {
    form = await request.formData();
  } catch {
    return json({ ok: false, fehler: "Anfrage konnte nicht gelesen werden." }, 400);
  }

  const code = request.headers.get("x-code") || form.get("code");
  if (!codeStimmt(code, env.UPLOAD_CODE)) {
    return json({ ok: false, fehler: "Zugangscode stimmt nicht." }, 401);
  }

  const dateien = form.getAll("datei").filter((f) => typeof f === "object" && f.size !== undefined);
  if (!dateien.length) return json({ ok: false, fehler: "Keine Datei erhalten." }, 400);
  if (dateien.length > MAX_FILES) {
    return json({ ok: false, fehler: `Höchstens ${MAX_FILES} Dateien auf einmal.` }, 413);
  }

  const tag = new Date().toISOString().slice(0, 10);
  const gespeichert = [];

  for (const datei of dateien) {
    if (datei.size === 0) continue;
    if (datei.size > MAX_BYTES) {
      return json({ ok: false, fehler: `"${datei.name}" ist größer als 100 MB.` }, 413);
    }
    if (!typErlaubt(datei.type, datei.name)) {
      return json({ ok: false, fehler: `"${datei.name}": Dateityp wird nicht angenommen.` }, 415);
    }

    const stempel = Date.now().toString(36);
    const zufall = Math.random().toString(36).slice(2, 8);
    // Bei Ordner-Uploads liefert der Browser den Pfad im Feld "pfad" mit.
    const pfad = form.getAll("pfad")[dateien.indexOf(datei)];
    const ordner = String(pfad || "").split("/").slice(0, -1)
      .map((t) => nameSaeubern(t)).filter(Boolean).slice(0, 3).join("/");
    const schluessel = `${tag}/${ordner ? ordner + "/" : ""}${stempel}-${zufall}-${nameSaeubern(datei.name)}`;

    await env.BILDER.put(schluessel, datei.stream(), {
      httpMetadata: { contentType: datei.type },
      customMetadata: {
        originalname: String(datei.name || "").slice(0, 200),
        hochgeladen: new Date().toISOString(),
      },
    });
    gespeichert.push({ schluessel, name: datei.name, groesse: datei.size });
  }

  if (!gespeichert.length) return json({ ok: false, fehler: "Keine gültige Datei dabei." }, 400);
  return json({ ok: true, anzahl: gespeichert.length, dateien: gespeichert });
}

// Ein GET auf den Endpunkt soll nicht die 404-Seite liefern.
export const onRequestGet = () =>
  json({ ok: false, fehler: "Bitte die Seite /upload benutzen." }, 405);
