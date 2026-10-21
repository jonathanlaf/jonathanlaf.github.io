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
