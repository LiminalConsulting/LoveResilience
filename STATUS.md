---
client: LoveResilience
status: live_paused
phase: maintenance
last_updated: 2026-05-13
last_activity: 2026-04 letzte Site-Updates
operator: David Rug
contact_owner: Tanja (über AuxellCoaching)
public_url: https://liminalconsulting.github.io/LoveResilience/
---

# LoveResilience — Status

## Was es ist

Eine digitale Karten-Deck-App für Tanja — Übungen zur
Bewusstseins-Resilienz. Separates Projekt, aber **strategisch Teil
des Auxell-Coaching-Universums** (siehe `../AuxellCoaching/STATUS.md`).

## Wo wir stehen

Live unter <https://liminalconsulting.github.io/LoveResilience/> als
GitHub Pages, **öffentliches Repo** (weil GitHub Pages im Free-Tier
nur öffentlich hostet). Aktuelle UI-Variante: Sprachumschaltung,
PDF-Kartenbilder Deutsch + Englisch, Karten-Layout-Verfeinerungen.

Aktuell **passiv-aktiv**: läuft stabil, keine aktiven Builds. Tanjas
Freelancer baut ihre Hauptwebsite separat und bettet
LoveResilience per iframe ein.

## Geplante Migration (Trigger: Auxell-Dashboard-Bau)

Wenn das Coaching-Dashboard für Tanja gebaut wird (nach
OMSN-Milestone-1), wandert LoveResilience in den unified Stack:

1. **Repo wechselt auf privat** (Cloudflare Pages braucht das nicht
   öffentlich)
2. **Hosting wechselt** von GitHub Pages zu Cloudflare Pages
3. **Einbindung wechselt** von iframe zur vertikalen Integration in
   die migrierte Hauptwebsite
4. **Sovereignty-Vorteil**: alles auf eigener Domain, eigener
   Infrastruktur, keine GitHub-Pages-Abhängigkeit mehr

Bis dahin: keine aktive Arbeit. Repo bleibt wie es ist.

## Material

- Card decks DE + EN (`Karten auf 85x125 englisch.pdf`,
  `Karten auf 85x125_deutsch.pdf` — lokal, untracked)
- App-Code in `src/`
- `dist/` — Build-Output (gitignored)

## Eine Notiz zur Visibility

Wenn LoveResilience auf Cloudflare Pages migriert, kann das Repo
sicher privat werden, weil Cloudflare nur Build-Rechte braucht (siehe
Liminal-Consulting-Stack-Pattern). Die Website bleibt erreichbar; nur
die Quelle ist nicht mehr öffentlich.
