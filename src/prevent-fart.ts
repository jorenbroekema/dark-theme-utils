/**
 * FART (Flash of inAccurate coloR Theme) prevention
 *
 * Set theme initially, before any rendering happens, either:
 * - load this script in all <head> elements
 * - for buildless dev servers, transform hook for html files, insert it in head
 * - for build steps, insert it in .html file(s) <head> during build w transform hooks
 *
 * c8 ignore is because we can't emulate user preferring darkmode through prefers-color-scheme
 */
export function preventFart(): 'dark' | 'light' {
  const userPrefersDark = window.matchMedia(
    '(prefers-color-scheme: dark)',
  ).matches;
  const darkTheme = (localStorage.getItem('theme-dark') ||
    /* c8 ignore next */ (userPrefersDark ? 'dark' : 'light')) as
    | 'dark'
    | 'light';
  document.documentElement.setAttribute('theme', darkTheme);

  return darkTheme;
}
