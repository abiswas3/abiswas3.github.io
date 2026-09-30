(() => {
  const wideScreen = window.matchMedia('screen and (min-width: 1180px)');

  document.querySelectorAll('.page-content').forEach((content) => {
    const definitions = new Map(
      [...content.querySelectorAll('.footnote-definition')].map((note) => [note.id, note])
    );
    const entries = [];
    const placed = new Set();

    content.querySelectorAll('.footnote-reference a').forEach((reference, index) => {
      const note = definitions.get(decodeURIComponent(reference.hash.slice(1)));
      if (!note || placed.has(note)) return;
      const paragraph = reference.closest('p, li, blockquote');
      if (!paragraph || paragraph.closest('.footnote-definition')) return;

      placed.add(note);
      reference.id ||= `sidenote-reference-${index + 1}`;
      reference.setAttribute('aria-label', `Read footnote ${reference.textContent}`);
      note.classList.add('sidenote');
      note.setAttribute('role', 'note');
      note.setAttribute('aria-label', `Footnote ${reference.textContent}`);

      const label = note.querySelector('.footnote-definition-label');
      if (label) {
        const backlink = document.createElement('a');
        backlink.href = `#${reference.id}`;
        backlink.textContent = label.textContent;
        backlink.setAttribute('aria-label', `Back to footnote ${reference.textContent} reference`);
        label.replaceChildren(backlink);
      }

      // Keep notes in reading order and beside their paragraphs on small screens.
      const previous = entries.at(-1);
      const insertionPoint = previous?.paragraph === paragraph ? previous.note : paragraph;
      insertionPoint.after(note);
      entries.push({ reference, note, paragraph });
    });

    if (!entries.length) return;
    content.classList.add('has-sidenotes');
    document.body.classList.add('has-sidenotes');

    const layout = () => {
      if (!wideScreen.matches) {
        content.style.removeProperty('min-height');
        entries.forEach(({ note }) => note.style.removeProperty('top'));
        return;
      }

      const origin = content.getBoundingClientRect().top;
      let bottom = 0;
      entries.forEach(({ reference, note }) => {
        const top = Math.max(reference.getBoundingClientRect().top - origin, bottom);
        note.style.top = `${top}px`;
        bottom = top + note.getBoundingClientRect().height + 20;
      });
      content.style.minHeight = `${bottom}px`;
    };

    let pending = false;
    const scheduleLayout = () => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => {
        pending = false;
        layout();
      });
    };

    // Math typesetting, fonts, images, and viewport changes can move references.
    const observer = new ResizeObserver(scheduleLayout);
    observer.observe(content);
    entries.forEach(({ note }) => observer.observe(note));
    window.addEventListener('resize', scheduleLayout);
    window.addEventListener('load', scheduleLayout);
    wideScreen.addEventListener('change', scheduleLayout);
    document.fonts.ready.then(scheduleLayout);
    scheduleLayout();
  });
})();
