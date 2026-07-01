import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    // Garde fous d'architecture : fichiers courts, fonctions simples.
    // En "warn" pour guider sans bloquer le build.
    rules: {
      "max-lines": ["warn", { max: 200, skipBlankLines: true, skipComments: true }],
      "max-lines-per-function": [
        "warn",
        { max: 120, skipBlankLines: true, skipComments: true },
      ],
      complexity: ["warn", 12],
      "max-depth": ["warn", 4],
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },
  // Toujours en dernier : désactive les règles de style en conflit avec Prettier.
  prettier,
]);

export default eslintConfig;
