---
"dark-theme-utils": minor
---

BREAKING: split up --theme-transition prop which used to cover background, color and fill, into separate CSS properties --theme-background-transition, --theme-color-transition, --theme-fill-transition. Also added a protected property \_cssPropNames which you can override as a subclasser if you just want to change the names of these CSS custom properties to match your library/design system.
