(function () {
  'use strict';
  var root = document.documentElement;
  var contributionData = null;
  var calendarRendered = false;
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
    var totals = document.querySelector('[data-month-totals]');
    var english = root.lang === 'en';
    var locale = english ? 'en-CA' : 'fr-CA';
    var count = new Intl.NumberFormat(locale);
    var summary = count.format(data.total) + (english ? ' contributions in the past year.' : ' contributions au cours de la dernière année.');
    document.querySelector('[data-activity-summary]').textContent = summary;
    grid.setAttribute('aria-label', summary);
    var updated = new Date(data.updated + 'T12:00:00Z').toLocaleDateString(locale, { dateStyle: 'medium', timeZone: 'UTC' });
    document.querySelector('[data-activity-updated]').textContent = (english ? 'Public profile · updated ' : 'Profil public · mise à jour le ') + updated;
    grid.replaceChildren(); months.replaceChildren(); totals.replaceChildren();
    var offset = new Date(data.days[0].date + 'T12:00:00Z').getUTCDay();
    var monthly = {};
    data.days.forEach(function (day, index) {
      var date = new Date(day.date + 'T12:00:00Z');
      var column = Math.floor((index + offset) / 7) + 1;
      var cell = document.createElement('span');
      cell.dataset.level = day.level;
      cell.style.gridColumn = column;
      cell.style.gridRow = date.getUTCDay() + 1;
      cell.setAttribute('aria-hidden', 'true');
      cell.title = date.toLocaleDateString(locale, { dateStyle: 'long', timeZone: 'UTC' }) + ': ' + count.format(day.count) + ' contributions';
      grid.appendChild(cell);
      if (date.getUTCDate() === 1) {
        var label = document.createElement('span');
        label.style.gridColumn = column;
        label.textContent = date.toLocaleDateString(locale, { month: 'short', timeZone: 'UTC' });
        months.appendChild(label);
      }
      var key = day.date.slice(0, 7);
      monthly[key] = (monthly[key] || 0) + day.count;
    });
    var scroller = document.querySelector('.contribution-scroll');
    if (!calendarRendered) scroller.scrollLeft = scroller.scrollWidth;
    calendarRendered = true;
    Object.keys(monthly).forEach(function (month) {
      var item = document.createElement('li');
      item.textContent = new Date(month + '-15T12:00:00Z').toLocaleDateString(locale, { month: 'long', year: 'numeric', timeZone: 'UTC' }) + ': ' + count.format(monthly[month]);
      totals.appendChild(item);
    });
  }
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
    document.querySelector('.activity-details').hidden = true;
  });
  language(read('jl-hub-lang') === 'en' ? 'en' : 'fr');
})();
