---
"dark-theme-utils": patch
---

Move initial theme setting to connectedCallback, as you should not set attributes in constructor of custom elements. This will produce a fatal error when doing document.createElement().
