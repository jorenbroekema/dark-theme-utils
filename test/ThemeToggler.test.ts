import { expect, fixture as _fixture, defineCE } from '@open-wc/testing';
import { ThemeToggler } from '../src/ThemeToggler';
import '../theme-toggler';

describe('ThemeToggler', () => {
  const fixture = _fixture as (arg: string) => Promise<Subclasser>;
  let el: ThemeToggler;
  let subclassEl: Subclasser;

  class Subclasser extends ThemeToggler {
    protected _localStorageKey = 'foo-dark';

    protected _cssPropNames = {
      background: '--foo-background-transition',
      color: '--foo-color-transition',
      fill: '--foo-fill-transition',
    };
  }
  const tag = defineCE(Subclasser);

  afterEach(() => {
    el?.teardown();
    subclassEl?.teardown();
  });

  it('renders a visual toggle element', async () => {
    el = await fixture(`<theme-toggler></theme-toggler>`);
    expect(el).shadowDom.to.equal(`
      <button class="btn">
        <div class="sun">☀️</div>
        <div class="moon">🌚</div>
        <div class="thumb"></div>
      </button>
    `);
  });

  it('has a public toggle method to toggle the theme', async () => {
    el = await fixture(`<theme-toggler></theme-toggler>`);
    expect(el.theme).to.equal('light');
    el.toggle();
    expect(el.theme).to.equal('dark');
    el.toggle();
    expect(el.theme).to.equal('light');
  });

  it('has a public setTheme method to toggle the theme, optionally storing to localStorage', async () => {
    el = await fixture(`<theme-toggler></theme-toggler>`);
    expect(el.theme).to.equal('light');
    el.setTheme('dark');
    expect(el.theme).to.equal('dark');
    el.setTheme('light');
    expect(el.theme).to.equal('light');
    expect(localStorage.getItem('theme-dark')).to.be.null;
    el.setTheme('light', true);
    expect(localStorage.getItem('theme-dark')).to.equal('light');
  });

  it('has a public reset method which clear localStorage and sets theme back to light', async () => {
    el = await fixture(`<theme-toggler></theme-toggler>`);
    el.toggle();
  });

  it('stores user preference to local storage', async () => {
    el = await fixture(`<theme-toggler></theme-toggler>`);
    expect(localStorage.getItem('theme-dark')).to.be.null;

    /**
     * Following methods and interactions STORE:
     * - toggle()
     * - setTheme if passing true as 2nd arg
     * - click interaction
     * - space/enter key
     * - arrow keys
     */

    el.toggle();
    expect(localStorage.getItem('theme-dark')).to.equal('dark');
    el.reset();

    el.setTheme('dark', true);
    expect(localStorage.getItem('theme-dark')).to.equal('dark');
    el.reset();

    el.click();
    expect(localStorage.getItem('theme-dark')).to.equal('dark');
    el.reset();

    el.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
    expect(localStorage.getItem('theme-dark')).to.equal('dark');
    el.reset();

    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(localStorage.getItem('theme-dark')).to.equal('dark');
    el.reset();

    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
    expect(localStorage.getItem('theme-dark')).to.equal('dark');
    el.reset();

    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    expect(localStorage.getItem('theme-dark')).to.equal('dark');
    el.reset();

    el.setTheme('dark', true);
    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    expect(localStorage.getItem('theme-dark')).to.equal('light');
    el.reset();

    el.setTheme('dark', true);
    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    expect(localStorage.getItem('theme-dark')).to.equal('light');
    el.reset();

    /**
     * Following methods and interactions DO NOT STORE
     * This, because they are imperative and not explicit user "choices"
     */

    el.setTheme('dark');
    expect(localStorage.getItem('theme-dark')).to.be.null;
    el.reset();

    // discouraged, as it only sets internal theme prop but does
    // not affect global theme. Used by MutationObservers to sync
    el.theme = 'dark';
    expect(localStorage.getItem('theme-dark')).to.be.null;
    el.reset();

    // E.g. theme was set already by browser / OS
    document.documentElement.setAttribute('theme', 'dark');
    el.setupInitialTheme(); // doesn't store
    expect(localStorage.getItem('theme-dark')).to.be.null;
    el.reset();
  });

  it('sets default theme transition CSS custom properties', async () => {
    el = await fixture(`<theme-toggler></theme-toggler>`);

    ['color', 'fill'].forEach((prop) => {
      expect(
        document.documentElement.style.getPropertyValue(
          `--theme-${prop}-transition`,
        ),
      ).to.equal(`${prop} 0.6s ease-in-out`);
    });

    expect(
      document.documentElement.style.getPropertyValue(
        '--theme-background-transition',
      ),
    ).to.equal('background 0.3s ease-in-out');
    el.teardown();

    ['background', 'color', 'fill'].forEach((prop) => {
      expect(
        document.documentElement.style.getPropertyValue(
          `--theme-${prop}-transition`,
        ),
      ).to.equal('');
    });
  });

  describe('Accessibility', () => {
    it('is accessible', async () => {
      el = await fixture(`<theme-toggler></theme-toggler>`);
      expect(el).to.be.accessible;
    });

    it('uses role "switch" to make clear to the user that it is a state-toggling button', async () => {
      el = await fixture(`<theme-toggler></theme-toggler>`);
      expect(el.getAttribute('role')).to.equal('switch');
    });

    it('has an aria-label to make clear to the user what the button does', async () => {
      el = await fixture(`<theme-toggler></theme-toggler>`);
      expect(el.getAttribute('aria-label')).to.equal(
        'Site theme toggler, dark and light',
      );
    });

    it('has an aria-checked attribute which is required for switch role buttons', async () => {
      el = await fixture(`<theme-toggler></theme-toggler>`);
      expect(el.getAttribute('aria-checked')).to.equal('false');
      el.toggle();
      expect(el.getAttribute('aria-checked')).to.equal('true');
      el.toggle();
      expect(el.getAttribute('aria-checked')).to.equal('false');
    });
  });

  describe('Subclassers', () => {
    it('supports overriding the local storage key', async () => {
      subclassEl = await fixture(`<${tag}></${tag}>`);
      expect(localStorage.getItem('foo-dark')).to.be.null;
      subclassEl.setTheme('dark', true);
      expect(localStorage.getItem('foo-dark')).to.equal('dark');
      subclassEl.setTheme('light', true);
      expect(localStorage.getItem('foo-dark')).to.equal('light');
      subclassEl.teardown();

      localStorage.setItem('foo-dark', 'dark');
      subclassEl = await fixture(`<${tag}></${tag}>`);
      expect(subclassEl.theme).to.equal('dark');
    });

    it('supports setting your own theme transition CSS custom property names', async () => {
      subclassEl = await fixture(`<${tag}></${tag}>`);

      ['color', 'fill'].forEach((prop) => {
        expect(
          document.documentElement.style.getPropertyValue(
            `--foo-${prop}-transition`,
          ),
        ).to.equal(`${prop} 0.6s ease-in-out`);
      });
      expect(
        document.documentElement.style.getPropertyValue(
          '--foo-background-transition',
        ),
      ).to.equal('background 0.3s ease-in-out');

      subclassEl.teardown();

      ['background', 'color', 'fill'].forEach((prop) => {
        expect(
          document.documentElement.style.getPropertyValue(
            `--foo-${prop}-transition`,
          ),
        ).to.equal('');
      });
    });
  });
});
