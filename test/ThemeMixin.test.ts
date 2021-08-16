import {
  expect,
  fixture as _fixture,
  defineCE,
  nextFrame,
} from '@open-wc/testing';
import { preventFart } from '../src/prevent-fart';
import { ThemeMixin } from '../src/ThemeMixin';

describe('ThemeMixin', () => {
  class TestEl extends ThemeMixin(HTMLElement) {}
  const tag = defineCE(TestEl);
  const fixture = _fixture as (arg: string) => Promise<TestEl>;

  beforeEach(() => {
    // initializes theme, as is expected from users to do by calling this,
    // or by a ThemeToggler component being connected to DOM
    preventFart();
  });

  afterEach(() => {
    localStorage.removeItem('theme-dark');
  });

  it('sets html theme attribute on itself, by default to OS/browser setting if no localStorage preference exists', async () => {
    const el = await fixture(`<${tag}></${tag}>`);
    expect(el.theme).to.equal('light');
    expect(el.getAttribute('theme')).to.equal('light');
  });

  it('sets its own theme attribute to the global html theme attribute if set', async () => {
    document.documentElement.setAttribute('theme', '');
    const el = await fixture(`<${tag}></${tag}>`);
    expect(el.getAttribute('theme')).to.equal('');
    expect(el.theme).to.equal('');
  });

  it('changes its own theme attribute if the global theme attribute changes', async () => {
    const el = await fixture(`<${tag}></${tag}>`);
    expect(el.getAttribute('theme')).to.equal('light');
    document.documentElement.setAttribute('theme', 'dark');
    // Wait for MutationObserver to observe and act on theme change
    await nextFrame();
    expect(el.getAttribute('theme')).to.equal('dark');
    expect(el.theme).to.equal('dark');
  });
});
