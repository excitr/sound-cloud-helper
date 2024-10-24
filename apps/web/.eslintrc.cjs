/** @type {import("eslint").Linter.Config} */

module.exports = {
  root: true,
  extends: ['@repo/eslint-config/next.cjs'],
  rules: {
    // Add your custom rules here
    "@typescript-eslint/no-misused-promises": "error",
    "@typescript-eslint/no-unsafe-assignment": "error" 
  },
  parserOptions: {
    project: './tsconfig.json',
  },
};