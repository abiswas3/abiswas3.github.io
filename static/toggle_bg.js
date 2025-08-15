  function toggleNav() {
    document.getElementById('navMenu').classList.toggle('show');
  }
  document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('mode-toggle');
  if (!toggle) return;

  // Load theme from localStorage
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    document.body.classList.remove('light-mode');
    toggle.checked = true;
  } else {
    document.body.classList.add('light-mode');
    document.body.classList.remove('dark-mode');
    toggle.checked = false;
  }

  // Toggle theme on checkbox change
  toggle.addEventListener('change', () => {
    if (toggle.checked) {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
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
