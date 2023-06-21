/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/en/configuration.html
 */

// eslint-disable-next-line import/no-default-export
export default {
  verbose: true,
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: './src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  moduleNameMapper: {},
  coveragePathIgnorePatterns: [
  ],
  coverageThreshold: {
    global: {
      lines: 85,
      branches: 70,
      functions: 80,
    },
  }
};
