window.MathJax = {
  tex: {
    inlineMath: [['$', '$'], ['\\(', '\\)']],
    displayMath: [['$$', '$$'], ['\\[', '\\]']]
  },
  options: {
    ignoreHtmlClass: '.*',          // ignore nothing (default is usually something like "tex2jax_ignore")
    processHtmlClass: 'remark'      // process math inside divs with class 'remark'
  }
};

