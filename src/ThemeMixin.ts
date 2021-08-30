/* eslint-disable max-classes-per-file */
import { dedupeMixin } from '@open-wc/dedupe-mixin';

declare global {
  interface HTMLElement {
    connectedCallback?(): void;
  }
}

// Expected any type for mixins, this is enforced by TS
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare type Constructor<T> = new (...args: any[]) => T;
declare type themeType = 'dark' | 'light' | '';
declare class ThemeHost {
  theme: themeType;
}
declare type ThemeMixinType = <T extends Constructor<HTMLElement>>(
  superclass: T,
) => T &
  Constructor<ThemeHost> &
  Pick<typeof ThemeHost, keyof typeof ThemeHost>;

const registeredComponents: (ThemeHost & HTMLElement)[] = [];
const themeObserver = new MutationObserver(() => {
  registeredComponents.forEach((comp) => {
    comp.theme = (document.documentElement.getAttribute('theme') ||
      '') as themeType;
  });
});
themeObserver.observe(document.documentElement, {
  attributes: true,
  attributeFilter: ['theme'],
});

/**
 * Sets internal theme property + attribute
 * when the theme on <html> element changes.
 * Then it is easy to style the component based on global theme:
 * css`
 *   :host([theme="dark"]) { ... }
 * `
 */
export const ThemeMixinImplementation: ThemeMixinType = (superclass) =>
  class extends superclass {
    get theme(): themeType {
      const themeAttr = this.getAttribute('theme');
      if (themeAttr === 'light' || themeAttr === 'dark') {
        return themeAttr;
      }
      return '';
    }

    set theme(val: themeType) {
      this.setAttribute('theme', val);
    }

    // passing args + any type required for mixin pattern since it might be required for passed in superclass
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    constructor(...args: any[]) {
      super();
      registeredComponents.push(this);
    }

    connectedCallback() {
      if (super.connectedCallback) {
        super.connectedCallback();
      }
      const docTheme = document.documentElement.getAttribute('theme') || '';
      if (docTheme === 'light' || docTheme === 'dark' || docTheme === '') {
        this.theme = docTheme;
      }
    }
  };

export const ThemeMixin = dedupeMixin(ThemeMixinImplementation);
