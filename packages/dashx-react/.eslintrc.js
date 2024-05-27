module.exports = {
  root: true,
  extends: ['next', 'turbo', 'prettier', 'plugin:require-extensions/recommended'],
  plugins: ['require-extensions'],
  rules: {
    'import/order': [
      'error',
      {
        'newlines-between': 'always',
        groups: [['builtin', 'external'], ['parent', 'sibling', 'index'], 'type'],
      },
    ],

    'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],
    'import/newline-after-import': ['error', { count: 1 }],
  },
};
