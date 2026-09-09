# Planungsbüro Tanju Kaya — Website-Entwurf

Neue Website für das **Planungsbüro Tanju Kaya**, Coburg — in Arbeit. Erstellt von Ihsan Yılmaz.

**Live-Vorschau:** https://t-kaya-demo.pages.dev/ (Cloudflare Pages, Projekt `t-kaya-demo`)

Eine Seite, dunkel und ausführlich: Foto-Hero mit fixiertem Hintergrund, Leistungen,
Projektkategorien, International, Bürovorstellung, Kontaktformular.
Die frühere minimale Variante 1 ist entfallen; `/v2` leitet auf die Startseite um.

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
index.html             die Website
assets/css/v2.css      Stil
assets/js/v2.js        Sprachumschaltung DE/TR, Projektkacheln, Parallax, Formular
assets/img/hero.jpg    Hero-Foto (fixierter Hintergrund)
assets/img/intl.jpg    Hintergrund Abschnitt International
assets/img/portrait.jpg  Porträt Tanju Kaya
assets/img/p/          Fotoarchiv von der alten Website (88 Dateien, davon nutzt
                       die Seite aktuell 12 – der Rest wartet auf die Projektseiten)
assets/og.png          Vorschaubild für WhatsApp / LinkedIn / Google
upload.html            Upload-Seite für den Kunden
functions/api/         Pages Functions: upload, uploads, datei
hole-bilder.sh         holt die Uploads auf den Rechner
_redirects             /v2 → /
```

Keine Build-Tools. Lokal ansehen und deployen:

```bash
npm run dev
npm run deploy
```

## Bilder Variante 2

Zwei Stockfotos von Unsplash (Unsplash-Lizenz: kommerziell frei, keine Namensnennung nötig):

| Datei | Motiv | Wo |
|---|---|---|
| `assets/img/hero.jpg` | Ladenbau-Innenraum mit Holzlamellen | Hero |
| `assets/img/intl.jpg` | Skyline in der Dämmerung | Abschnitt *International* |

Die acht Leistungskacheln in Variante 2 liegen dagegen auf **eigenen Projektfotos**
(`--sbg` je Kachel im HTML). Achtung: `url()` in einer Custom Property wird relativ zum
Stylesheet aufgelöst, nicht zum HTML – die Pfade müssen deshalb mit `/assets/…` beginnen.

Beide liegen als fixierter Hintergrund (`background-attachment: fixed`) hinter dem Inhalt,
also dieselbe Technik wie auf autohaus-diezmann.de; unter 900 px Breite fällt es auf
`scroll` zurück, weil iOS mit `fixed` ruckelt.

**Sobald eigene Fotos da sind, ersetzen.** Weitere Kandidaten liegen in
`Desktop/Kaja-Notizen/bildvarianten.png` und `international-bg.png`.

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
