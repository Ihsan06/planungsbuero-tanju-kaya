# Planungsbüro Tanju Kaya — Website-Entwurf

Neue Website für das **Planungsbüro Tanju Kaya**, Coburg — in Arbeit. Erstellt von Ihsan Yılmaz.

**Live-Vorschau:** https://t-kaya-demo.pages.dev/ (Cloudflare Pages, Projekt `t-kaya-demo`)

Zwei Design-Varianten, umschaltbar oben rechts:

| | Datei | Idee |
|---|---|---|
| **Variante 1** | `index.html` | Minimal, schwarz/weiß, Raleway + Lato – bewusst nah an der jetzigen t-kaya.de, nur mit Inhalt: Galerie mit Filter und Lightbox |
| **Variante 2** | `v2.html` | Ausführlicher: Foto-Hero mit Parallax, Leistungen, Projektkategorien, International, Assoziierte, Bürovorstellung, Türkis-Akzent |

Die 86 Projektfotos und das Porträt stammen von der bisherigen Website (`wp-json`-Export,
Originalgröße meist 290 px). Kategorien, Referenznamen (Potsdamer Platz Arkaden, Alexa Berlin,
Ringcenter Berlin, Schlossparkcenter Schwerin), der Messebau-Text und die drei Assoziierten
(allmilmö, ShopCrea, Struch) kommen von der Site-Version von 2016 aus dem Internet Archive;
Leistungsphasen aus dem heinze.de-Profil.

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
index.html             Variante 1 (minimal)
v2.html                Variante 2 (ausführlich)
assets/css/v1.css      Stil Variante 1
assets/css/v2.css      Stil Variante 2
assets/js/projects.js  Bildliste mit Kategorie und Projektname (aus Dateinamen abgeleitet – prüfen!)
assets/js/v1.js        Galerie, Filter, Lightbox, DE/TR, Formular
assets/js/v2.js        Sprachumschaltung, Kacheln, Formular
assets/js/switch.js    Varianten-Umschalter (gleiche Mechanik wie bei den anderen Demos)
assets/img/hero.jpg    Hero-Foto Variante 2 (Unsplash, siehe unten)
assets/img/p/          86 Projektfotos von t-kaya.de
assets/img/logo.png    Wortmarke von t-kaya.de (weiß, transparent)
assets/og.png          Vorschaubild für WhatsApp / LinkedIn / Google
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

## Was noch fehlt (kommt vom Büro)

- Originalfotos der Projekte, sortiert nach Kategorie
- Kurztexte je Projekt: Ort, Jahr, Bauherr, Aufgabe
- Porträtfoto Tanju Kaya, Bürofotos
- Freigabe, welche Telefonnummer gilt (im Impressum steht `76620`, im Seitenfuß `76672`)
- Projektnamen prüfen (aus Dateinamen abgeleitet: Adams, Kapp, Michaelis, Okado, Uhren Meyer, Millennium …)
- Sind allmilmö, ShopCrea und Struch noch aktuelle Partner? (shopcrea.com ist inzwischen verwaist)
- Logo in Vektorform, falls vorhanden

## Danach

Impressum und Datenschutzerklärung als eigene Seiten, echtes Kontaktformular mit
Spamschutz, pro Projektkategorie eine Unterseite mit Galerie, Umzug auf `t-kaya.de`.
