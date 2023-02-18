const common = ['--require-module ts-node/register'];

const antifraud = [
	...common,
	'tests/apps/antifraud/features/**/*.feature',
	'--require tests/apps/antifraud/features/step_definitions/*.steps.ts'
].join(' ');

const transaction = [
	...common,
	'tests/apps/transaction/features/**/*.feature',
	'--require tests/apps/transaction/features/step_definitions/*.steps.ts'
].join(' ');

module.exports = {
	antifraud,
	transaction
};
