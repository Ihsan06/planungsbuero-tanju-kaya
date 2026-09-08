# Planungsbüro Tanju Kaya — Website-Entwurf

Unverbindlicher Entwurf für eine neue Website des **Planungsbüros Tanju Kaya**, Coburg.
Erstellt von Ihsan Yılmaz als Vorschlag — noch nicht die offizielle Seite des Büros.

**Live-Vorschau:** https://ihsan06.github.io/planungsbuero-tanju-kaya/

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
index.html            komplette Seite (eine Datei)
assets/css/style.css  Design-Tokens, Layout, Animationen
assets/js/main.js     Sprachumschaltung, Projektkacheln, Navigation, Formular
assets/og.png         Vorschaubild für WhatsApp / LinkedIn / Google
```

Keine Build-Tools, keine Abhängigkeiten. Lokal ansehen:

```bash
python3 -m http.server 8787
```

## Was noch fehlt (kommt vom Büro)

- Originalfotos der Projekte, sortiert nach Kategorie
- Kurztexte je Projekt: Ort, Jahr, Bauherr, Aufgabe
- Porträtfoto Tanju Kaya, Bürofotos
- Freigabe, welche Telefonnummer gilt (im Impressum steht `76620`, im Seitenfuß `76672`)
- Logo in Vektorform, falls vorhanden

## Danach

Impressum und Datenschutzerklärung als eigene Seiten, echtes Kontaktformular mit
Spamschutz, pro Projektkategorie eine Unterseite mit Galerie, Umzug auf `t-kaya.de`.
