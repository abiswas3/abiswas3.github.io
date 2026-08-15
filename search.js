(function () {
  'use strict';

  var palette = document.getElementById('command-palette');
  var trigger = document.querySelector('.command-trigger');
  if (!palette || !trigger) return;

  var input = document.getElementById('command-input');
  var results = document.getElementById('command-results');
  var status = palette.querySelector('.command-status');
  var shortcut = trigger.querySelector('kbd');
  var entries = null;
  var visible = [];
  var selected = 0;
  var lastFocus = null;

  if (!/Mac|iPhone|iPad/.test(navigator.platform)) shortcut.textContent = 'Ctrl K';

  function normalise(value) {
    return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  function match(title, query) {
    var text = normalise(title);
    var needle = normalise(query.trim());
    if (!needle) return { score: 0, positions: [] };

    var exact = text.indexOf(needle);
    if (exact !== -1) {
      var exactPositions = [];
      for (var e = 0; e < needle.length; e += 1) exactPositions.push(exact + e);
      return {
        score: 4000 - exact * 12 - text.length + (exact === 0 ? 1200 : 0),
        positions: exactPositions
      };
    }

    var positions = [];
    var cursor = 0;
    var score = 0;
    var previous = -2;

    for (var q = 0; q < needle.length; q += 1) {
      var found = text.indexOf(needle[q], cursor);
      if (found === -1) return null;
      positions.push(found);
      score += 30;
      if (found === previous + 1) score += 35;
      if (found === 0 || /[\s\-/:]/.test(text[found - 1])) score += 45;
      score -= Math.max(0, found - previous - 1) * 2;
      previous = found;
      cursor = found + 1;
    }

    return { score: score - text.length, positions: positions };
  }

  function sectionFor(path) {
    if (path.indexOf('/blog/') === 0) return 'Notes';
    if (path.indexOf('/travel/') === 0) return 'Misc';
    if (path.indexOf('/publications/') === 0) return 'Publication';
    if (path.indexOf('/cv/') === 0) return 'CV';
    return 'Home';
  }

  function titleWithMarks(title, positions) {
    var fragment = document.createDocumentFragment();
    var marked = new Set(positions);
    var run = '';
    var inMark = false;

    function append() {
      if (!run) return;
      var node = inMark ? document.createElement('mark') : document.createTextNode(run);
      if (inMark) node.textContent = run;
      fragment.appendChild(node);
      run = '';
    }

    Array.from(title).forEach(function (character, index) {
      var nextMark = marked.has(index);
      if (nextMark !== inMark) {
        append();
        inMark = nextMark;
      }
      run += character;
    });
    append();
    return fragment;
  }

  function select(index) {
    if (!visible.length) return;
    selected = (index + visible.length) % visible.length;
    results.querySelectorAll('.command-result').forEach(function (item, itemIndex) {
      var active = itemIndex === selected;
      item.classList.toggle('is-selected', active);
      item.setAttribute('aria-selected', String(active));
      if (active) {
        input.setAttribute('aria-activedescendant', item.id);
        item.scrollIntoView({ block: 'nearest' });
      }
    });
  }

  function render() {
    if (!entries) return;
    var query = input.value;

    visible = entries.map(function (entry) {
      var matched = match(entry.title, query);
      return matched ? { entry: entry, score: matched.score, positions: matched.positions } : null;
    }).filter(Boolean).sort(function (left, right) {
      return right.score - left.score || left.entry.title.localeCompare(right.entry.title);
    }).slice(0, 12);

    results.replaceChildren();
    selected = 0;

    visible.forEach(function (item, index) {
      var row = document.createElement('li');
      var link = document.createElement('a');
      var title = document.createElement('span');
      var section = document.createElement('span');

      row.className = 'command-result' + (index === 0 ? ' is-selected' : '');
      row.id = 'command-result-' + index;
      row.setAttribute('role', 'option');
      row.setAttribute('aria-selected', String(index === 0));
      link.href = item.entry.path;
      title.appendChild(titleWithMarks(item.entry.title, item.positions));
      section.className = 'command-result__section';
      section.textContent = sectionFor(item.entry.path);
      link.append(title, section);
      row.appendChild(link);
      results.appendChild(row);
    });

    if (visible.length) {
      status.textContent = '';
      input.setAttribute('aria-activedescendant', 'command-result-0');
    } else {
      status.textContent = 'No matching titles.';
      input.removeAttribute('aria-activedescendant');
    }
  }

  function load() {
    if (entries) return Promise.resolve();
    status.textContent = 'Loading titles…';
    return fetch(palette.dataset.indexUrl, { cache: 'no-cache' })
      .then(function (response) {
        if (!response.ok) throw new Error('Search index could not be loaded.');
        return response.json();
      })
      .then(function (data) {
        entries = data.filter(function (entry) { return entry.title && entry.path; });
        render();
      })
      .catch(function () {
        status.textContent = 'Search is unavailable.';
      });
  }

  function open() {
    if (!palette.hidden) return;
    lastFocus = document.activeElement;
    palette.hidden = false;
    document.body.classList.add('command-is-open');
    input.value = '';
    input.focus();
    load().then(render);
  }

  function close() {
    if (palette.hidden) return;
    palette.hidden = true;
    document.body.classList.remove('command-is-open');
    input.removeAttribute('aria-activedescendant');
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
  }

  trigger.addEventListener('click', open);
  palette.querySelector('[data-command-close]').addEventListener('click', close);
  input.addEventListener('input', render);

  results.addEventListener('mousemove', function (event) {
    var row = event.target.closest('.command-result');
    if (!row) return;
    select(Array.prototype.indexOf.call(results.children, row));
  });

  document.addEventListener('keydown', function (event) {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      palette.hidden ? open() : close();
      return;
    }
    if (palette.hidden) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      select(selected + 1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      select(selected - 1);
    } else if (event.key === 'Enter' && visible[selected]) {
      event.preventDefault();
      window.location.href = visible[selected].entry.path;
    }
  });
})();
