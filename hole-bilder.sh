#!/usr/bin/env bash
# Lädt alles herunter, was Tanju Kaya über /upload hochgeladen hat.
#
#   ADMIN_CODE=xxxxx ./hole-bilder.sh [zielordner]
#
# Der Code steht in Desktop/Kaja-Notizen/upload-codes.txt und gehört nicht ins Repo.

set -euo pipefail

BASIS="${BASIS:-https://t-kaya-demo.pages.dev}"
ZIEL="${1:-kaya-uploads}"

if [ -z "${ADMIN_CODE:-}" ]; then
  echo "ADMIN_CODE fehlt. Aufruf: ADMIN_CODE=xxxxx $0 [zielordner]" >&2
  exit 1
fi

mkdir -p "$ZIEL"
liste=$(curl -fsS -H "x-code: $ADMIN_CODE" "$BASIS/api/uploads")

anzahl=$(printf '%s' "$liste" | python3 -c 'import sys,json; print(json.load(sys.stdin)["anzahl"])')
echo "$anzahl Datei(en) im Speicher."
[ "$anzahl" -eq 0 ] && exit 0

printf '%s' "$liste" \
  | python3 -c 'import sys,json; [print(d["schluessel"]) for d in json.load(sys.stdin)["dateien"]]' \
  | while IFS= read -r schluessel; do
      datei="$ZIEL/$(basename "$schluessel")"
      if [ -f "$datei" ]; then
        echo "  vorhanden: $(basename "$schluessel")"
        continue
      fi
      # Schlüssel enthält einen Schrägstrich (Datum/Datei) – der bleibt im Pfad.
      curl -fsS -H "x-code: $ADMIN_CODE" "$BASIS/api/datei/$schluessel" -o "$datei"
      echo "  geladen:   $(basename "$schluessel")"
    done

echo "Fertig. Liegt in: $ZIEL"
