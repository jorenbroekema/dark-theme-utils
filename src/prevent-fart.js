/**
 * FART (Flash of inAccurate coloR Theme) prevention
 *
 * Set theme initially, before any rendering happens, either:
 * - load this script in all <head> elements
 * - for buildless dev servers, transform hook for html files, insert it in head
 * - for build steps, insert it in .html file(s) <head> during build w transform hooks
 */
var userPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
var darkTheme = localStorage.getItem('theme-dark') || (userPrefersDark ? 'dark' : 'light');
document.documentElement.setAttribute('theme', darkTheme);
