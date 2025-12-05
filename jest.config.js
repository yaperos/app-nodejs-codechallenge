/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  // Use ts-jest so Jest can run tests written in TypeScript
  preset: 'ts-jest',
  testEnvironment: 'node',

  // Tell Jest how to handle .ts files before running the tests
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },

  // Where Jest should look for test files
  testMatch: ['**/src/**/*.test.ts'],

  // Skip transforming anything inside node_modules (keeps things fast and clean)
  transformIgnorePatterns: ['<rootDir>/node_modules/'],

  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json', // Reuse the project's main TS config
    },
  },

  // Show more detailed output when running tests
  verbose: true,

  // Enable coverage reporting
  collectCoverage: true,
  coverageDirectory: 'coverage', // Folder where Jest will store coverage reports
};
