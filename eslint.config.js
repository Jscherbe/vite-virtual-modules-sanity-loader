import globals from "globals";
import js from "@eslint/js";

const baseConfig = {
  languageOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    globals: {
      ...globals.node,
    },
  },
  rules: {
    "indent": ["warn", 2, { "SwitchCase": 1 }],
    "quotes": ["warn", "double"],
    "semi": ["warn", "always"],
    "no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
  }
};

export default [
  {
    ignores: [
      "node_modules/", 
      "docs/", 
      "types/", 
      ".yalc/",
      "tests/vue-vite-test/"
    ],
  },
  js.configs.recommended,
  {
    // Config for library files
    files: ["lib/**/*.js"],
    ...baseConfig
  },
  {
    // Config for test files
    files: ["tests/**/*.test.js"],
    ...baseConfig,
    languageOptions: {
      ...baseConfig.languageOptions,
      globals: {
        ...baseConfig.languageOptions.globals,
        ...globals.vitest,
      },
    },
  },
];
