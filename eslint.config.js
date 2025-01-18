import globals from 'globals';
import pluginJs from '@eslint/js';

export default [
  pluginJs.configs.recommended,
  {
    files: ["src/**/*.js"],
    languageOptions: {
        globals: {
          ...globals.node,
        },
    },
    rules: {
      "quotes": ["error", "single", { "avoidEscape": true }],
      "semi":   ["error", "always", { "omitLastInOneLineBlock": true}],
      "no-console": "off",
      "no-trailing-spaces": ["error"],
      "indent": ["error", 4, { "SwitchCase": 1 }]
    }
  }
];
