export default {
  "**/*.ts": () => "yarn run tsc -p tsconfig.json",
  "*.{js,ts}": "eslint --fix",
  "*.+(js|ts|json)": "prettier --write",
};
