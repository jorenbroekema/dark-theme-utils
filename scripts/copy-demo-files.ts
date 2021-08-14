import { exec } from 'child_process';
import { createRequire } from 'module';
import { watch } from 'chokidar';

const require = createRequire(import.meta.url);

const chokidar = require('chokidar') as { watch: typeof watch };

function copyDemoFiles() {
  exec(
    'find ./demo/ -type f \\( ! -iname "*.ts" \\) | xargs cp -t ./dist-tsc/demo',
  );
}

if (process.argv[2] === '--watch') {
  console.log('hello??');
  chokidar.watch('./demo/!(*.ts)').on('all', (event, path) => {
    console.log(path);
    exec(`cp ${path} ./dist-tsc/demo`);
  });
}

copyDemoFiles();
