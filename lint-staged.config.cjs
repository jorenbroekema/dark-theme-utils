module.exports = {
  '*.ts': [
    () => 'tsc -p tsconfig.lint.json',
    'eslint --fix',
    'prettier --write',
  ],
};
