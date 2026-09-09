// GET /api/datei/<schlüssel> – lädt eine hochgeladene Datei herunter. Nur mit ADMIN_CODE.
// Doppelte Klammern, weil die Schlüssel einen Schrägstrich enthalten (Datum/Datei).

import { codeStimmt } from "../../_lib/limits.js";

export async function onRequestGet({ params, request, env }) {
  if (!env.BILDER) return new Response("Speicher nicht eingerichtet.", { status: 503 });

  const url = new URL(request.url);
  const code = request.headers.get("x-code") || url.searchParams.get("c");
  if (!codeStimmt(code, env.ADMIN_CODE)) return new Response("Kein Zugang.", { status: 401 });

  const teile = Array.isArray(params.pfad) ? params.pfad : [params.pfad];
  const schluessel = teile.filter(Boolean).map(decodeURIComponent).join("/");
  if (!schluessel || schluessel.includes("..")) return new Response("Ungültig.", { status: 400 });

  const obj = await env.BILDER.get(schluessel);
  if (!obj) return new Response("Nicht gefunden.", { status: 404 });

  const headers = new Headers();
  obj.writeHttpMetadata(headers);
  headers.set("etag", obj.httpEtag);
  headers.set("cache-control", "private, no-store");
  const name = obj.customMetadata?.originalname || schluessel.split("/").pop();
  headers.set("content-disposition", `inline; filename="${name.replace(/"/g, "")}"`);
  return new Response(obj.body, { headers });
}
