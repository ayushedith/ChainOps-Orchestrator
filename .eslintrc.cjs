module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.base.json']
  },
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  rules: {}
};
