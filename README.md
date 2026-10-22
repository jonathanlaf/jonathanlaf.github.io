# Jonathan Lafleur — project directory

A small bilingual static home page for jonathanlafleur.ca. Plain HTML, CSS and JavaScript, with no build step, external fonts, analytics or dependencies.

## Edit

- `index.html`: profile links and project entries. French is the HTML default; `data-en` contains English text. Keep both versions in step.
- `assets/style.css`: beige, sage and emerald palette; responsive light and dark themes.
- `assets/app.js`: language, theme and text-size preferences, saved only in localStorage.
- `assets/*-preview.png`: screenshots of the linked live projects.

To add a project, copy a project article and update its name, descriptions in both languages, destination and preview. Do not invent projects or publish private details.

## Preview

Run a static server from this folder, for example:

    python -m http.server 8766 --bind 127.0.0.1

Open http://localhost:8766/. The static introduction and project links also work without JavaScript in French, using the system theme. Dynamic metrics, the calendar, contact decoding and inline form feedback require JavaScript.

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


## Featured repository statistics

Run python scripts/update_repositories.py to refresh assets/repositories.json.
The default branches of the explicitly listed public repositories are counted
over the previous 30 days and across their full history. Release downloads sum uploaded release assets across
all published releases (including prereleases); GitHub source archive downloads
are not included. The download metric is omitted for repositories without releases.

Both snapshots refresh in the same daily workflow after publication. Visitors
only fetch local JSON; they never call the GitHub API. The repository updater
uses the built-in Actions token when scheduled and public unauthenticated reads
when run locally. It preserves the previous snapshot if an update fails.

## Contact form

The homepage reuses the existing Formspree endpoint with a homepage-specific
subject and source field. To separate dashboards later, create another free form
in Formspree and replace the action URL in index.html. Account submission limits
are shared. Ensure any Formspree domain restriction permits the production domain,
and confirm the endpoint's email-notification action is enabled.

The honeypot is hidden from keyboards and screen readers. It complements the
provider's spam filtering; it does not guarantee that all bots are stopped.

See docs/accessibility.md for verification scope and remaining manual checks.

The floating text-size panel shares the services site’s normal, 125% and 150% sizes,
one-second introduction and two-second manual-close delay. It pauses while keyboard
focus is inside and supports Escape. Its preference is saved as jl-hub-taille.
