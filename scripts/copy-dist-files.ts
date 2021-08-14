import { exec } from 'child_process';

const fileArr = [
  'package.json',
  'README.md',
  'CHANGELOG.md',
  'LICENSE',
  '.changeset',
];

const copyCmd = fileArr.reduce((acc, curr, index) => {
  let suffix = '&&';

  if (index === fileArr.length - 1) {
    suffix = '';
  }
  return `${acc} cp -r ./${curr} dist-tsc ${suffix}`;
}, '');

exec(copyCmd);
