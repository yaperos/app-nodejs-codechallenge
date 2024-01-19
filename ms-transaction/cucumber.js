const common = [
  '--require-module ts-node/register',
  '--require-module tsconfig-paths/register',
  '--format progress-bar',
];

const backend = [
  ...common,
  'tests/acceptance/features/**/*.feature',
  '--require tests/acceptance/step_definitions/**/*.steps.ts',
].join(' ');

module.exports = {
  default: backend,
};
