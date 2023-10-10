const common = ['--require-module ts-node/register'];

const transaction = [
	...common,
	'tests/apps/transaction/features/**/*.feature',
	'--require tests/apps/transaction/features/stepDefinitions/*.steps.ts'
].join(' ');

module.exports = {
	transaction
};
