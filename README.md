# Dark Theme utils

A repository containing some useful utilities for dark mode.

All of these packages work everywhere, built on browser standards (Web Components).
With 1 small exception (`ThemeMixin`), these are completely dependency-free and should work anywhere out of the box.

## Features

- Theme Toggler webcomponent: UI component to toggle the theme
- Theme Mixin: Mixin to wrap your Web Components with that syncs an internal theme prop with global theme, for styling purposes.
- Anti-FART script (Flash of inAccurate coloR Theme)

### Theme Toggler

![toggler gif](https://github.com/jorenbroekema/dark-theme-utils/blob/main/assets/toggler.gif)

Toggler UI component that toggles the theme between "light" to "dark".

#### Toggler Features

- Visual UI toggle
- Accessible
- Extendible
- Works everywhere
- Responds to space, enter and all 4 arrow keys
- Uses OS/Browser color-scheme preference by default
- Responds to OS/Browser color-scheme preference changes
- Stores user preference in localStorage when toggling
- Sync theme state by listening to global `theme` attribute, meaning multiple togglers on the same page will work too

Using the toggler is pretty straight forward. Import the custom element definition file.

```html
<script type="module" src="dark-theme-utils/theme-toggler"></script>
<theme-toggler></theme-toggler>
```

Extending the toggler is also possible:

```js
import { ThemeToggler } from 'dark-theme-utils';

class CustomThemeToggler extends ThemeToggler {
  _localStorageKey = 'my-theme';

  _cssPropNames = {
    background: '--foo-bg',
    color: '--foo-color',
    fill: '--foo-fill',
  }
}
customElements.define('custom-theme-toggler', CustomThemeToggler);
```

You can override all protected/public methods, and here's two props that you may also change:

- `_localStorageKey`: Change this if you want to rely on a different key for localStorage, default is 'theme-dark' but you may want something less generic.
- `_cssPropNames`: Change this if you want to use different CSS custom prop names for the background, color and fill transition that the toggler sets up by default and which you can use on your page. See demo files for example.

### Theme Mixin

When you have components utilizing ShadowDOM style encapsulation, you won't be able to style those components based on a global theme attribute out of the box.

`ThemeMixin` is a mixin utility that, when wrapping your ShadowDOM components, will reflect the global theme attribute to a local theme attribute.

> ThemeMixin depends on `@open-wc/dedupe-mixin` which is important for deduplicating multiple applications of this same mixin on a class.
> It relies on this dependency with a bare import specifier so for this component it is important that this is resolved to a relative/absolute path.

```js
import { ThemeMixin } from 'dark-theme-utils';

class FooElement extends ThemeMixin(HTMLElement) {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
    <style>
      :host {
        width: 20px;
        height: 20px;
        display: block;
        background-color: black;
      }

      :host([theme="dark"]) {
        background-color: white;
      }
    </style>
  `;
  }
}
```

As you can see, we have a selector `:host([theme="dark"])` which utilizes the fact that the ThemeMixin syncs the global theme attribute to the component.
`html[theme="dark"] :host` would not work.

> When the global theme attribute is changed, all components applying `ThemeMixin` change their theme attribute automatically.
> Every implementing component of `ThemeMixin` responds to a `MutationObserver` that watches the global theme attribute.

### Anti-FART script

FART (Flash of inAccurate coloR Theme) can happen when your page is rendering before the theme attribute has been set on the `html` element.

This means it will render `<html>` instead of `<html theme="dark">` which causes light-mode to render.
Right after, the code setting the theme executes, changing it to `<html theme="dark">`.
The user will see a flash of light theme because of this when (re)loading the page.

To prevent this from happening, we should set the initial theme attribute on the `html` element before anything renders,
which can be done by putting this script in the `<head>` of your page which will be parse-blocking, therefore first-render-blocking.

If you don't have any transpilation/compilation steps, you can put this in your `.html` file(s):

```html
<head>
  <script>
    const userPrefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches;
    const darkTheme =
      localStorage.getItem('theme-dark') ||
      (userPrefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('theme', darkTheme);
  </script>
</head>
```

If your HTML files are generated by a build-tool like Rollup or Webpack, which is probably more common, or by a dev-server during local development, you can import the `preventFart` function from the `dark-theme-utils` package and use these build-tools to bundle it and insert it into the `<head>`:

```js
/** 
 * 1) bundle this code so it is not using ES Modules
 * 2) insert it into head inside a script tag (without type="module"!) for html files
 */
import { preventFart } from 'dark-theme-utils';

preventFart();
```

> In the future, a prebundled prevent-fart.js will be published so you can just insert `<script src="...">` either manually or by build-tool.

## Local dev

In order to contribute or run locally, take a look at our [Contributing Guidelines](./CONTRIBUTING.md)
