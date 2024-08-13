import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  {
    env: {
      node: true,
      commonjs: true,
    },
    extends: "eslint:recommended",
    rules: {
      indent: ["error", "tab"],
      "linebreak-style": ["error", "unix"],
      quotes: ["error", "single"],
      semi: ["error", "always"],
    },
    parserOptions: {
      ecmaVersion: 2015,
    },
  },
];
