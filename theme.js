(function () {
  'use strict';

  var key = 'randomwalks-theme';
  var system = window.matchMedia('(prefers-color-scheme: dark)');
  var preference = null;
  var button;

  function valid(value) {
    return value === 'light' || value === 'dark' ? value : null;
  }

  try { preference = valid(localStorage.getItem(key)); } catch (_) {}

  function apply() {
    var theme = preference || (system.matches ? 'dark' : 'light');
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]').content = theme === 'dark' ? '#18191c' : '#ffffff';
    if (button) {
      var label = 'Switch to ' + (theme === 'dark' ? 'light' : 'dark') + ' mode';
      button.setAttribute('aria-label', label);
      button.title = label;
      button.hidden = false;
    }
  }

  // Run before the stylesheet to avoid flashing the wrong theme on navigation.
  apply();

  document.addEventListener('DOMContentLoaded', function () {
    button = document.getElementById('theme-toggle');
    if (!button) return;
    apply();
    button.addEventListener('click', function () {
      preference = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem(key, preference); } catch (_) {}
      apply();
    });
  });

  system.addEventListener('change', function () {
    if (!preference) apply();
  });

  window.addEventListener('storage', function (event) {
    if (event.key === key || event.key === null) {
      preference = valid(event.newValue);
      apply();
    }
  });
})();
