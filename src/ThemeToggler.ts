const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      cursor: pointer;
    }

    :host(:focus) {
      outline: none;

      border-radius: 12px;
    }

    :host(:focus) .container {
      border: 2px solid var(--theme-toggler-focus-color, #6fa7df);
    }

    .container {
      display: inline-flex;
      position: relative;
      overflow: hidden;
      border-radius: 12.5px;
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
      line-height: 17px;
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
  <button class="container">
    <div class="sun">☀️</div>
    <div class="moon">🌚</div>
    <div class="thumb"></div>
  </button>
`;

const registeredComponents: ThemeToggler[] = [];
const themeObserver = new MutationObserver(() => {
  registeredComponents.forEach((comp) => {
    comp.theme = (document.documentElement.getAttribute('theme') || 'light') as
      | 'dark'
      | 'light';
  });
});
themeObserver.observe(document.documentElement, {
  attributes: true,
  attributeFilter: ['theme'],
});

export class ThemeToggler extends HTMLElement {
  get theme(): 'dark' | 'light' {
    return (this.getAttribute('theme') || 'light') as 'dark' | 'light';
  }

  set theme(value: 'dark' | 'light') {
    this.setAttribute('aria-checked', value === 'dark' ? 'true' : 'false');
    this.setAttribute('theme', value);
  }

  boundKeyDown = this.keyDown.bind(this);

  boundToggle = this.toggle.bind(this);

  shadowRoot = this.attachShadow({ mode: 'open' });

  constructor() {
    super();
    registeredComponents.push(this);
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback(): void {
    this.setup();
  }

  disconnectedCallback(): void {
    this.removeEventListener('keydown', this.boundKeyDown);
    this.removeEventListener('click', this.boundToggle);
  }

  toggle(): void {
    if (document.documentElement.getAttribute('theme') === 'light') {
      this.setTheme('dark', true);
    } else {
      this.setTheme('light', true);
    }
  }

  setTheme(theme: 'dark' | 'light', store = false): void {
    this.theme = theme;
    document.documentElement.setAttribute('theme', theme);
    if (store) {
      localStorage.setItem('theme-dark', theme);
    }
  }

  setup(): void {
    this.setupInitialTheme();

    this.setAttribute('role', 'switch');
    this.setAttribute('aria-label', 'Site theme toggler, dark and light');

    this.addEventListener('keydown', this.boundKeyDown);
    this.addEventListener('click', this.boundToggle);
  }

  setupInitialTheme(): void {
    const userPrefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches;

    // Priority is: 1) saved preference 2) browser/os preference 3) default 'light'
    this.theme =
      (localStorage.getItem('theme-dark') as 'dark' | 'light') ||
      (userPrefersDark ? 'dark' : 'light');

    // Respond to user preference changes on OS and Browser
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (ev) => {
        // follow OS preference, by removing from preference local storage
        localStorage.removeItem('theme-dark');

        if (ev.matches) {
          this.setTheme('dark');
        } else {
          this.setTheme('light');
        }
      });
  }

  keyDown(ev: KeyboardEvent): void {
    switch (ev.key) {
      case 'Enter':
      case ' ':
        ev.preventDefault();
        this.toggle();
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        ev.preventDefault();
        this.setTheme('dark', true);
        break;
      case 'ArrowRight':
      case 'ArrowDown':
        ev.preventDefault();
        this.setTheme('light', true);
        break;
      /* no default */
    }
  }
}
