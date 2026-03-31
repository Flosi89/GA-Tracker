# SBB Fahrten-Tracker 🚂

Web-App zum Erfassen von SBB-Fahrten via URL. SBB-Link einfügen, Preis ergänzen, fertig.

## Features

- **URL-Parsing:** Beide SBB-Link-Formate werden unterstützt
  - `sbb.ch/de?stops=Luzern_I8505000~Zürich+HB_I8503000&day=...`
  - `sbb.ch/de/angebot?tripId=...` (Base64/zlib-kodiert)
- **Automatische Erkennung:** Von, Nach, Datum, Uhrzeit aus dem Link
- **Manuelle Erfassung:** Fahrten auch ohne Link eintragen
- **Gesamtübersicht:** Laufende Summe aller Fahrten
- **Export:** CSV und JSON
- **Offline-fähig:** Alles im localStorage, kein Backend

## Setup

### GitHub Pages

1. Repo erstellen (z.B. `sbb-tracker`)
2. `index.html` + `README.md` hochladen
3. Settings → Pages → Source: `main` → Save
4. Fertig: `https://DEIN-USERNAME.github.io/sbb-tracker/`

### Lokal

`index.html` im Browser öffnen. Kein Build nötig.

## Nutzung

1. In der SBB-App oder auf sbb.ch eine Verbindung suchen
2. Link kopieren (Teilen-Button)
3. Link in die App einfügen → "Lesen"
4. Preis ergänzen → "Hinzufügen"

## Tech

- Vanilla HTML/CSS/JS, keine Dependencies
- DecompressionStream API für tripId-Dekodierung
- localStorage für Persistenz
- ~60 Schweizer Bahnhöfe im Stations-Mapping
