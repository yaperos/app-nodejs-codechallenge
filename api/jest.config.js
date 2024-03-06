/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

module.exports = {
	transform: {
		'^.+.(t|j)sx?$': ['@swc/jest']
	},
	extensionsToTreatAsEsm: ['.ts', '.tsx'],
	collectCoverage: true,
	collectCoverageFrom: [
		'src/**/*.ts',
		'!src/**/index.ts',
		'!src/**/I**.ts',
		'!src/**/server.ts',
		'!src/**/app.ts'
	],
	coveragePathIgnorePatterns: ['infra/db/prisma'],
	coverageDirectory: 'coverage',
	coverageProvider: 'v8',
	setupFiles: ['<rootDir>/jest/setEnvVars.ts'],
	testMatch: ['**/*.spec.ts', '**/*.test.ts', '**/*.steps.ts']
};
