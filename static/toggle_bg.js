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
