import { expect } from '@open-wc/testing';
import { preventFart } from '../src/prevent-fart';

describe('preventFart()', () => {
  afterEach(() => {
    localStorage.removeItem('theme-dark');
  });

  it('sets html theme attribute, by default to OS/browser setting if no localStorage preference exists', async () => {
    preventFart();
    expect(document.documentElement.getAttribute('theme')).to.equal('light');
  });

  it('uses preference from localStorage if it exists', async () => {
    localStorage.setItem('theme-dark', 'dark');
    preventFart();
    expect(document.documentElement.getAttribute('theme')).to.equal('dark');
  });

  it('returns the correct current theme', async () => {
    let theme = preventFart();
    expect(theme).to.equal('light');
    localStorage.setItem('theme-dark', 'dark');
    theme = preventFart();
    expect(theme).to.equal('dark');
  });
});
