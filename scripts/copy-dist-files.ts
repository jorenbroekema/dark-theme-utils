import { exec } from 'child_process';
import path from 'path';

const fileArr = [
  'package.json',
  'README.md',
  'CHANGELOG.md',
  'LICENSE',
  '.changeset',
  'scripts/prepare.cjs',
];

const copyCmd = fileArr.reduce((acc, curr, index) => {
  let suffix = '&&';

  if (index === fileArr.length - 1) {
    suffix = '';
  }

  const dir = path.dirname(curr);

  return `${acc} cp -r ./${curr} dist-tsc${dir ? `/${dir}` : ''} ${suffix}`;
}, '');

exec(copyCmd);
