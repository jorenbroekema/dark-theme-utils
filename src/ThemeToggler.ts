import { preventFart as _setupInitialTheme } from './prevent-fart';

const template = document.createElement('template');
template.innerHTML = `
  <style>
    .btn:focus {
      outline: none;
      cursor: pointer;
      border: 2px solid var(--theme-toggler-focus-color, #6fa7df);
    }

    .btn {
      display: inline-flex;
      position: relative;
      overflow: hidden;
      border-radius: 999px;
      padding: 4px;
      border: 2px solid var(--theme-toggler-border-color, #374151);
      background-color: var(--theme-toggler-background-color, #f9fafb);
    }

    .sun,
    .moon,
    .thumb {
      width: 18px;
      height: 18px;
      overflow: hidden;
    }

    .moon::selection,
    .sun::selection {
      color: var(--theme-toggler-background-color, #f9fafb);
    }

    .sun,
    .moon {
      font-size: 16px;
      line-height: 20px;
      width: 20px;
      transition: all 0.2s ease-in-out;
      transform: rotate(0deg);
    }

    .sun {
      margin-right: 4px;
      margin-left: -3px;
    }

    :host([theme='dark']) .sun {
      opacity: 0;
      transform: rotate(40deg);
    }

    :host([theme='light']) .moon {
      opacity: 0;
      transform: rotate(-40deg);
    }

    :host([theme='light']) .thumb {
      right: 5px;
      background-color: var(--theme-toggler-light-thumb-background, #eeea1b);
      box-shadow: 0 0 0 2px var(--theme-toggler-light-thumb-border, #c8be25);
    }

    .thumb {
      right: calc(100% - 18px - 3px);
      transition: all 0.1s ease-in-out;
      background-color: var(--theme-toggler-dark-thumb-border, #374151);
      box-shadow: 0 0 0 2px var(--theme-toggler-dark-thumb-border, #111827);
      position: absolute;
      border-radius: 50%;
    }

    .thumb {
      width: 16px;
      height: 16px;
      margin-top: 1px;
    }
  </style>
  <button class="btn">
    <div class="sun">☀️</div>
    <div class="moon">🌚</div>
    <div class="thumb"></div>
  </button>
`;

const registeredComponents: ThemeToggler[] = [];
const themeObserver = new MutationObserver(() => {
  registeredComponents.forEach((comp) => {
    const themeAttr = document.documentElement.getAttribute('theme');
    if (
      comp.theme !== themeAttr &&
      (themeAttr === 'dark' || themeAttr === 'light')
    ) {
      comp.theme = themeAttr;
    }
  });
});
themeObserver.observe(document.documentElement, {
  attributes: true,
  attributeFilter: ['theme'],
});

export class ThemeToggler extends HTMLElement {
  public get theme(): 'dark' | 'light' {
    return this.getAttribute('theme') as 'dark' | 'light';
  }

  public set theme(value: 'dark' | 'light') {
    this.setAttribute('aria-checked', value === 'dark' ? 'true' : 'false');
    this.setAttribute('theme', value);
  }

  private boundKeyDown = this.keyDown.bind(this);

  private boundToggle = this.toggle.bind(this);

  constructor() {
    super();
    this.registerComponentToMO();
    this.attachShadow({ mode: 'open' });
    this.render();
  }

  protected connectedCallback(): void {
    this.setup();
  }

  protected disconnectedCallback(): void {
    this.removeEventListener('keydown', this.boundKeyDown);
    this.removeEventListener('click', this.boundToggle);
  }

  // Override if you want to customize your toggler markup/styles
  protected render(): void {
    this.shadowRoot?.appendChild(template.content.cloneNode(true));
  }

  // Override this if you need to listen to a different MO
  // than the one we set up for you
  protected registerComponentToMO(): void {
    registeredComponents.push(this);
  }

  public toggle(): void {
    if (document.documentElement.getAttribute('theme') === 'light') {
      this.setTheme('dark', true);
    } else {
      this.setTheme('light', true);
    }
  }

  public setTheme(theme: 'dark' | 'light', store = false): void {
    this.theme = theme;
    document.documentElement.setAttribute('theme', theme);
    if (store) {
      localStorage.setItem('theme-dark', theme);
    }
  }

  protected setup(): void {
    this.setupInitialTheme();

    this.setAttribute('role', 'switch');
    this.setAttribute('aria-label', 'Site theme toggler, dark and light');

    this.addEventListener('keydown', this.boundKeyDown);
    this.addEventListener('click', this.boundToggle);
  }

  public setupInitialTheme(): void {
    // reuse preventFart script for theme initialization,
    // but it does not actually prevent FART here, see Docs for more info
    this.theme = _setupInitialTheme();
    this.setupColorSchemeListener();
    this.setupThemeTransition();
  }

  // eslint-disable-next-line class-methods-use-this
  protected setupThemeTransition(): void {
    // Delay this by animation frame so it is not transitioning things on initial render
    requestAnimationFrame(() => {
      document.documentElement.style.setProperty(
        '--theme-transition',
        'background 0.3s ease-in-out, color 0.6s ease-in-out, fill 0.6s ease-in-out',
      );
    });
  }

  protected setupColorSchemeListener(): void {
    // Respond to user preference changes on OS and Browser

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener(
      'change',
      // cannot emulate prefers-color-scheme, ignoring for test coverage
      /* c8 ignore next 9 */
      (ev) => {
        // follow OS preference, by removing preference from local storage
        localStorage.removeItem('theme-dark');
        if (ev.matches) {
          this.setTheme('dark');
        } else {
          this.setTheme('light');
        }
      },
    );
  }

  protected keyDown(ev: KeyboardEvent): void {
    ev.preventDefault();
    switch (ev.key) {
      case 'Enter':
      case ' ':
        this.toggle();
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        this.setTheme('dark', true);
        break;
      case 'ArrowRight':
      case 'ArrowDown':
        this.setTheme('light', true);
        break;
      /* no default */
    }
  }

  public reset(): void {
    this.setTheme('light');
    localStorage.removeItem('theme-dark');
  }

  // eslint-disable-next-line class-methods-use-this
  public teardown(): void {
    this.reset();
    document.documentElement.style.removeProperty('--theme-transition');
  }
}
