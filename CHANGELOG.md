# dark-theme-utils

## 0.4.0

### Minor Changes

- 66df75b: BREAKING: split up --theme-transition prop which used to cover background, color and fill, into separate CSS properties --theme-background-transition, --theme-color-transition, --theme-fill-transition. Also added a protected property \_cssPropNames which you can override as a subclasser if you just want to change the names of these CSS custom properties to match your library/design system.

## 0.3.5

### Patch Changes

- ca85f37: Fix \_localStorageKey so that prevent-fart / initial theme setting also takes this key into account.

## 0.3.4

### Patch Changes

- b9df4dc: Remove postinstall script husky as it is not intended to run when end-users install dark-theme-utils. Make it a prepare script instead with npx.

## 0.3.3

### Patch Changes

- 44d0830: Allow changing the key for localStorage on which the theme setting is stored, for subclassers of ThemeToggler.

## 0.3.2

### Patch Changes

- 3744c0e: Add repository field to package.json for NPM.

## 0.3.1

### Patch Changes

- b581bfb: Move initial theme setting to connectedCallback, as you should not set attributes in constructor of custom elements. This will produce a fatal error when doing document.createElement().

## 0.3.0

### Minor Changes

- f56c9b9: Adds a default transition after animation frame, so that users can easily animate theme switches. Use the --theme-transition CSS prop or override the method setupThemeTransition to setup your own.

## 0.2.0

### Minor Changes

- 60f6ad7: Adds tests with 100% coverage, some minor theme state inconsistencies fixed. preventFart returns the theme, this could be useful if people use it as initialization and want to know the initial theme, in order to initialize other things in their app that rely on theme and have to be done before any renders.

## 0.1.0

### Minor Changes

- 8ab2cee: First alpha release of dark-theme-utils.
