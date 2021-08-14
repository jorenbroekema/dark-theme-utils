import { createRequire } from 'module';
import { exec } from 'child_process';
import { watch } from 'chokidar';

const require = createRequire(import.meta.url);

const chokidar = require('chokidar') as { watch: typeof watch };

chokidar.watch('./dist-tsc').on('all', () => {
  exec(`npx rollup -c rollup.config.js`);
});
