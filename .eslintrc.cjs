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
  overrides: [
    {
      files: ['scripts/**/*'],
      rules: {
        // scripts are dev-scripts, so dependencies can be in dev deps
        'import/no-extraneous-dependencies': 'off',
        // require from createRequire should be allowed for NodeJS scripts which use CJS deps
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
  ],
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
};
