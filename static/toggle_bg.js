  function toggleNav() {
    document.getElementById('navMenu').classList.toggle('show');
  }
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('mode-toggle');
  if (!toggle) return;

  // Initialize checkbox state
  if (document.body.classList.contains('dark-mode')) {
    toggle.checked = true;
  } else {
    toggle.checked = false;
  }

  // Toggle theme on checkbox change
  toggle.addEventListener('change', () => {
    if (toggle.checked) {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
    }
  });
});


document.querySelectorAll('a[role="doc-biblioref"]').forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();
    const targetId = link.getAttribute('href').substring(1); // remove #
    const targetElem = document.getElementById(targetId);
    if (!targetElem) return;

    // Remove highlight from any previously highlighted entries
    document.querySelectorAll('.csl-entry.highlight').forEach(el => {
      el.classList.remove('highlight');
    });

    // Add highlight to the target entry
    targetElem.classList.add('highlight');

    // Optionally scroll to target smoothly
    targetElem.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Remove highlight after 3 seconds
    setTimeout(() => {
      targetElem.classList.remove('highlight');
    }, 3000);
  });
});
