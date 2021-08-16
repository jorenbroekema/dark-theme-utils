import mod from 'module';
import { exec } from 'child_process';
import { watch } from 'chokidar';

const require = mod.createRequire(import.meta.url);

const chokidar = require('chokidar') as { watch: typeof watch };

chokidar.watch('./dist-tsc').on('all', () => {
  exec(`npx rollup -c rollup.config.js`);
});

// eslint-disable-next-line no-console
console.log('starting rollup watch mode to rebundle on file changes');
