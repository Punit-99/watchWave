import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import eslintConfigPrettier from "eslint-config-prettier";

export default defineConfig([
  ...nextVitals,
  ...nextTs,

  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),

  {
    rules: {
      /**
       * ============================
       * TypeScript
       * ============================
       */

      "@typescript-eslint/no-explicit-any": "warn",

      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],

      "@typescript-eslint/no-empty-object-type": "error",

      "@typescript-eslint/no-require-imports": "error",

      /**
       * ============================
       * React
       * ============================
       */

      "react-hooks/rules-of-hooks": "error",

      "react-hooks/exhaustive-deps": "warn",

      "react-hooks/set-state-in-effect": "warn",

      "react-hooks/static-components": "warn",

      "react-hooks/incompatible-library": "warn",

      /**
       * ============================
       * Next.js
       * ============================
       */

      "@next/next/no-img-element": "warn",

      /**
       * ============================
       * Accessibility
       * ============================
       */

      "jsx-a11y/alt-text": "warn",

      /**
       * ============================
       * JavaScript
       * ============================
       */

      "no-console": [
        "warn",
        {
          allow: ["warn", "error"],
        },
      ],

      "no-debugger": "error",

      "no-var": "error",

      "prefer-const": "error",

      eqeqeq: ["error", "always"],

      curly: ["error", "all"],

      "object-shorthand": ["error", "always"],

      "prefer-template": "error",
    },
  },
  eslintConfigPrettier,
]);
