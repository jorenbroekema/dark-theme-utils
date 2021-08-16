---
"dark-theme-utils": minor
---

Adds tests with 100% coverage, some minor theme state inconsistencies fixed. preventFart returns the theme, this could be useful if people use it as initialization and want to know the initial theme, in order to initialize other things in their app that rely on theme and have to be done before any renders.
