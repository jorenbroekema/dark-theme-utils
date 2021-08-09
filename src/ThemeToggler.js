"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.ThemeToggler = void 0;
var template = document.createElement('template');
template.innerHTML = "\n  <style>\n    :host {\n      cursor: pointer;\n    }\n\n    :host(:focus) {\n      outline: none;\n\n      border-radius: 12px;\n    }\n\n    :host(:focus) .container {\n      border: 2px solid var(--theme-toggler-focus-color, #6fa7df);\n    }\n\n    .container {\n      display: inline-flex;\n      position: relative;\n      overflow: hidden;\n      border-radius: 12.5px;\n      padding: 4px;\n      border: 2px solid var(--theme-toggler-border-color, #374151);\n      background-color: var(--theme-toggler-background-color, #f9fafb);\n    }\n\n    .sun,\n    .moon,\n    .thumb {\n      width: 18px;\n      height: 18px;\n      overflow: hidden;\n    }\n\n    .moon::selection,\n    .sun::selection {\n      color: var(--theme-toggler-background-color, #f9fafb);\n    }\n\n    .sun,\n    .moon {\n      font-size: 16px;\n      line-height: 17px;\n      width: 20px;\n      transition: all 0.2s ease-in-out;\n      transform: rotate(0deg);\n    }\n\n    .sun {\n      margin-right: 4px;\n      margin-left: -3px;\n    }\n\n    :host([theme='dark']) .sun {\n      opacity: 0;\n      transform: rotate(40deg);\n    }\n\n    :host([theme='light']) .moon {\n      opacity: 0;\n      transform: rotate(-40deg);\n    }\n\n    :host([theme='light']) .thumb {\n      right: 5px;\n      background-color: var(--theme-toggler-light-thumb-background, #eeea1b);\n      box-shadow: 0 0 0 2px var(--theme-toggler-light-thumb-border, #c8be25);\n    }\n\n    .thumb {\n      right: calc(100% - 18px - 3px);\n      transition: all 0.1s ease-in-out;\n      background-color: var(--theme-toggler-dark-thumb-border, #374151);\n      box-shadow: 0 0 0 2px var(--theme-toggler-dark-thumb-border, #111827);\n      position: absolute;\n      border-radius: 50%;\n    }\n\n    .thumb {\n      width: 16px;\n      height: 16px;\n      margin-top: 1px;\n    }\n  </style>\n  <div class=\"container\">\n    <div class=\"sun\">\u2600\uFE0F</div>\n    <div class=\"moon\">\uD83C\uDF1A</div>\n    <div class=\"thumb\"></div>\n  </div>\n";
var registeredComponents = [];
var themeObserver = new MutationObserver(function () {
    registeredComponents.forEach(function (comp) {
        comp.theme = (document.documentElement.getAttribute('theme') || 'light');
    });
});
themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['theme']
});
var ThemeToggler = /** @class */ (function (_super) {
    __extends(ThemeToggler, _super);
    function ThemeToggler() {
        var _this = _super.call(this) || this;
        _this.boundKeyDown = _this.keyDown.bind(_this);
        _this.boundToggle = _this.toggle.bind(_this);
        _this.shadowRoot = _this.attachShadow({ mode: 'open' });
        registeredComponents.push(_this);
        _this.shadowRoot.appendChild(template.content.cloneNode(true));
        return _this;
    }
    Object.defineProperty(ThemeToggler.prototype, "theme", {
        get: function () {
            return (this.getAttribute('theme') || 'light');
        },
        set: function (value) {
            this.setAttribute('aria-checked', value === 'dark' ? 'true' : 'false');
            this.setAttribute('theme', value);
        },
        enumerable: false,
        configurable: true
    });
    ThemeToggler.prototype.connectedCallback = function () {
        this.setup();
    };
    ThemeToggler.prototype.disconnectedCallback = function () {
        this.removeEventListener('keydown', this.boundKeyDown);
        this.removeEventListener('click', this.boundToggle);
    };
    ThemeToggler.prototype.toggle = function () {
        if (document.documentElement.getAttribute('theme') === 'light') {
            this.setTheme('dark', true);
        }
        else {
            this.setTheme('light', true);
        }
    };
    ThemeToggler.prototype.setTheme = function (theme, store) {
        if (store === void 0) { store = false; }
        this.theme = theme;
        document.documentElement.setAttribute('theme', theme);
        if (store) {
            localStorage.setItem('theme-dark', theme);
        }
    };
    ThemeToggler.prototype.setup = function () {
        this.setupInitialTheme();
        this.setAttribute('tabindex', '0');
        this.setAttribute('role', 'switch');
        this.setAttribute('aria-label', 'Site theme toggler, dark and light');
        this.addEventListener('keydown', this.boundKeyDown);
        this.addEventListener('click', this.boundToggle);
    };
    ThemeToggler.prototype.setupInitialTheme = function () {
        var _this = this;
        var userPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        // Priority is: 1) saved preference 2) browser/os preference 3) default 'light'
        this.theme =
            localStorage.getItem('theme-dark') ||
                (userPrefersDark ? 'dark' : 'light');
        // Respond to user preference changes on OS and Browser
        window
            .matchMedia('(prefers-color-scheme: dark)')
            .addEventListener('change', function (ev) {
            // follow OS preference, by removing from preference local storage
            localStorage.removeItem('theme-dark');
            if (ev.matches) {
                _this.setTheme('dark');
            }
            else {
                _this.setTheme('light');
            }
        });
    };
    ThemeToggler.prototype.keyDown = function (ev) {
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
    };
    return ThemeToggler;
}(HTMLElement));
exports.ThemeToggler = ThemeToggler;
