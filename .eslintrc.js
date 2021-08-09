module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    '@open-wc/eslint-config',
    'eslint-config-prettier',
    'plugin:@typescript-eslint/recommended',
    'plugin:chai-friendly/recommended',
  ],
  rules: {
    'import/extensions': 'off',
    'no-param-reassign': ['error', { props: false }],
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error'],
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': ['error'],
  },
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
};
