module.exports = {
  root: true,
  env: {
    node: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "plugin:prettier/recommended",
  ],
  plugins: ["@typescript-eslint", "import"],
  rules: {
    "no-console": "off",
    "prettier/prettier": "warn",
    "no-undef": "off",
    "no-var": "error",
    "sort-imports": ["warn", { ignoreDeclarationSort: true }],
    "import/order": [
      "warn",
      { alphabetize: { order: "asc" }, "newlines-between": "never" },
    ],
    "import/no-unresolved": [
      "error",
      { ignore: ["^@app-nodejs-codechallenge/*"] },
    ],
  },
  overrides: [
    {
      files: ["./src/**/*.ts"],
      rules: {
        "no-console": "off",
      },
    },
  ],
  settings: {
    "import/resolver": {
      typescript: true,
      node: true,
    },
  },
};
