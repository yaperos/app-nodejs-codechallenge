const config = require('./jest.config');
config.testMatch = ['**/*.spec.ts'];
config.coveragePathIgnorePatterns = [
	...config.coveragePathIgnorePatterns,
	".test.ts",
	".steps.ts",
	".routes.ts",
],
module.exports = config;
