const {
    defineConfig,
} = require("eslint/config");

const globals = require("globals");

const {
    fixupConfigRules,
    fixupPluginRules,
} = require("@eslint/compat");

const tsParser = require("@typescript-eslint/parser");
const react = require("eslint-plugin-react");
const typescriptEslint = require("@typescript-eslint/eslint-plugin");
const js = require("@eslint/js");

const {
    FlatCompat,
} = require("@eslint/eslintrc");

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

module.exports = defineConfig([
    {
        ignores: [
            "**/dist/**",
            "**/dist-electron/**",
            "**/release/**",
            "**/coverage/**",
            "**/node_modules/**",
            "**/.vite/**",
            "tailwind.config.js",
            "postcss.config.js",
            "vite.config.mjs",
            "eslint.config.cjs",
        ],
    },
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            },

            parser: tsParser,
            ecmaVersion: "latest",
            sourceType: "module",

            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },

        extends: fixupConfigRules(compat.extends(
            "eslint:recommended",
            "plugin:react/recommended",
            "plugin:react-hooks/recommended",
            "plugin:@typescript-eslint/recommended",
        )),

        plugins: {
            react: fixupPluginRules(react),
            "@typescript-eslint": fixupPluginRules(typescriptEslint),
        },

        rules: {
            "react/react-in-jsx-scope": "off",
            "react/no-unescaped-entities": "off",
            "@typescript-eslint/no-explicit-any": "warn",

            "@typescript-eslint/no-unused-vars": ["warn", {
                argsIgnorePattern: "^_",
            }],

            "@typescript-eslint/no-unsafe-function-type": "warn",
        },

        settings: {
            react: {
                version: "detect",
            },
        },
    }
]);
