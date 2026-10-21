(function () {
  'use strict';
  var root = document.documentElement;
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
  language(read('jl-hub-lang') === 'en' ? 'en' : 'fr');
})();
