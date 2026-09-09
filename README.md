# Planungsbüro Tanju Kaya — Website-Entwurf

Neue Website für das **Planungsbüro Tanju Kaya**, Coburg — in Arbeit. Erstellt von Ihsan Yılmaz.

**Live-Vorschau:** https://t-kaya-demo.pages.dev/ (Cloudflare Pages, Projekt `t-kaya-demo`)

Zwei Varianten, umschaltbar oben rechts:

| | Datei | Idee |
|---|---|---|
| **Variante 1** | `index.html` | Dunkel. Im Kopfbereich eine Diashow über den ganzen Bildschirm, danach Projekte, Leistungen, International, Büro, Kontakt |
| **Variante 2** | `v2.html` | Der Stand von heute Mittag, den Tanju Kaya gesehen hat: dunkel, Foto-Hero mit Holzlamellen, acht Leistungskacheln, sechs feste Projektkacheln. Nutzt `assets/img/v2-hero.jpg`, damit Variante 1 ihr eigenes Hero-Foto behält |

Der Entwurf 3 (Fototeppich) ist verworfen; `/v3` leitet auf die Startseite um.
Er liegt vollständig in der Git-Historie.

---

## Was der Entwurf zeigt

| | |
|---|---|
| **Zweisprachig** | Umschaltung Deutsch / Türkisch über den Header, Auswahl wird gespeichert |
| **Mobil zuerst** | Vollständig responsives Layout, getestet ab 375 px |
| **Leistungen** | Alle acht Schwerpunkte des Büros als eigener Abschnitt |
| **Projekte** | Sechs Kategoriekacheln mit Platzhalter-Zeichnungen — bereit für echte Fotos |
| **International** | Referenzländer als eigener Abschnitt (Dominikanische Republik, Türkei, Dubai, Kuwait, Madrid, Moskau) |
| **Kontakt** | Formular mit Themenauswahl; im Entwurf öffnet es das Mailprogramm |
| **SEO** | Title, Meta-Description, `og:image`-Vorschaubild (wichtig für WhatsApp/LinkedIn), strukturierte Daten (schema.org `ProfessionalService`) |
| **Tempo** | Statisches HTML/CSS/JS, kein WordPress, keine Plugins, kein Cookie-Banner nötig |

Die Seite ist bewusst auf `noindex` gesetzt, damit der Entwurf nicht bei Google auftaucht.

## Aufbau

```
index.html             Variante 1 (dunkel, mit Diashow)
v2.html                Variante 2 (hell, editorial)
404.html               Fehlerseite
assets/css/v1.css      Stil Variante 1
assets/css/v2.css      Stil Variante 2
assets/js/v1.js        Galerie, Lightbox, Sprachumschaltung Variante 1
assets/js/v2.js        Sprachumschaltung, Projektkacheln, Formular Variante 2
assets/js/dia.js       Diashow im Kopfbereich von Variante 1
assets/js/reihen.js    füllt die letzte Zeile eines Bildrasters auf
assets/js/bilder.js    Bilddaten der Galerie (aus katalog.json erzeugt)
assets/js/switch.js    Varianten-Umschalter
assets/img/k/          44 Projektbilder in zwei Größen + katalog.json
assets/img/p/          vier Restbilder von der alten Website
assets/img/portrait.jpg  Porträt Tanju Kaya
assets/img/intl.jpg    Hintergrund Abschnitt International (Stockfoto)
assets/img/v2-hero.jpg   Hero-Foto Variante 2
assets/og.png          Vorschaubild für WhatsApp / LinkedIn / Google
upload.html            Upload-Seite für den Kunden
functions/api/         Pages Functions: upload, uploads, datei
hole-bilder.sh         holt die Uploads auf den Rechner
_redirects             /v3 → /
```

Keine Build-Tools. Lokal ansehen und deployen:

```bash
npm run dev
npm run deploy
```

## Bilder

Seit dem 09.09.2026 stammen die Projektbilder aus dem Bestand des Büros (drei ZIP-Archive
von Tanju Kaya: Architektur, Industriebau, Innenarchitektur). Aufbereitet liegen sie in
`assets/img/k/`, je Motiv in zwei Größen: `<name>.jpg` mit 1600 px für die Lightbox,
`<name>-k.jpg` mit 900 px für die Kacheln.

`assets/img/k/katalog.json` ist die Quelle der Wahrheit mit den Metadaten je Bild:

| Feld | Bedeutung |
|---|---|
| `kat` | Kategorie auf der Seite (industriebau, innenausbau, ladenbau, wohnungsbau, altbau, rohbau) |
| `art` | aussen, innen, detail oder render |
| `stern` | 1–3, Eignung; 3 = titelbildtauglich, steuert die Sortierung |
| `kunde`, `ort`, `jahr` | soweit erkennbar, Jahr aus den EXIF-Daten |
| `held` | Kandidat für den Hero |

`assets/js/bilder.js` wird daraus erzeugt und von der Seite geladen. Ändert sich der
Katalog, muss `bilder.js` neu geschrieben werden.

Der Hero zeigt das Verwaltungsgebäude Gaudlitz in der Dämmerung, ein echtes Projekt.
Nur noch drei Stellen laufen auf Fremd- oder Altmaterial: der Hintergrund des Abschnitts
*International* (Stockfoto, weil keine Auslandsfotos vorliegen) sowie die Leistungskacheln
Messebau, Denkmalpflege, Produkt- und Möbeldesign (alte Website, niedrig aufgelöst).

Rohdaten und ausgemustertes Material liegen außerhalb des Repos:
`Desktop/Kaja-Rohbilder` (Originale und ZIPs) und `Desktop/Kaja-Notizen/altbestand-bilder`.

## Akzentfarbe

`--accent: #e9e3d9` – Knochenweiß, also bewusst kein Farbton: die Hierarchie im Hero
entsteht über Helligkeit statt Farbe. Kontrast 15:1 auf dem Hintergrund, 14,5:1 für Text
auf Akzentflächen. Farbige Alternativen liegen in `Desktop/Kaja-Notizen/farbvarianten.png`;
umstellen sind die vier Variablen oben in `assets/css/v2.css`.

## Upload-Punkt für Tanju Kaya

`https://t-kaya-demo.pages.dev/upload?c=<UPLOAD_CODE>`

Eine Seite ohne Anmeldung: Link öffnen, Fotos auswählen oder hineinziehen, fertig.
Funktioniert auf dem Handy. Angenommen werden JPG, PNG, HEIC, TIFF, WebP und PDF
bis 100 MB je Datei. Die Dateien landen im R2-Bucket `t-kaya-bilder`, abgelegt unter
`JJJJ-MM-TT/<zeitstempel>-<zufall>-<name>`; der Originalname steht in den Metadaten.

| Endpunkt | Zweck | Zugang |
|---|---|---|
| `POST /api/upload` | Datei ablegen | `UPLOAD_CODE` |
| `GET /api/uploads` | Übersicht als JSON | `ADMIN_CODE` |
| `GET /api/datei/<schlüssel>` | einzelne Datei laden | `ADMIN_CODE` |

Codes liegen als Pages-Secrets und zusätzlich in `Desktop/Kaja-Notizen/upload-codes.txt`
(nicht im Repo). Alles herunterladen:

```bash
ADMIN_CODE=xxxxx ./hole-bilder.sh kaya-uploads
```

Wer den Upload-Link hat, kann hochladen – der Link gehört also nicht in die Öffentlichkeit.
Zum Zurückziehen einfach ein neues Secret setzen:

```bash
printf 'neuercode' | npx wrangler pages secret put UPLOAD_CODE --project-name=t-kaya-demo
```

## Was noch fehlt (kommt vom Büro)

- Originalfotos der Projekte, sortiert nach Kategorie
- Kurztexte je Projekt: Ort, Jahr, Bauherr, Aufgabe
- Porträtfoto Tanju Kaya, Bürofotos
- Freigabe, welche Telefonnummer gilt (im Impressum steht `76620`, im Seitenfuß `76672`)
- Projektnamen prüfen (aus Dateinamen abgeleitet: Adams, Kapp, Michaelis, Okado, Uhren Meyer, Millennium …)
- Sind allmilmö, ShopCrea und Struch noch aktuelle Partner? (shopcrea.com ist inzwischen verwaist)
- Logos der Assoziierten: erst einbauen, wenn die Partnerschaft bestätigt **und** die
  Logo-Nutzung von jedem Partner schriftlich freigegeben ist. Bis dahin nur Wortmarken
  als Text, das ist rechtlich unbedenklich.
- Logo in Vektorform, falls vorhanden

## Danach

Impressum und Datenschutzerklärung als eigene Seiten, echtes Kontaktformular mit
Spamschutz, pro Projektkategorie eine Unterseite mit Galerie, Umzug auf `t-kaya.de`.
