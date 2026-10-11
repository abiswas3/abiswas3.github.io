# MathJax 3.2.2

Vendored from the official npm package:
https://registry.npmjs.org/mathjax/-/mathjax-3.2.2.tgz

The package's SHA-512 integrity was checked against the npm registry metadata
before extraction. See LICENSE for the upstream Apache 2.0 license.

This directory contains the prebuilt `es5` components, fonts, TeX extensions,
and accessibility data. Unused top-level combined bundles, `latest.js`, and the
Node entry point are omitted. The site loads `es5/tex-chtml.js`; MathJax discovers
its other assets relative to that script, so they are served locally too.

Zola copies these files directly from `static/`. No npm install or internet
connection is required to build or preview equations with `zola serve`.

To update, download a pinned MathJax 3 release, verify its npm package integrity,
and copy its LICENSE and prebuilt es5 assets into a new versioned directory.
Keep all es5 subdirectories and the top-level `tex-chtml.js`, `core.js`,
`loader.js`, and `startup.js` files. Update the script URL in
`templates/base.html` to match the new directory.

Upstream self-hosting documentation:
https://docs.mathjax.org/en/v3.2/web/hosting.html
