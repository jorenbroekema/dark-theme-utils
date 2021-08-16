import { exec } from 'child_process';
import mod from 'module';
import { watch } from 'chokidar';

const require = mod.createRequire(import.meta.url);

const chokidar = require('chokidar') as { watch: typeof watch };

function copyDemoFiles() {
  exec(
    'find ./demo/ -type f \\( ! -iname "*.ts" \\) | xargs cp -t ./dist-tsc/demo',
  );
}

if (process.argv[2] === '--watch') {
  chokidar.watch('./demo/!(*.ts)').on('all', (event, path) => {
    exec(`cp ${path} ./dist-tsc/demo`);
  });
}

copyDemoFiles();
