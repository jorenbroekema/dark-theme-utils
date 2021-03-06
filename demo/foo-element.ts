import { ThemeMixin } from '../src/ThemeMixin';

class FooElement extends ThemeMixin(HTMLElement) {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    if (super.connectedCallback) {
      super.connectedCallback();
    }
    this.render();
  }

  render() {
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = `
      <style>
        :host {
          width: 20px;
          height: 20px;
          display: block;
          background-color: black;
          transition: var(--theme-background-transition);
        }

        :host([theme="dark"]) {
          background-color: white;
        }
      </style>
    `;
    }
  }
}
customElements.define('foo-element', FooElement);
