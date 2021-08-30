# dark-theme-utils

## 0.3.0

### Minor Changes

- f56c9b9: Adds a default transition after animation frame, so that users can easily animate theme switches. Use the --theme-transition CSS prop or override the method setupThemeTransition to setup your own.

## 0.2.0

### Minor Changes

- 60f6ad7: Adds tests with 100% coverage, some minor theme state inconsistencies fixed. preventFart returns the theme, this could be useful if people use it as initialization and want to know the initial theme, in order to initialize other things in their app that rely on theme and have to be done before any renders.

## 0.1.0

### Minor Changes

- 8ab2cee: First alpha release of dark-theme-utils.
