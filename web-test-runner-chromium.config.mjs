import { playwrightLauncher } from '@web/test-runner-playwright';
import baseConfig from './web-test-runner.config.mjs';

export default {
  ...baseConfig,
  watch: true,
  coverage: false,
  browsers: [playwrightLauncher({ product: 'chromium' })],
};
