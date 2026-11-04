(function () {
  // Saturated colours with at least 4.5:1 contrast against white.
  var palette = [
    '#2563eb', '#7c3aed', '#c026d3', '#db2777',
    '#c2410c', '#a16207', '#15803d', '#0f766e', '#0369a1'
  ];
  var darkPalette = [
    '#80aaff', '#b69aff', '#ec94f5', '#ff91b8',
    '#ffaa80', '#e8c16b', '#7edca0', '#6ed7cb', '#79c7ed'
  ];

  document.querySelectorAll('.tag-list a').forEach(function (tag) {
    var name = tag.textContent.trim().replace(/^#/, '').normalize('NFC').toLowerCase();
    var hash = 2166136261;
    for (var letter of name) {
      hash = Math.imul(hash ^ letter.codePointAt(0), 16777619) >>> 0;
    }
    tag.style.setProperty('--tag-colour', palette[hash % palette.length]);
    tag.style.setProperty('--tag-colour-dark', darkPalette[hash % palette.length]);
  });
})();
