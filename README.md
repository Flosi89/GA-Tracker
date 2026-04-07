# Spesen-Tracker

Web-App zur Erfassung und Verwaltung von Geschäftsspesen. Läuft als PWA direkt im Browser, keine Installation nötig.

## Features

### Erfassung
- **SBB-Link Import:** Verbindungslink aus der SBB-App einfügen, Route und Datum werden automatisch erkannt
- **Manuelle Erfassung:** Für alle Spesenkategorien (ÖV-Reise, Essen, Unterkunft, Material, Sonstiges)
- **Retour-Fahrten:** Werden als ein Eintrag mit Gesamtpreis (×2) zusammengefasst
- **Betreff:** Optionale Zuordnung zu Projekten oder Anlässen

### Belege
- **Datei anhängen:** Screenshots, PDFs aus der Galerie
- **Foto aufnehmen:** Kamera direkt öffnen zum Abfotografieren (z.B. Essensbelege)
- **Beleg-Indikator:** Jede Karte zeigt auf einen Blick ob ein Beleg vorhanden ist oder fehlt
- **Lightbox-Vorschau:** Belege direkt in der App ansehen

### Verwaltung
- **Archivierung:** Spesen als exportiert markieren (manuell oder automatisch nach dem Senden)
- **Filter:** Nach Zeitraum, Kategorie, Status (Offen/Exportiert) und Sortierung
- **Bearbeiten:** Alle Felder inline editierbar
- **Reihenfolge:** Einträge manuell verschieben

### Statistik
- **Offen-KPI:** Betrag und Anzahl der noch abzurechnenden Spesen
- **GA-Vergleich:** ÖV-Ausgaben vs. GA-Preis (CHF 3'995) mit Fortschrittsbalken
- **Nach Kategorie:** Balkendiagramm und Detailliste
- **Nach Monat:** Ausgabenentwicklung über die Zeit
- **Nach Betreff:** Projektbezogene Kostenübersicht

### Export
- **Excel (.xlsx):** Zwei Sheets (Detailliste + Zusammenfassung mit GA-Vergleich)
- **CSV:** UTF-8 mit korrekten Umlauten
- **JSON:** Maschinenlesbarer Export
- **ZIP:** Alle Belege gebündelt mit Übersichts-CSV

### Odoo-Integration
- **Einzelversand:** Spese mit Beleg per Teilen-Dialog senden
- **Sammelversand:** Alle gefilterten Spesen als ZIP gebündelt senden
- **Konfigurierbar:** Empfänger-Alias, Referenz-Code, Absender-Email

## Technologie

- Vanilla HTML/CSS/JS, keine Frameworks
- PWA mit Service Worker für Offline-Nutzung
- IndexedDB für Beleg-Speicherung (bis 20MB/Datei)
- localStorage für Spesen-Daten
- SheetJS (CDN) für Excel-Export
- JSZip (CDN) für ZIP-Export

## Dateien

| Datei | Beschreibung |
|---|---|
| `index.html` | Komplette App (Single-File) |
| `manifest.json` | PWA-Manifest mit Share Target |
| `sw.js` | Service Worker (Cache: spesen-v3) |
| `logo.png` | Sozialinfo-Logo |
| `icon-192.png` | PWA-Icon 192x192 |
| `icon-512.png` | PWA-Icon 512x512 |

## Setup

1. Alle Dateien in ein GitHub-Repository laden
2. GitHub Pages aktivieren (Settings → Pages → Branch: main)
3. App öffnen unter `https://<username>.github.io/<repo>/`
4. Optional: Custom Domain einrichten (z.B. `spesen.sozialinfo.ch`)

## Nutzung

**ÖV-Spese via SBB-Link:**
1. In der SBB-App: Verbindung → Teilen → Link kopieren
2. Im Spesen-Tracker: Einfügen → Lesen → Preis eingeben → Hinzufügen
3. SBB öffnen → Screenshot machen → Beleg anhängen

**Manuelle Spese:**
1. Tab "Manuell" → Kategorie wählen → Felder ausfüllen → Hinzufügen
2. Beleg per Foto oder Datei anhängen

**Abrechnung:**
1. Filter auf "Offen" (Standard)
2. Excel Export oder einzeln/gesammelt an Odoo senden
3. Gesendete Spesen werden automatisch archiviert
