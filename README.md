# Jonathan Lafleur — project directory

A small bilingual static home page for jonathanlafleur.ca. Plain HTML, CSS and JavaScript, with no build step, external fonts, analytics or dependencies.

## Edit

- `index.html`: profile links and project entries. French is the HTML default; `data-en` contains English text. Keep both versions in step.
- `assets/style.css`: beige, sage and emerald palette; responsive light and dark themes.
- `assets/app.js`: language and theme preferences, saved only in localStorage.
- `assets/*-preview.png`: screenshots of the linked live projects.

To add a project, copy a project article and update its name, descriptions in both languages, destination and preview. Do not invent projects or publish private details.

## Preview

Run a static server from this folder, for example:

    python -m http.server 8766 --bind 127.0.0.1

Open http://localhost:8766/. The site also works without JavaScript in French, using the system theme.

## Domain

The existing root domain currently redirects to GitHub. Replacing that redirect is a separate hosting/DNS step; keep all existing subdomain records intact.

## Contribution calendar

Run python scripts/update_contributions.py to refresh assets/contributions.json
from the contribution calendar on the public GitHub profile. Only dates,
public counts and intensity levels are saved; no repository names or private
activity details are collected. No credentials or API key are used.

The GitHub Actions workflow refreshes the snapshot daily after this repository
is published. Until then it is a dated snapshot; run the script locally to refresh.
Refresh commits belong to the Actions bot, not the profile owner.

KeyAura's logo is copied from jonathanlaf/keyaura/src-tauri/icons/icon.png.
The firmware entry describes adaptations of the upstream CAD Mouse MK2 project,
not authorship of the original hardware design.
