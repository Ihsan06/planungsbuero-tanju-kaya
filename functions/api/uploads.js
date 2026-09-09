// GET /api/uploads – Übersicht über alles, was hochgeladen wurde. Nur mit ADMIN_CODE.

import { codeStimmt, json } from "../_lib/limits.js";

export async function onRequestGet({ request, env }) {
  if (!env.BILDER) return json({ ok: false, fehler: "Speicher nicht eingerichtet." }, 503);

  const url = new URL(request.url);
  const code = request.headers.get("x-code") || url.searchParams.get("c");
  if (!codeStimmt(code, env.ADMIN_CODE)) return json({ ok: false, fehler: "Kein Zugang." }, 401);

  const liste = await env.BILDER.list({ limit: 1000, include: ["httpMetadata", "customMetadata"] });
  const dateien = liste.objects
    .map((o) => ({
      schluessel: o.key,
      groesse: o.size,
      typ: o.httpMetadata?.contentType || "",
      original: o.customMetadata?.originalname || "",
      hochgeladen: o.customMetadata?.hochgeladen || o.uploaded,
    }))
    .sort((a, b) => String(b.hochgeladen).localeCompare(String(a.hochgeladen)));

  return json({
    ok: true,
    anzahl: dateien.length,
    gesamtgroesse: dateien.reduce((s, d) => s + d.groesse, 0),
    abgeschnitten: liste.truncated === true,
    dateien,
  });
}
