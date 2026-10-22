(function () {
  'use strict';
  var root = document.documentElement;
  var contributionData = null;
  var calendarRendered = false;
  var repositoryData = null;
  var languageButton = document.querySelector('.language-toggle');
  var themeButton = document.querySelector('.theme-toggle');
  var translated = document.querySelectorAll('[data-en]');
  var labelled = document.querySelectorAll('[data-en-label]');
  var images = document.querySelectorAll('[data-en-alt]');
  function read(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }
  function save(key, value) { try { localStorage.setItem(key, value); } catch (e) {} }
  translated.forEach(function (el) { el.dataset.fr = el.textContent; });
  labelled.forEach(function (el) { el.dataset.frLabel = el.getAttribute('aria-label'); });
  images.forEach(function (el) { el.dataset.frAlt = el.alt; });
  function language(value) {
    root.lang = value;
    translated.forEach(function (el) { el.textContent = value === 'en' ? el.dataset.en : el.dataset.fr; });
    labelled.forEach(function (el) { el.setAttribute('aria-label', value === 'en' ? el.dataset.enLabel : el.dataset.frLabel); });
    images.forEach(function (el) { el.alt = value === 'en' ? el.dataset.enAlt : el.dataset.frAlt; });
    languageButton.textContent = value === 'en' ? 'FR' : 'EN';
    languageButton.lang = value === 'en' ? 'fr' : 'en';
    languageButton.setAttribute('aria-label', value === 'en' ? 'Lire en français' : 'Read in English');
    document.title = value === 'en' ? 'Jonathan Lafleur — Projects & links' : 'Jonathan Lafleur — Projets & liens';
    document.querySelector('meta[name="description"]').content = value === 'en'
      ? 'Projects by Jonathan Lafleur: computer services, Kohai and links to GitHub and LinkedIn.'
      : 'Les projets de Jonathan Lafleur : services informatiques, Kohai et liens vers GitHub et LinkedIn.';
    updateThemeButton();
    if (contributionData) renderContributions(contributionData);
    if (repositoryData) renderRepositories(repositoryData);
    document.dispatchEvent(new Event('languagechange'));
  }
  function isDark() { return root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches; }
  function updateThemeButton() {
    var dark = isDark();
    themeButton.setAttribute('aria-pressed', String(dark));
    themeButton.setAttribute('aria-label', root.lang === 'en' ? (dark ? 'Use light theme' : 'Use dark theme') : (dark ? 'Activer le thème clair' : 'Activer le thème sombre'));
    document.querySelector('meta[name="theme-color"]').content = dark ? '#202322' : '#f1ebdf';
  }
  languageButton.addEventListener('click', function () { var next = root.lang === 'fr' ? 'en' : 'fr'; save('jl-hub-lang', next); language(next); });
  themeButton.addEventListener('click', function () { var next = isDark() ? 'light' : 'dark'; root.dataset.theme = next; save('jl-hub-theme', next); updateThemeButton(); });
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateThemeButton);
  document.getElementById('year').textContent = new Date().getFullYear();
  function renderContributions(data) {
    var grid = document.querySelector('.contribution-grid');
    var months = document.querySelector('.contribution-months');
    var english = root.lang === 'en';
    var locale = english ? 'en-CA' : 'fr-CA';
    var count = new Intl.NumberFormat(locale);
    var summary = count.format(data.total) + (english ? ' contributions in the past year.' : ' contributions au cours de la dernière année.');
    document.querySelector('[data-activity-summary]').textContent = summary;
    grid.setAttribute('aria-label', summary);
    var updated = new Date(data.updated + 'T12:00:00Z').toLocaleDateString(locale, { dateStyle: 'medium', timeZone: 'UTC' });
    document.querySelector('[data-activity-updated]').textContent = (english ? 'Public profile · updated ' : 'Profil public · mise à jour le ') + updated;
    grid.replaceChildren(); months.replaceChildren();
    var offset = new Date(data.days[0].date + 'T12:00:00Z').getUTCDay();
    data.days.forEach(function (day, index) {
      var date = new Date(day.date + 'T12:00:00Z');
      var column = Math.floor((index + offset) / 7) + 1;
      var cell = document.createElement('span');
      cell.dataset.level = day.level;
      cell.style.gridColumn = column;
      cell.style.gridRow = date.getUTCDay() + 1;
      cell.setAttribute('role', 'img');
      cell.tabIndex = index === data.days.length - 1 ? 0 : -1;
      cell.title = date.toLocaleDateString(locale, { dateStyle: 'long', timeZone: 'UTC' }) + ': ' + count.format(day.count) + ' contributions';
      cell.setAttribute('aria-label', cell.title);
      grid.appendChild(cell);
      if (date.getUTCDate() === 1) {
        var label = document.createElement('span');
        label.style.gridColumn = column;
        label.textContent = date.toLocaleDateString(locale, { month: 'short', timeZone: 'UTC' });
        months.appendChild(label);
      }
    });
    var scroller = document.querySelector('.contribution-scroll');
    if (!calendarRendered) scroller.scrollLeft = scroller.scrollWidth;
    calendarRendered = true;
  }
  document.querySelector('.contribution-grid').addEventListener('keydown', function(event) {
    var cells = Array.from(this.children);
    var index = cells.indexOf(document.activeElement);
    if (index < 0) return;
    var offsets = {ArrowLeft:-7,ArrowRight:7,ArrowUp:-1,ArrowDown:1};
    var next = event.key === 'Home' ? 0 : event.key === 'End' ? cells.length - 1
      : Object.prototype.hasOwnProperty.call(offsets, event.key) ? index + offsets[event.key] : null;
    if (next === null) return;
    event.preventDefault();
    next = Math.max(0, Math.min(cells.length - 1, next));
    cells[index].tabIndex = -1; cells[next].tabIndex = 0;
    cells[next].focus({preventScroll:true});
    cells[next].scrollIntoView({block:'nearest',inline:'nearest'});
  });
  fetch('assets/contributions.json', { cache: 'no-cache' }).then(function (response) {
    if (!response.ok) throw new Error('Calendar unavailable');
    return response.json();
  }).then(function (data) {
    if (!Array.isArray(data.days) || !data.days.length) throw new Error('Calendar incomplete');
    contributionData = data;
    renderContributions(data);
  }).catch(function () {
    document.querySelector('.contribution-scroll').hidden = true;
    document.querySelector('.contribution-caption').hidden = true;
  });

  function renderRepositories(data) {
    var english = root.lang === 'en';
    var count = new Intl.NumberFormat(english ? 'en-CA' : 'fr-CA');
    document.querySelectorAll('[data-repositories]').forEach(function (slot) {
      slot.replaceChildren();
      var heading = document.createElement('span');
      heading.className = 'stats-label';
      heading.textContent = english ? 'Stats:' : 'Stats :';
      var values = document.createElement('div');
      values.className = 'stats-values';
      slot.dataset.repositories.split(' ').forEach(function (name) {
        var repo = data.repositories[name];
        if (!repo) return;
        var row = document.createElement('p');
        row.className = 'repo-stat';
        if (slot.dataset.repositories.includes(' ')) {
          var label = document.createElement('strong');
          label.textContent = name === 'cad-mouse-mk2' ? 'Firmware' : (english ? 'Companion app' : 'Application compagnon');
          row.appendChild(label);
        }
        var metrics = document.createElement('span');
        metrics.className = 'stat-metrics';
        var commits = document.createElement('span');
        commits.textContent = (english ? 'Commits: ' : 'Commits : ') + count.format(repo.commitsAllTime);
        metrics.appendChild(commits);
        if (repo.downloads > 0) {
          var separator = document.createElement('span');
          separator.textContent = '/';
          separator.setAttribute('aria-hidden', 'true');
          var downloads = document.createElement('span');
          downloads.textContent = (english ? 'Downloads: ' : 'Téléchargements : ') + count.format(repo.downloads);
          metrics.append(separator, downloads);
        }
        row.appendChild(metrics);
        values.appendChild(row);
      });
      slot.append(heading, values);
    });
  }
  fetch('assets/repositories.json', {cache:'no-cache'}).then(function (response) {
    if (!response.ok) throw new Error('Repository activity unavailable');
    return response.json();
  }).then(function(data) { repositoryData = data; renderRepositories(data); }).catch(function() {
    document.querySelectorAll('.project-stats').forEach(function(slot) { slot.hidden = true; });
  });

  language(read('jl-hub-lang') === 'en' ? 'en' : 'fr');
})();
