module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'no-multi-spaces': 'error',
    'no-spaced-func': 'error',
    'space-before-function-paren': 'off',
    'space-in-parens': 'error',
    'space-infix-ops': 'error',
    'space-before-blocks': 'error',
    'space-unary-ops': 'error',
    'indent': [
        'error',
        4,
        {
            'SwitchCase': 1
        }
    ],
    'quotes': [
        'error',
        'single'
    ],
    'semi': [
        'error',
        'always'
    ],
    'react/react-in-jsx-scope': 'off',
    'jsx-quotes': [
        'error',
        'prefer-single'
    ],
    '@typescript-eslint/no-empty-function': 'warn'
  },
}
